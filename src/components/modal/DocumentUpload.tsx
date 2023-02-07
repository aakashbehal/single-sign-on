import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { BsFileEarmarkPdf, BsFillFileEarmarkImageFill } from 'react-icons/bs';
import { CgSpinnerAlt, CgSoftwareUpload } from 'react-icons/cg';
import { MdOutlineDelete } from 'react-icons/md';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { saveAs } from 'file-saver';

import { createMessage } from '../../helpers/messages';
import { axiosCustom, dateFormatterForRequestFileUpload, handleResponse } from '../../helpers/util';
import { userService } from '../../services';

const FileUploadHook = (files) => {
    const [state, setState] = useState<any>(null)
    const zipTargetFiles: any = async (files) => {
        let zipFile: any = null
        if (files.length === 1) {
            setState({
                zipFile,
                file: files[0]
            })
        } else {
            const zip = require('jszip')();
            let matrixFile: any = null
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === 'matrix.xlsx') {
                    matrixFile = files[i]
                }
                if (files[i].type === 'application/zip' || files[i].type === "application/x-zip-compressed") {
                    zipFile = files[i]
                }
                if (!zipFile && files[i].name !== 'matrix.xlsx') {
                    zip.file(files[i].name, files[i]);
                }
            }
            if (!zipFile) {
                zip.generateAsync({ type: "blob" })
                    .then((content) => {
                        return new File([content], 'new.zip', { type: 'application/x-zip-compressed' })
                    })
                    .then((file) => {
                        setState({
                            matrixFile,
                            file: file
                        });
                    })
            } else {
                setState({
                    matrixFile,
                    file: zipFile
                });
            }
        }
    }
    return [
        state,
        {
            zipTargetFiles
        }
    ];
}

const DocumentUpload = ({ show, onHide, accountId, Styles, parentComponent, search, details = null }: any) => {
    const { addToast } = useToasts();
    const editRef = useRef<any>()
    const dispatch = useDispatch();
    const [fileToUpload, { zipTargetFiles }] = FileUploadHook(null)
    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<any>(null);
    const [files, setFiles] = useState<any>([])
    const [userLoggedIn, setUserLoggedIn] = useState<any>(null)
    const [dateFrom, setDateFrom] = useState<any>(null)
    const [fileTypeSelected, setFileTypeSelected] = useState('')
    const [formSubmitted, setFormSubmitted] = useState<any>(false)
    const [formError, setFormError] = useState<any>({
        fileLengthSingle: false,
        fileSize: false
    })

    useEffect(() => {
        const user = userService.getUser()
        setUserLoggedIn(user)
    }, [])

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

    useEffect(() => {
        if (fileToUpload && JSON.stringify(fileToUpload) !== "{}") {
            uploadFile()
        }
    }, [fileToUpload])

    const onSubmitHandler = async (e: any) => {
        e.preventDefault();
        if (validateUpload({
            file: files.length
        })) {
            setFormSubmitted(true)
            const zippedFile = zipTargetFiles(files)
            console.log(zippedFile)
        }
    }

    const uploadFile = async () => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        let API_URL = `${process.env.REACT_APP_BASE_FILE}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/upload`
        const { file, matrixFile } = fileToUpload
        let formData: any = new FormData()
        try {
            if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
                formData.append("files", file);
                formData.append("files", matrixFile)
                formData.append("fileUploadJson", JSON.stringify({ "bulkType": "upload", "orgType": 'CT' }))
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
                const data = handleResponse(responseFilePath)
                addToast(createMessage('success', `uploaded`, 'File'), { appearance: 'success', autoDismiss: true })
                setFormSubmitted(false)
                onHide()
            } else {
                formData.append("file", file);
                formData.append("orgType", "CT")
                const response = await axiosCustom.post(API_URL, formData, config)
                const data = handleResponse(response)
                addToast(createMessage('success', `uploaded`, 'File'), { appearance: 'success', autoDismiss: true })
                setFormSubmitted(false)
                onHide()
            }
            search()
        } catch (error: any) {
            setFormSubmitted(false)
            addToast(createMessage('error', `uploading`, 'file'), { appearance: 'error', autoDismiss: false })
            throw error
        }
    }

    const fileSizeHandler = (event) => {
        const tempError = Object.assign({}, formError)
        // 5MB limit
        if ((event.target.files[0].size / 1024 / 1024) > 50) {
            setFormError({ ...tempError, fileSize: true })
            setFormSubmitted(true)
        } else {
            setFormError({ ...tempError, fileSize: false })
            setFormSubmitted(false)
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
            sampleFile = "./sample_file_fulfill.xlsx"
        }
        console.log(sampleFile)
        axios.get(sampleFile, { responseType: 'arraybuffer' })
            .then((response) => {
                var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'fixi.xlsx');
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
                        )
                            ? "Upload New Document"
                            :
                            (parentComponent === 'sentDocumentRequest'
                                ? 'Upload file for bulk document request'
                                : '')
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
                    && <Col sm={12} className='no_padding'>
                        <br />
                        <p>Please download the Matrix file and update the columns to help system establish connection between the files being uploaded and system.</p>
                        <Col sm={12} className='no_padding'>
                            <Button variant="dark" type="submit" onClick={downloadSampleFile} style={{ width: '100%' }}>Download Sample File</Button>
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