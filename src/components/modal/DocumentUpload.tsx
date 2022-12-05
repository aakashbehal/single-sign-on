import React, { useEffect, useState, useRef } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { CgSpinnerAlt } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { createMessage } from '../../helpers/messages';
import { axiosCustom, dateFormatterForRequestFileUpload } from '../../helpers/util';
import { userService } from '../../services';

const DocumentUpload = ({ show, onHide, accountId, Styles }: any) => {
    const { addToast } = useToasts();
    const editRef = useRef<any>()
    const dispatch = useDispatch();

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
    const { fileType } = useSelector((state: any) => ({
        fileType: state.types.docTypes.data
    }))

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
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Documents
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form
                        className=""
                        ref={editRef}
                        onSubmit={(e) => onSubmitHandler(e)}
                    >
                        <Row>
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Document Type</Form.Label>
                                    <Col md={8} sm={12}>
                                        <Form.Control
                                            as="select"
                                            name="documentType"
                                            value={fileTypeSelected}
                                            onChange={(e) => { setFileTypeSelected(e.target.value) }}
                                        >
                                            <option></option>
                                            {
                                                fileType && fileType.map((cF: any, index: number) => {
                                                    return (
                                                        <option
                                                            key={`filter_${index}`}
                                                            value={cF.keycode}
                                                        >
                                                            {cF.keycode} - {cF.keyvalue}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                        <span className={Styles.form_error}><small>{formError["fileType"] ? 'File type is required' : ''}</small></span>

                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Document</Form.Label>
                                    <Col md={8} sm={12}>
                                        <Form.Control type="file" name="docFile" accept="application/pdf" onChange={fileSizeHandler} />
                                        <span className={Styles.form_error}><small>{formError["file"] ? 'File is required' : ''}</small></span>
                                        <span className={Styles.form_error}><small>{formError["pdfOnly"] ? 'File should be PDF format' : ''}</small></span>
                                        <span className={Styles.form_error}><small>{formError["fileSize"] ? 'File size cannot be more than 50MB' : ''}</small></span>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Document Generation Date</Form.Label>
                                    <Col md={8} sm={12}>
                                        <DatePicker
                                            onChange={setDateFrom}
                                            format={'MM/dd/yyyy'}
                                            value={dateFrom}
                                            maxDate={new Date()}
                                            monthPlaceholder={'mm'}
                                            dayPlaceholder={'dd'}
                                            yearPlaceholder={'yyyy'} />
                                        <span className={Styles.form_error}><small>{formError["generationDate"] ? 'Document generation date is required' : ''}</small></span>
                                    </Col>

                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                {
                    formSubmitted &&
                    <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                }
                <Button variant="dark" type="submit" disabled={formSubmitted} onClick={onSubmitHandler}>Submit</Button>
                <Button variant='dark' onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default DocumentUpload