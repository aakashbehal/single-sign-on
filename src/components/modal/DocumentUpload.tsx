import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal } from 'react-bootstrap';
import { BsFileEarmarkPdf, BsFillFileEarmarkImageFill } from 'react-icons/bs';
import { CgSpinnerAlt, CgSoftwareUpload } from 'react-icons/cg';
import { MdOutlineDelete } from 'react-icons/md';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { saveAs } from 'file-saver';
import { exportToExcel } from 'react-json-to-excel';

import { createMessage } from '../../helpers/messages';
import { axiosCustom, handleResponse } from '../../helpers/util';
import { SummaryActionCreator } from '../../store/actions/summary.actions';
import FileUploadHook from '../CustomHooks/FileUploadHook';

const SAMPLE_UPLOAD = [{
    "Document Type": "",
    "Portfolio id": "",
    "Original Account Number": "",
    "Client Account Number": "",
    "Document Generation Date": "",
    "Equabli Account Number": "",
    "File Name": "",
}]

const DocumentUpload = ({ show, onHide, accountId, Styles, parentComponent, search, details = null }: any) => {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [fileToUpload, { zipTargetFiles }] = FileUploadHook(null)
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<any>(null);
    const [files, setFiles] = useState<any>([])
    const [formSubmitted, setFormSubmitted] = useState<any>(false)
    const [formError, setFormError] = useState<any>({
        fileLengthSingle: false,
        fileSize: false
    })
    const [noMatrixFile, SetNoMatrixFile] = useState(false);
    const [jsonForRequest, setJsonForRequest] = useState({})

    useEffect(() => {
        if (parentComponent === 'documentNotSummary_request') {
            getNotList()
        }
    }, [])

    useEffect(() => {
        if (fileToUpload && JSON.stringify(fileToUpload) !== "{}") {
            uploadFile()
        }
    }, [fileToUpload])

    const getNotList = async () => {
        try {
            const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/summary/accounts/not`, {
                pageSize: details.pageSize,
                pageNumber: details.pageNumber - 1,
                docTypeCode: details.docTypeCode,
                tenture: details.tenture === 'null' ? null : details.tenture,
                portfolio: details.portfolio === 'null' ? null : details.portfolio,
                productCode: details.productCode === 'null' ? null : details.productCode,
                userId: details.userId === 'null' ? null : details.userId
            })
            const data = handleResponse(response)
            const tempJson = data && data.response && data.response.datas.map((data) => {
                let obj = {
                    "Document Type": details.docTypeCode,
                    "Requested From": "",
                    "Original Account Number": "",
                    "Client Account Number": data,
                    "Equabli Account Number": ""
                }
                return obj
            })
            setJsonForRequest(tempJson)
        } catch (err) {
            console.log(err)
        }
    }

    const validateUpload = (formObj) => {
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
        let API_URL = `${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload`
        const { file, matrixFile } = fileToUpload
        if (parentComponent === 'myDocument' && files.length > 1 && !matrixFile) {
            setFormSubmitted(false)
            SetNoMatrixFile(true)
            return
        }
        let formData: any = new FormData()
        try {
            if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
                formData.append("files", file);
                formData.append("files", matrixFile)
                formData.append("fileUploadJson", JSON.stringify({ "bulkType": "upload" }))
                API_URL = `${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk`
                const response = await axiosCustom.post(API_URL, formData, config)
                const urls = handleResponse(response)
                const responseFilePath = await axiosCustom.post(`${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk/read`,
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
                if (parentComponent === "receiveDocumentRequest" && details !== null) {
                    API_URL = `${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/fullfill`
                    formData.append("file", file);
                    formData.append("id", JSON.stringify(details.id))
                } else if (parentComponent === "sentDocumentRequest" || parentComponent === 'documentNotSummary_request') {
                    API_URL = `${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/bulk`
                    formData.append("files", file);
                    formData.append("fileUploadVan", JSON.stringify({ "bulkType": "SendRequestDocument" }))
                } else if (parentComponent === 'documentNotSummary') {
                    API_URL = `${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload/specific/accounts`;
                    const requestObj = {
                        docTypeCode: details.docTypeCode,
                        // tenure: details.tenture === 'null' ? null : details.tenture,
                        // portfolio: details.portfolio === 'null' ? null : details.portfolio,
                        // productCode: details.productCode === 'null' ? null : details.productCode,
                        // userId: details.userId === 'null' ? null : details.userId
                    }
                    console.log(requestObj)
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
            dispatch(SummaryActionCreator.getReceiveSummary())
            dispatch(SummaryActionCreator.getSentSummary())
            search()
        } catch (error: any) {
            setFormSubmitted(false)
            addToast(createMessage('error', `uploading`, 'file'), { appearance: 'error', autoDismiss: false })
            throw error
        }
    }

    // handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFiles = (file) => {
        let tempFiles = Object.assign([], files)
        if (tempFiles.length === 0) {
            tempFiles = Array.from(file)
        } else {
            tempFiles = [...tempFiles, ...Array.from(file)]
        }
        setFiles(tempFiles)
    }

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // triggers when file is selected with click
    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };

    const deleteHandler = (index) => {
        let tempFiles = Object.assign([], files)
        tempFiles.splice(index, 1);
        setFiles(tempFiles)
    }

    const downloadSampleFile = () => {
        let sampleFile = ''
        if (parentComponent === 'myDocument') {
            sampleFile = "./sample_file_upload.xlsx"
        } else {
            sampleFile = `${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/download`
        }
        axiosCustom.get(sampleFile, { responseType: 'arraybuffer' })
            .then((response) => {
                var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'SendRequestDocumentSample.xlsx');
            });
    }

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

                        parentComponent === 'receiveDocumentRequest'
                        && "Upload File to FulFill the request"
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Col sm={12}>
                        <div className={Styles.list_upload_container}>
                            {
                                files && files.length > 0 && files.map((file, index) => {
                                    return <div className={Styles.list_upload} key={`file_${index}`}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                                <span style={{ marginLeft: '.5rem' }}>{file.name}</span>
                                            </div>
                                            <MdOutlineDelete onClick={() => deleteHandler(index)} size={25} style={{ marginRight: '.5rem', color: 'red', cursor: 'pointer' }} />
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <Col md={12} sm={12}>
                            <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    id="input-file-upload"
                                    accept="image/png, image/jpeg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    multiple={true}
                                    onChange={handleChange}
                                />
                                <label id="label-file-upload" className={dragActive ? "drag-active" : ""}>
                                    <div>
                                        <CgSoftwareUpload size={60} color={'#5070e1'} onClick={onButtonClick} cursor='pointer' />
                                        <p style={{ fontSize: '1.5rem', color: '#99a2b0', margin: 0 }}>Drop Files here or <span onClick={onButtonClick} style={{ color: '#5070e1', fontWeight: 'bold', fontSize: '2.2rem', cursor: 'pointer' }}>Click here</span></p>
                                        <p style={{ color: '#b0b8c3' }}>*Please note that png, jpeg, pdf files are allowed</p>
                                    </div>
                                </label>
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
                    parentComponent === 'myDocument'
                    && files.length > 1
                    &&
                    <Col sm={12} className='no_padding'>
                        <br />
                        <p>Please download the <b>Matrix file</b> and update the columns to help system establish connection between the files being uploaded and system.</p>
                        <Col sm={12} className='no_padding'>
                            <Button variant="dark" type="submit" onClick={() => exportToExcel(SAMPLE_UPLOAD, 'matrix')} style={{ width: '100%' }}>Download Sample File</Button>
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
                            <Button variant="dark" type="submit" onClick={() => exportToExcel(jsonForRequest, 'matrix')} style={{ width: '100%' }}>Download Sample File</Button>
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