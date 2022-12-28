import React, { useEffect, useState, useRef } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { CgSpinnerAlt, CgSoftwareUpload } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';

import { createMessage } from '../../helpers/messages';
import { axiosCustom, dateFormatterForRequestFileUpload } from '../../helpers/util';
import { userService } from '../../services';


const DocumentUpload = ({ show, onHide, accountId, Styles }: any) => {
    const { addToast } = useToasts();
    const editRef = useRef<any>()
    const dispatch = useDispatch();

    const [dragActive, setDragActive] = React.useState(false);
    const inputRef = React.useRef<any>(null);

    const [userLoggedIn, setUserLoggedIn] = useState<any>(null)
    const [dateFrom, setDateFrom] = useState<any>(null)
    const [fileTypeSelected, setFileTypeSelected] = useState('')
    const [formSubmitted, setFormSubmitted] = useState<any>(false)
    const [formError, setFormError] = useState<any>({
        file: false,
        fileType: false,
        generationDate: false,
        pdfOnly: false,
        fileSize: false
    })

    useEffect(() => {
        const user = userService.getUser()
        setUserLoggedIn(user)
    }, [])

    const validateUpload = (formObj) => {
        let formIsValid = true;
        const error: any = {
            file: false,
            fileType: false,
            generationDate: false,
            pdfOnly: false
        }
        if (formObj.file !== 0 && formObj['pdfOnly'] !== 'application/pdf') {
            error['pdfOnly'] = true
        }
        delete formObj.pdfOnly
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
        const {
            docFile
        } = editRef.current
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        if (validateUpload({
            file: (Array.from(docFile.files)).length,
            pdfOnly: docFile.files && docFile.files[0] ? docFile.files[0].type : '',
            fileType: fileTypeSelected,
            generationDate: dateFrom
        })) {

            setFormSubmitted(true)
            let formData: any = new FormData()
            formData.append("docType", fileTypeSelected)
            formData.append("docDate", dateFormatterForRequestFileUpload(dateFrom))
            formData.append("file", docFile.files[0])
            formData.append("accountId", accountId)
            formData.append("createdBy", userLoggedIn.loginKey)
            try {
                const user = userService.getUser();
                if (user.orgType === "PT") {
                    formData.append('partnerId', user.partnerId)
                } else if (user.orgType === "CL") {
                    formData.append('clientId', user.clientId)
                }
                const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL1}${process.env.REACT_APP_AWS_SERVICE}/uploadDocument`, formData, config)
                addToast(createMessage('success', `uploaded`, 'File'), { appearance: 'success', autoDismiss: true })
                setFormSubmitted(false)
                onHide()
            } catch (error: any) {
                setFormSubmitted(false)
                addToast(createMessage('error', `uploading`, 'file'), { appearance: 'error', autoDismiss: false })
                throw error
            }
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

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log(e.dataTransfer.files)
            // handleFiles(e.dataTransfer.files);
        }
    };

    // triggers when file is selected with click
    const handleChange = function (e) {
        console.log(`handle changes`)
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files)
            // handleFiles(e.target.files);
        }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
        console.log(`clicked`);
        inputRef.current.click();
    };

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
                    Upload New Document
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Col sm={12}>
                        <Col md={12} sm={12}>
                            <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                                <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
                                <label id="label-file-upload" className={dragActive ? "drag-active" : ""}>
                                    <div>
                                        <CgSoftwareUpload size={60} color={'#5070e1'} onClick={onButtonClick} cursor='pointer' />
                                        <p style={{ fontSize: '1.5rem', color: '#99a2b0', margin: 0 }}>Drop Files here or <span onClick={onButtonClick} style={{ color: '#5070e1', fontWeight: 'bold', fontSize: '2.2rem', cursor: 'pointer' }}>Click here</span></p>
                                        <p style={{ color: '#b0b8c3' }}>*Please note that png, jpeg, pdf files are allowed</p>
                                    </div>
                                </label>
                                {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
                            </form>
                            <span className={Styles.form_error}><small>{formError["file"] ? 'File is required' : ''}</small></span>
                            <span className={Styles.form_error}><small>{formError["pdfOnly"] ? 'File should be PDF format' : ''}</small></span>
                            <span className={Styles.form_error}><small>{formError["fileSize"] ? 'File size cannot be more than 50MB' : ''}</small></span>
                        </Col>
                    </Col>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{ padding: '1rem 4rem 2rem' }}>
                {
                    formSubmitted &&
                    <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                }
                <Button variant="dark" type="submit" disabled={formSubmitted} onClick={onSubmitHandler} style={{ width: '100%' }}>Upload</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default DocumentUpload