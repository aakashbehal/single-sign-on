
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Modal, Form, OverlayTrigger, Tooltip, Row } from 'react-bootstrap';
import { BsFileEarmarkPdf, BsFillFileEarmarkImageFill } from 'react-icons/bs';
import { CgSpinnerAlt, CgSoftwareUpload } from 'react-icons/cg';
import { MdOutlineDelete } from 'react-icons/md';
import { SiMicrosoftexcel } from 'react-icons/si';
import { GrDocumentZip } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { saveAs } from 'file-saver';
import xlsx from 'json-as-xlsx';

import { createMessage } from '../../helpers/messages';
import { axiosCustom, formatBytes, handleResponse } from '../../helpers/util';
import { SummaryActionCreator } from '../../store/actions/summary.actions';
import FileUploadHook from '../CustomHooks/FileUploadHook';
import DocumentTypes from '../Common/DocumentType';
import { userService } from '../../services';
import { FileNameConfigActionCreator } from '../../store/actions/fileNameConfig.actions';

const SAMPLE_UPLOAD = [
    {
        sheet: "Matrix",
        columns: [
            { label: "Document Type" },
            { label: "Product Code" },
            { label: "Original Account Number" },
            { label: "Client Account Number" },
            { label: "Document Generation Date" },
            { label: "Equabli Account Number" },
            { label: "Client Short Code" },
            { label: "File Name" }
        ],
        content: [],
    }
]

const DocumentUpload = ({ show, onHide, accountId, Styles, parentComponent, search, details = null }: any) => {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const documentTypeRef = useRef<any>();
    const [fileToUpload, { zipTargetFiles }] = FileUploadHook(null)
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<any>(null);
    const [files, setFiles] = useState<any>([])
    const [formSubmitted, setFormSubmitted] = useState<any>(false)
    const [formError, setFormError] = useState<any>({
        fileLengthSingle: false,
        fileSize: false
    })
    const [userType, setUserType] = useState<string>('')
    const [profileImageTemp, setProfileImageTemp] = useState<any>()
    const [noMatrixFile, SetNoMatrixFile] = useState(false);

    const [documentTypeFromName, setDocumentTypeFromName] = useState<any>(null)

    const {
        documentTypes,
        confListLoading,
        confListError,
        confList,
    } = useSelector((state: any) => ({
        documentTypes: state.types.documentType.data,
        confListLoading: state.fileNameConfig.fileNamingConfigList.loading,
        confListError: state.fileNameConfig.fileNamingConfigList.error,
        confList: state.fileNameConfig.fileNamingConfigList.data,
    }))

    useEffect(() => {
        dispatch(FileNameConfigActionCreator.getListOfUserConfig())
        const type = userService.getUserType()
        setUserType(type)
    }, [])

    useEffect(() => {
        if (fileToUpload && JSON.stringify(fileToUpload) !== "{}") {
            uploadFile()
        }
    }, [fileToUpload])

    const validateUpload = (formObj: any) => {
        let formIsValid = true;
        const error: any = {
            file: false
        }
        if (formObj.file === 0) {
            error['fileLengthSingle'] = true
        }
        for (let key in formObj) {
            if (!formObj[key] || formObj[key] === "") {
                error[key] = true
            }
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        setFormError(error)
        return formIsValid
    }

    const onSubmitHandler = async (e: any) => {
        e.preventDefault();
        if (validateUpload({
            file: files.length
        })) {
            setFormSubmitted(true)
            zipTargetFiles(files)
        }
    }

    const uploadFile = async () => {
        SetNoMatrixFile(false)
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload`
        const { file, matrixFile } = fileToUpload
        if ((parentComponent === 'myDocument' || parentComponent === 'receiveDocumentRequest') && files.length > 1 && !matrixFile) {
            setFormSubmitted(false)
            SetNoMatrixFile(true)
            return
        }
        let formData: any = new FormData()
        try {
            // size of the file should not be more than 10
            if (file.size > 10485760) {
                addToast(createMessage('info', `FILE_LARGE`, ''), { appearance: 'info', autoDismiss: true })
                setFormSubmitted(false)
                return
            }
            if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
                formData.append("doc", file);
                formData.append("doc", matrixFile)
                API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk`
                const response = await axiosCustom.post(API_URL, formData, config)
                handleResponse(response)
                addToast(createMessage('success', `uploaded`, 'File'), { appearance: 'success', autoDismiss: true })
                setFormSubmitted(false)
                onHide()
            } else {
                if (parentComponent === 'profile') {
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_USER_SERVICE}/v1/users/uploadProfilePic`
                    formData.append("file", file);
                } else if (parentComponent === 'documents') {
                    const {
                        document_type
                    } = documentTypeRef.current
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/account`
                    formData.append("accountNumber", details.accountId);
                    formData.append("docType", document_type.value);
                    formData.append("doc", file);
                } else if (parentComponent === "receiveDocumentRequest" && details !== null) {
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/fullfill`
                    formData.append("doc", file);
                    formData.append("id", details.id)
                    // ===================================================
                    // formData.append("clientShortCode", JSON.stringify())
                } else if (parentComponent === "sentDocumentRequest" || parentComponent === 'documentNotSummary_request') {
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk/sentRequest`
                    formData.append("doc", file);
                } else if (parentComponent === 'documentNotSummary') {
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/specific/accounts`;
                    formData.append("doc", file);
                    formData.append("docTypeCode", details.docTypeCode);
                } else {
                    formData.append("doc", file);
                }
                const response = await axiosCustom.post(API_URL, formData, config)
                handleResponse(response)
                addToast(createMessage('success', `uploaded`, 'File'), { appearance: 'success', autoDismiss: true })
                setFormSubmitted(false)
                onHide()
            }
            // dispatch(SummaryActionCreator.getReceiveSummary())
            dispatch(SummaryActionCreator.getSentSummary({}))
            search()
        } catch (error: any) {
            setFormSubmitted(false)
            addToast(createMessage('error', `uploading`, 'file'), { appearance: 'error', autoDismiss: false })
            // throw error.message.message
        }
    }

    // handle drag events
    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFiles = (file: any) => {
        let tempFiles = Object.assign([], files)
        if (parentComponent === 'profile') {
            var reader = new FileReader();
            var url = reader.readAsDataURL(file[0]);
            reader.onloadend = function (e) {
                setProfileImageTemp(reader.result)
            }
        } if (parentComponent !== 'documents') {
            if (tempFiles.length === 0) {
                tempFiles = Array.from(file)
            } else {
                tempFiles = [...tempFiles, ...Array.from(file)]
            }
        } else {
            const documentTypesCodes = documentTypes.map((dT: any) => dT.shortCode)
            const fileArray: any = Array.from(file)
            documentTypesCodes.map((dTc: any) => {
                if (fileArray[0].name.includes(`_${dTc}_`)) {
                    setDocumentTypeFromName(dTc)
                }
            })
            tempFiles = Array.from(file)
        }
        setFiles(tempFiles)
    }

    // triggers when file is dropped
    const handleDrop = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // triggers when file is selected with click
    const handleChange = function (e: any) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
        if (parentComponent !== 'profile') {
            inputRef.current.click();
        } else {
            ProfileRef.current.click()
        }
    };

    const deleteHandler = (index: any) => {
        let tempFiles = Object.assign([], files)
        tempFiles.splice(index, 1);
        setFiles(tempFiles)
    }

    const ProfileRef = useRef<any>()

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" >
                    {
                        (
                            parentComponent === 'myDocument'
                            || parentComponent === 'documents'
                            || parentComponent === 'documentNotSummary'
                            || parentComponent === 'documentNotSummary_request'
                        )
                            ? "Upload New Document"
                            :
                            (parentComponent === 'sentDocumentRequest'
                                ? 'Upload file for bulk document request'
                                : '')
                    }
                    {
                        parentComponent === 'profile'
                        && "Upload Profile Picture"
                    }
                    {
                        parentComponent === 'receiveDocumentRequest'
                        && "Upload File to FulFill the request"
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Col sm={12}>
                        {
                            parentComponent !== 'profile'
                            &&
                            <div className={Styles.list_upload_container}>
                                {
                                    files && files.length > 0 && files.map((file: any, index: any) => {
                                        return <div className={Styles.list_upload} key={`file_${index}`}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Col sm={6} >
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {file.type === 'application/x-zip-compressed' && <GrDocumentZip />}
                                                        {
                                                            file.type === 'application/pdf'
                                                            && <BsFileEarmarkPdf />
                                                        }
                                                        {
                                                            (file.type === 'image/png' || file.type === 'image/jpeg')
                                                            && <BsFillFileEarmarkImageFill />
                                                        }
                                                        {
                                                            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                                            && <SiMicrosoftexcel />
                                                        }
                                                        <OverlayTrigger
                                                            key={`sw_${index}`}
                                                            placement="bottom"
                                                            delay={{ show: 250, hide: 400 }}
                                                            overlay={(
                                                                <Tooltip id="tooltip-error">
                                                                    {file.name}
                                                                </Tooltip>
                                                            )}
                                                        >
                                                            <span style={{ marginLeft: '.5rem' }} className={Styles.file_name}>{file.name}</span>
                                                        </OverlayTrigger>
                                                    </div>
                                                </Col>
                                                <Col sm={5} >
                                                    {
                                                        parentComponent === 'documents'
                                                        && <form ref={documentTypeRef}>
                                                            <DocumentTypes selectedValue={documentTypeFromName || ''} />
                                                        </form>
                                                    }
                                                </Col>
                                                <Col sm={1} >
                                                    <MdOutlineDelete onClick={() => deleteHandler(index)} size={25} style={{ marginRight: '.5rem', color: 'red', cursor: 'pointer' }} />
                                                </Col>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        }
                        <Col md={12} sm={12}>
                            <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                                {
                                    parentComponent !== 'profile'
                                    && <input
                                        ref={inputRef}
                                        type="file"
                                        id="input-file-upload"
                                        accept="image/png, image/jpeg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .zip"
                                        multiple={parentComponent === 'documents' || parentComponent === 'documentNotSummary_request' ? false : true}
                                        onChange={handleChange}
                                    />
                                }
                                {
                                    parentComponent === 'profile' && !profileImageTemp
                                    && <input
                                        onChange={handleChange}
                                        ref={ProfileRef}
                                        type="file"
                                        name="user_image"
                                        id="input-file-upload"
                                        accept="image/png, image/jpeg"
                                    />
                                }
                                {
                                    profileImageTemp &&
                                    <div className='temp_image'>
                                        <img src={profileImageTemp} alt="" />
                                    </div>
                                }
                                {
                                    !profileImageTemp &&
                                    <label id="label-file-upload" className={dragActive ? "drag-active" : ""}>
                                        <div>
                                            <CgSoftwareUpload size={60} color={'#5070e1'} onClick={onButtonClick} cursor='pointer' />
                                            <p style={{ fontSize: '1.5rem', color: '#99a2b0', margin: 0 }}>Drop Files here or <span onClick={onButtonClick} style={{ color: '#5070e1', fontWeight: 'bold', fontSize: '2.2rem', cursor: 'pointer' }}>Click here</span></p>
                                            <p style={{ color: '#b0b8c3' }}>*Please note that png, jpeg, pdf files are allowed</p>
                                        </div>
                                    </label>
                                }
                                {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}

                            </form>
                            <span className={Styles.form_error}><small>{formError["fileLengthSingle"] ? 'File is required' : ''}</small></span>
                            <span className={Styles.form_error}><small>{noMatrixFile ? 'Matrix File is required' : ''}</small></span>
                        </Col>
                    </Col>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{ padding: '1rem 4rem 2rem' }} className="sent_bulk_request">
                {
                    formSubmitted &&
                    <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                }
                <Col sm={12} className='no_padding'>
                    <Button variant="dark" type="submit" disabled={formSubmitted} onClick={onSubmitHandler} style={{ width: '100%' }}>Upload</Button>
                </Col>
                {
                    ((parentComponent === 'sentDocumentRequest'))
                    && <DownloadSample details={details} confList={confList} parentComponent={parentComponent} />
                }
                {
                    ((parentComponent === 'myDocument' || parentComponent === 'receiveDocumentRequest'))
                    && <DownloadSample details={details} confList={confList} parentComponent={parentComponent} />
                }
                {
                    ((parentComponent === 'documentNotSummary_request'))
                    && <DownloadSample details={details} confList={confList} parentComponent={parentComponent} />
                }

            </Modal.Footer>
        </Modal >
    )
}

const DownloadSample = ({ confList, parentComponent, details }: { confList: any, parentComponent: string, details: any }) => {
    const formRefDownload = useRef<any>()
    const { addToast } = useToasts();
    const [jsonForRequest, setJsonForRequest] = useState([])
    const [groupError, setGroupError] = useState<boolean>(false)

    useEffect(() => {
        if (parentComponent === 'documentNotSummary_request') {
            getNotList()
        }
    }, [])

    const getNotList = async () => {
        try {
            const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/summary/accounts/not`, {
                pageSize: details.pageSize,
                pageNumber: details.pageNumber - 1,
                docTypeCode: details.docTypeCode,
                tenure: details.duration === 'null' ? null : details.duration,
                portfolio: details.portfolio === 'null' ? null : details.portfolio,
                productCode: details.productCode === 'null' ? null : details.productCode,
                userId: details.userId === 'null' ? null : details.userId
            })
            const data = handleResponse(response)
            const objToDownload: any = [
                {
                    sheet: "Matrix",
                    columns: [
                        { label: "Document Type", value: "documentType" },
                        { label: "Requested From", value: "requestedFrom" },
                        { label: "Original Account Number", value: "originalAccountNumber" },
                        { label: "Client Account Number", value: "clientAccountNumber" },
                        { label: "Equabli Account Number", value: "equabliAccountNumber" },
                        { label: "Client Short Code", value: "clientShortCode" }
                    ],
                    content: [],
                }
            ]
            const tempJson = data && data.response && data.response.datas.map((data: any) => {
                let obj = {
                    "documentType": details.docTypeCode,
                    "requestedFrom": "",
                    "originalAccountNumber": "",
                    "clientAccountNumber": data,
                    "equabliAccountNumber": "",
                    "clientShortCode": ""
                }
                return obj
            })
            objToDownload[0].content = tempJson
            setJsonForRequest(objToDownload)
        } catch (err) {
            console.log(err)
        }
    }

    const downloadExcel = (fileName: any, data: any) => {
        let settings = {
            fileName
        }
        try {
            xlsx(data, settings)
        } catch (err) {
            console.log(err)
        }
    }

    // SendRequestDocument
    const downloadSampleFile = (event: any, type: string) => {
        event.preventDefault()
        const {
            document_group
        } = formRefDownload.current
        let sampleFile = ''
        if (type === 'documentNotSummary_request') {
            downloadExcel('matrix', SAMPLE_UPLOAD)
        } else {
            if (type === 'sentDocumentRequest') {
                sampleFile = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/download?namingCofingGroupName=SendRequestDocument`
            } else {
                if (!document_group?.value) {
                    setGroupError(true)
                    return
                }
                sampleFile = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/download?namingCofingGroupName=${document_group.value}`
            }
            addToast(createMessage('info', `DOWNLOAD_STARTED`, ''), { appearance: 'info', autoDismiss: true })
            axiosCustom.get(sampleFile, { responseType: 'arraybuffer' })
                .then((response: any) => {
                    var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    if (type !== 'sentDocumentRequest') {
                        saveAs(blob, `matrix_${document_group.value}.xlsx`);
                    } else {
                        saveAs(blob, `SentDocumentRequest.xlsx`);
                    }
                });
            addToast(createMessage('info', `DOWNLOAD_SUCCESSFUL`, ''), { appearance: 'success', autoDismiss: true })
        }
    }

    return <Col sm={12} className='no_padding'>
        <hr />
        <p>Please download the <b>Matrix file</b> and update the columns to help system establish connection between the files being uploaded and system.</p>
        <Row>
            <Col sm={12}>
                <Form ref={formRefDownload}>
                    <Row>
                        {
                            parentComponent !== 'sentDocumentRequest'
                            && parentComponent !== 'documentNotSummary_request'
                            &&
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12} className="no_padding">
                                        <Form.Control
                                            as="select"
                                            name="document_group"
                                            className="select_custom white"
                                        >
                                            <option value="" disabled selected>Select Document Name Group</option>
                                            {
                                                (confList && confList.length > 0) &&
                                                confList.map((conf: any, index: number) => {
                                                    return <option key={`cr_${index}`} value={conf.namingConfigGroupName}>{conf.namingConfigGroupName}</option>
                                                })
                                            }
                                        </Form.Control>
                                        <span style={{ color: 'red' }}><small>{groupError ? 'Document Name Group is Required' : ''}</small></span>
                                    </Col>
                                </Form.Group>
                            </Col >
                        }
                        <Col lg={(parentComponent !== 'sentDocumentRequest' && parentComponent !== 'documentNotSummary_request') ? 6 : 12} md={12} className='no_padding'>
                            <Form.Group as={Col} className="mb-4">
                                {
                                    parentComponent === 'sentDocumentRequest'
                                    && <Button variant="dark" type="submit" onClick={(event: any) => downloadSampleFile(event, 'sentDocumentRequest')} style={{ width: '100%', padding: '10px' }}>Download Sample File</Button>
                                }
                                {
                                    (parentComponent === 'myDocument' || parentComponent === 'receiveDocumentRequest')
                                    && <Button variant="dark" type="submit" onClick={(event: any) => downloadSampleFile(event, 'myDocument')} style={{ width: '100%', padding: '10px' }}>Download Sample File</Button>
                                }
                                {
                                    parentComponent === 'documentNotSummary_request'
                                    && <Button variant="dark" type="submit" onClick={(event: any) => downloadSampleFile(event, 'documentNotSummary_request')} style={{ width: '100%', padding: '10px' }}>Download Sample File</Button>
                                }
                            </Form.Group>
                        </Col>
                    </Row >
                </Form >
            </Col>
        </Row>
    </Col>
}

export default DocumentUpload