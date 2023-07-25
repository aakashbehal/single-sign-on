import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Container, Form, Modal, OverlayTrigger, Table, Tooltip } from "react-bootstrap"
import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit2 } from "react-icons/fi"
import { useToasts } from "react-toast-notifications"
import { CgSpinnerAlt } from "react-icons/cg"

import Styles from "./DocumentManager.module.sass"
import { DocumentTypeIdentifierActionCreator } from "../../store/actions/documentTypeIdentifier.actions"
import { IIdentifier } from "../../interfaces/documentTypeIdentifier.interface"
import NoRecord from "../../components/Common/NoResult"
import { TypesActionCreator } from "../../store/actions/common/types.actions"
import MultipleInputs from "../../components/Common/MultipleInputs"
import { createMessage } from "../../helpers/messages"

const DocumentTypeIdentifier = () => {
    const dispatch = useDispatch()
    const { addToast } = useToasts();
    const [show, setShow] = useState<boolean>(false)
    const [identifierData, setIdentifierData] = useState<IIdentifier | null>(null)
    const [documentTypeAlreadyAdded, setDocumentTypeAlreadyAdded] = useState<any>([])
    const {
        identifiers,
        loading,
        error,
        documentTypes,
        adding,
        addSuccessful,
        addError,
        editing,
        editSuccessful,
        editError,
        deleting,
        deleteSuccessful,
        deleteError,
    } = useSelector((state: any) => ({
        identifiers: state.ocr.data,
        loading: state.ocr.loading,
        error: state.ocr.error,
        documentTypes: state.types.documentType.data,
        adding: state.ocr.adding,
        addSuccessful: state.ocr.addSuccessful,
        addError: state.ocr.addError,
        editing: state.ocr.editing,
        editSuccessful: state.ocr.editSuccessful,
        editError: state.ocr.editError,
        deleting: state.ocr.deleting,
        deleteSuccessful: state.ocr.deleteSuccessful,
        deleteError: state.ocr.deleteError
    }))

    useEffect(() => {
        getDocumentTypeIdentifier()
        dispatch(TypesActionCreator.getDocumentTypes())
    }, [])

    useEffect(() => {
        if (identifiers && identifiers.length > 0) {
            let tempC = identifiers.map((c: any) => {
                return c.docTypeCode
            })
            setDocumentTypeAlreadyAdded(tempC)
        }
    }, [identifiers])


    useEffect(() => {
        if (addSuccessful) {
            addToast(createMessage('success', `added`, 'Document Identifier'), { appearance: 'success', autoDismiss: true });
            setShow(false);
            getDocumentTypeIdentifier()
        }
        if (addError) { addToast(createMessage('error', `adding`, 'document identifier'), { appearance: 'error', autoDismiss: false }); }
        if (editSuccessful) {
            addToast(createMessage('success', `edit`, 'Document Identifier'), { appearance: 'success', autoDismiss: true });
            setShow(false)
            getDocumentTypeIdentifier()
        }
        if (editError) { addToast(createMessage('error', `editing`, 'document identifier'), { appearance: 'error', autoDismiss: false }); }
        if (deleteSuccessful) {
            addToast(createMessage('success', `delete`, 'Document Identifier'), { appearance: 'success', autoDismiss: true });
            setShow(false)
            getDocumentTypeIdentifier()
        }
        if (deleteError) { addToast(createMessage('error', `deleting`, 'document identifier'), { appearance: 'error', autoDismiss: false }); }
    }, [addSuccessful,
        addError,
        editSuccessful,
        editError,
        deleteSuccessful,
        deleteError])

    const getDocumentTypeIdentifier = () => {
        dispatch(DocumentTypeIdentifierActionCreator.getIdentifiers({ pageSize: 10, pageNumber: 0 }))
    }

    const handleEdit = (identifier: IIdentifier) => {
        setShow(true)
        setIdentifierData(identifier)
    }

    const handleDelete = (identifier: IIdentifier) => {
        dispatch(DocumentTypeIdentifierActionCreator.deleteDocumentCostIdentifier(identifier.docTypeCode))
    }

    const createIdentifier = () => {
        setShow(true)
    }

    return (
        <>
            <div className="row">
                <div className="col-9"></div>
                <div className="col-3">
                    <Button variant="dark" onClick={() => createIdentifier()} style={{ width: "100%" }}>Create Identifier</Button>
                </div>
            </div>
            <br />
            {
                !error && loading
                && <thead>
                    <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                </thead>
            }
            {
                !loading && identifiers.length === 0
                && <NoRecord />
            }
            <Table striped bordered hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                {
                    !loading && identifiers.length > 0
                    && <>
                        <thead>
                            <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                <th>Document Type</th>
                                <th>Document Type Code</th>
                                <th>Fields</th>
                                <th style={{ width: '120px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                identifiers && identifiers.length > 0 && identifiers.map((identifier: IIdentifier, index: any) => {
                                    return (<tr key={`identifier_${index}`}>
                                        <td>{identifier.documentType}</td>
                                        <td>{identifier.docTypeCode || '-'}</td>
                                        <td>
                                            {identifier.docTypeFields && identifier.docTypeFields.map((fields: any, index: any) => {
                                                return <span key={`dL_${index}`} className={Styles.required_documents}>{fields}</span>
                                            })}
                                        </td>
                                        <td className='span1' style={{ minWidth: '130px', textAlign: 'center' }}>
                                            <span>
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Edit
                                                        </Tooltip>
                                                    }
                                                >
                                                    <FiEdit2 onClick={() => handleEdit(identifier)} size={20} style={{ cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            </span> &nbsp;
                                            <span>
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Delete
                                                        </Tooltip>
                                                    }
                                                >
                                                    <AiOutlineDelete onClick={() => handleDelete(identifier)} size={20} style={{ cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            </span>
                                        </td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </>
                }
            </Table>
            {
                show
                && <AddEditIdentifier
                    show={show}
                    onHide={() => {
                        setShow(false);
                        setIdentifierData(null)
                    }}
                    documentTypeAlreadyAdded={documentTypeAlreadyAdded}
                    identifierData={identifierData}
                    documentTypes={documentTypes}
                    dispatch={dispatch}
                />
            }

        </>
    )
}

const AddEditIdentifier = ({ show, onHide, identifierData, documentTypes, dispatch, documentTypeAlreadyAdded }:
    { show: boolean, onHide: any, identifierData: IIdentifier | null, documentTypes: any, dispatch: any, documentTypeAlreadyAdded: string[] }) => {
    const addEditRef = useRef<any>()
    const [identifiers, setIdentifiers] = useState<any>([])
    const [formError, setFormError] = useState<any>({
        docTypeCode: false,
        docTypeFields: false,
    })

    useEffect(() => {
        return () => {
            setIdentifiers([])
        }
    }, [])

    useEffect(() => {
        if (identifierData) {
            setIdentifiers(identifierData.docTypeFields)
        }
    }, [identifierData])

    const validateUpload = (formObj: any) => {
        let formIsValid = true;
        const error: any = {
            docTypeCode: false,
            docTypeFields: false
        }
        for (let key in formObj) {
            if (!formObj[key] || formObj[key] === "") {
                error[key] = true
            }
        }
        if (formObj.docTypeFields.length === 0) {
            error.docTypeFields = true
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        setFormError(error)
        return formIsValid
    }

    const handleSave = (e: any) => {
        e.preventDefault()
        const {
            documentType,
        } = addEditRef.current
        const payload = {
            "docTypeCode": documentType.value,
            "docTypeFields": identifiers
        }
        if (validateUpload(payload)) {
            if (!identifierData) {
                dispatch(DocumentTypeIdentifierActionCreator.addDocumentCostIdentifier(payload))
            } else {
                dispatch(DocumentTypeIdentifierActionCreator.editDocumentCostIdentifier(payload))
            }
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
            <Form ref={addEditRef} onSubmit={(e) => handleSave(e)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" >
                        {!identifierData ? 'Add Document Type Identifier' : "Edit Document Type Identifier"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Container>
                        <br />
                        <Col md={12} sm={12} >
                            <Form.Group as={Col} className="mb-4">
                                <Col md={12} sm={12} >
                                    <Form.Control
                                        as="select"
                                        disabled={!!identifierData}
                                        defaultValue={identifierData ? identifierData?.docTypeCode : ''}
                                        name="documentType"
                                        className="select_custom white">
                                        <option></option>
                                        {
                                            (documentTypes && documentTypes.length > 0) &&
                                            documentTypes.map((dT: any, index: number) => {
                                                return <option key={`cr_${index}`} disabled={documentTypeAlreadyAdded.indexOf(dT.shortCode) !== -1} value={dT.shortCode}>{dT.documentType}</option>
                                            })
                                        }
                                    </Form.Control>
                                    <span style={{ color: 'red' }}><small>{formError["docTypeCode"] ? 'Document Type is required' : ''}</small></span>
                                </Col>
                                <Form.Label className="label_custom white">Document Type</Form.Label>
                            </Form.Group>
                        </Col>
                        <br />
                        <Col sm={12}>
                            <Form.Group as={Col} className="mb-4">
                                <Col md={12} sm={12}>
                                    <MultipleInputs multipleValues={identifiers} setMultipleValues={setIdentifiers} />
                                    <span style={{ color: 'red' }}><small>{formError["docTypeFields"] ? 'At least 1 field is required' : ''}</small></span>
                                </Col>
                                <Form.Label className="label_custom white">Fields</Form.Label>
                            </Form.Group>
                        </Col>
                    </Container>
                </Modal.Body>
                <Modal.Footer style={{ padding: '1rem 4rem 2rem' }}>
                    {
                        (typeof identifierData === 'object')
                        &&
                        <>
                            <Button variant="dark" type="submit" style={{ width: '100%' }}>Save</Button>
                            <Button variant="dark" style={{ width: '100%' }} onClick={onHide}>Cancel</Button>
                        </>
                    }
                    {
                        (typeof identifierData === 'boolean')
                        &&
                        <Button variant="dark" type="submit" style={{ width: '100%' }}>Add</Button>
                    }
                </Modal.Footer>
            </Form>
        </Modal >
    )
}

export default DocumentTypeIdentifier