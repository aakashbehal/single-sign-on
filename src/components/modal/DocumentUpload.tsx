
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
    const [jsonForRequest, setJsonForRequest] = useState([])
    const [documentTypeFromName, setDocumentTypeFromName] = useState<any>(null)

    const {
        documentTypes
    } = useSelector((state: any) => ({
        documentTypes: state.types.documentType.data,
    }))

    useEffect(() => {
        const type = userService.getUserType()
        setUserType(type)
        if (parentComponent === 'documentNotSummary_request') {
            getNotList()
        }
    }, [])

    useEffect(() => {
        if (fileToUpload && JSON.stringify(fileToUpload) !== "{}") {
            uploadFile()
        }
    }, [fileToUpload])

    const downloadExcel = (fileName: any, data: any) => {
        let settings = {
            fileName
        }
        xlsx(data, settings)
    }

    const getNotList = async () => {
        console.log(details)
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
                formData.append("files", file);
                formData.append("files", matrixFile)
                formData.append("fileUploadVan", JSON.stringify({ "bulkType": "upload" }))
                API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk`
                const response = await axiosCustom.post(API_URL, formData, config)
                const urls = handleResponse(response)
                const responseFilePath = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk/read`,
                    {
                        "orgType": "CT",
                        "excelUrl": urls.response.fileUrl[1],
                        "zipUrl": urls.response.fileUrl[0],
                        "bulkType": "upload"
                    }
                )
                handleResponse(responseFilePath)
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
                    formData.append("data", JSON.stringify({ "accountNumber": details.accountId, "docType": document_type.value }));
                    formData.append("file", file);
                } else if (parentComponent === "receiveDocumentRequest" && details !== null) {
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/fullfill`
                    formData.append("file", file);
                    formData.append("id", JSON.stringify(details.id))
                    // ===================================================
                    // formData.append("clientShortCode", JSON.stringify())
                } else if (parentComponent === "sentDocumentRequest" || parentComponent === 'documentNotSummary_request') {
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk`
                    formData.append("files", file);
                    formData.append("fileUploadVan", JSON.stringify({ "bulkType": "SendRequestDocument" }))
                } else if (parentComponent === 'documentNotSummary') {
                    API_URL = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/specific/accounts`;
                    const requestObj = {
                        docTypeCode: details.docTypeCode
                    }
                    formData.append("file", file);
                    formData.append("data", JSON.stringify(requestObj));
                } else {
                    formData.append("file", file);
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
            throw error
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

    const downloadSampleFile = () => {
        let sampleFile = ''
        if (parentComponent === 'myDocument') {
            sampleFile = "./sample_file_upload.xlsx"
        } else {
            sampleFile = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/download`
        }
        axiosCustom.get(sampleFile, { responseType: 'arraybuffer' })
            .then((response: any) => {
                var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'SendRequestDocumentSample.xlsx');
            });
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
                    (parentComponent === 'myDocument' || parentComponent === 'receiveDocumentRequest')
                    && files.length > 1
                    &&
                    <Col sm={12} className='no_padding'>
                        <br />
                        <p>Please download the <b>Matrix file</b> and update the columns to help system establish connection between the files being uploaded and system.</p>
                        <Col sm={12} className='no_padding'>
                            <Button variant="dark" type="submit" onClick={() => downloadExcel('matrix', SAMPLE_UPLOAD)} style={{ width: '100%' }}>Download Sample File</Button>
                        </Col>
                    </Col>
                }
                {
                    parentComponent === 'documentNotSummary_request'
                    &&
                    <Col sm={12} className='no_padding'>
                        <br />
                        <p>Please download the <b>Matrix file</b> and update the columns to help system establish connection between the files being uploaded and system.</p>
                        <Col sm={12} className='no_padding'>
                            <Button variant="dark" type="submit" onClick={() => downloadExcel('matrix', jsonForRequest)} style={{ width: '100%' }}>Download Sample File</Button>
                        </Col>
                    </Col>
                }
                {
                    parentComponent === 'sentDocumentRequest'
                    && <Col sm={12} className='no_padding'>
                        <br />
                        <p>Please download the sample file to get idea about the fields you need to pass to raise bulk document request</p>
                        <Col sm={12} className='no_padding'>
                            <Button variant="dark" type="submit" onClick={downloadSampleFile} style={{ width: '100%' }}>Download Sample File</Button>
                        </Col>
                    </Col>
                }
            </Modal.Footer>
        </Modal >
    )
}

export default DocumentUpload