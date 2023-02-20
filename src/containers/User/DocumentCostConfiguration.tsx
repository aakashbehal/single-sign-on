import { useEffect, useState, useRef } from "react";
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { AiOutlineCloudDownload, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { CgOptions, CgSearch, CgSpinnerAlt } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { DocumentCostConfigActionCreator } from "../../store/actions/documentCostConfiguration.actions";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { createMessage } from "../../helpers/messages"

import Styles from "./User.module.sass";

const DocumentCostConfiguration = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [addEditCost, setAddEditCost] = useState(false)
    const [editCost, setEditCost] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [costAlreadyAdded, setCostAlreadyAdded] = useState<any>([])

    const { cost,
        loading,
        error,
        documentTypes,
        loadingDocumentTypes,
        errorDocumentTypes,
        adding,
        addSuccessful,
        addError,
        editing,
        editSuccessful,
        editError,
        deleteSuccessful,
        deleteError
    } = useSelector((state: any) => ({
        cost: state.cost.data,
        loading: state.cost.loading,
        error: state.cost.error,
        documentTypes: state.types.documentType.data,
        loadingDocumentTypes: state.types.documentType.loading,
        errorDocumentTypes: state.types.documentType.error,
        adding: state.cost.adding,
        addSuccessful: state.cost.addSuccessful,
        addError: state.cost.addError,
        editing: state.cost.editing,
        editSuccessful: state.cost.editSuccessful,
        editError: state.cost.editError,
        deleteSuccessful: state.cost.deleteSuccessful,
        deleteError: state.cost.deleteError
    }))

    useEffect(() => {
        getDocumentCosts()
        dispatch(TypesActionCreator.getDocumentTypes())
    }, [])

    useEffect(() => {
        if (cost && cost.length > 0) {
            let tempC = cost.map((c) => {
                return c.docTypeCode
            })
            setCostAlreadyAdded(tempC)
        }
    }, [cost])

    useEffect(() => {
        if (addSuccessful) {
            addToast(createMessage('success', `added`, 'Cost'), { appearance: 'success', autoDismiss: true });
            setAddEditCost(false);
            getDocumentCosts()
        }
        if (addError) { addToast(createMessage('error', `adding`, 'cost'), { appearance: 'error', autoDismiss: false }); }
        if (editSuccessful) {
            addToast(createMessage('success', `edit`, 'Cost'), { appearance: 'success', autoDismiss: true });
            setAddEditCost(false)
            getDocumentCosts()
        }
        if (editError) { addToast(createMessage('error', `editing`, 'cost'), { appearance: 'error', autoDismiss: false }); }
        if (deleteSuccessful) {
            addToast(createMessage('success', `delete`, 'Cost'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            getDocumentCosts()
        }
        if (deleteError) { addToast(createMessage('error', `deleting`, 'cost'), { appearance: 'error', autoDismiss: false }); }
    }, [addSuccessful,
        addError,
        editSuccessful,
        editError,
        deleteSuccessful,
        deleteError])

    const handleEdit = (cost) => {
        setEditCost(cost)
        setAddEditCost(true)
    }

    const getDocumentCosts = () => {
        dispatch(DocumentCostConfigActionCreator.getDocumentCost('CL'))
    }

    const deleteAlert = () => {
        dispatch(DocumentCostConfigActionCreator.deleteDocumentCost(details.docTypeCode))
    }

    const handleDetails = (cost) => {
        setDetails(cost)
        setShowDeleteConfirm(true)
    }

    return (<>
        <Col sm={12}>
            <Row>
                <Col md={10} sm={10} className={Styles.search_input}>
                    <CgSearch size={20} className={Styles.search} />
                    <Form.Control type="text" name="my_document_search" className={Styles.my_document_search} onMouseDown={() => setShowAdvanceSearch(false)} placeholder="Search" ></Form.Control>
                    <CgOptions size={20} className={Styles.advanceSearch} onClick={() => setShowAdvanceSearch(!showAdvanceSearch)} />
                    {showAdvanceSearch && <div className={Styles.advance_search}>
                        <Form className="" style={{ marginTop: '2rem' }}>
                            <Row>
                                <Col lg={12} md={12}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12} >
                                            <Form.Control
                                                as="select"
                                                name="document_type"
                                                className="select_custom white">
                                                <option></option>
                                                {
                                                    (documentTypes && documentTypes.length > 0) &&
                                                    documentTypes.map((dT: any, index: number) => {
                                                        return <option key={`cr_${index}`} value={dT.shortCode}>{dT.documentType}</option>
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Form.Label className="label_custom white">Document Type</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control className="select_custom white" type="text" name="document_name" />
                                        </Col>
                                        <Form.Label className="label_custom white">Document Name</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Col sm={12}>
                                <Col className={Styles.button_center}>
                                    <Button variant="dark" type="submit">Search</Button>{" "}
                                    <Button variant="dark" onClick={() => setShowAdvanceSearch(!showAdvanceSearch)}>Cancel</Button>
                                </Col>
                            </Col>
                        </Form>
                    </div>
                    }
                </Col>
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => {
                        setEditCost(null)
                        setAddEditCost(true)
                    }}>Add New Cost</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            {
                loading &&
                <div className={`table_loading`} >
                    <CgSpinnerAlt className="spinner" size={50} />
                </div >
            }
            <Table striped bordered hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                {
                    !loading && cost.length === 0
                    && <thead>
                        <tr className='no_records' style={{ lineHeight: '35px', backgroundColor: '#e9ecef', textAlign: 'center' }}>
                            <th>No Records</th>
                        </tr>
                    </thead>
                }
                {
                    !loading && cost.length > 0
                    && <>
                        <thead>
                            <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                <th>Document Type</th>
                                <th>Client Name</th>
                                <th>Cost</th>
                                <th style={{ width: '120px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cost && cost.length > 0 && cost.map((cT, index) => {
                                    return (<tr key={`cost_${index}`}>
                                        <td>{cT.documentType}</td>
                                        <td>{cT.clientName || '-'}</td>
                                        <td>${cT.cost}</td>
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
                                                    <FiEdit2 onClick={() => handleEdit(cT)} size={20} style={{ cursor: 'pointer' }} />
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
                                                    <AiOutlineDelete onClick={() => handleDetails(cT)} size={20} style={{ cursor: 'pointer' }} />
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
        </Col>
        {
            addEditCost
            && <AddEditCost
                show={addEditCost}
                onHide={() => setAddEditCost(false)}
                editCost={editCost}
                Styles={Styles}
                documentTypes={documentTypes}
                dispatch={dispatch}
                costAlreadyAdded={costAlreadyAdded}
            />
        }
        {
            showDeleteConfirm
            && <DeleteConfirm
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                confirmDelete={() => deleteAlert()}
                details={details}
                type='costConfiguration'
            />
        }
    </>)
}

const AddEditCost = ({ show, onHide, Styles, documentTypes, editCost, dispatch, costAlreadyAdded }) => {
    const addEditRef = useRef<any>()
    const [formError, setFormError] = useState<any>({
        docTypeCode: false,
        cost: false,
        costLessThanZero: false
    })

    const validateUpload = (formObj) => {
        let formIsValid = true;
        const error: any = {
            docTypeCode: false,
            cost: false,
            costLessThanZero: false
        }
        for (let key in formObj) {
            if (!formObj[key] || formObj[key] === "") {
                error[key] = true
            }
        }
        if (formObj.cost < 0) {
            error.costLessThanZero = true
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        setFormError(error)
        console.log(error)
        return formIsValid
    }

    const handleSave = (e) => {
        e.preventDefault()
        const {
            documentType,
            cost
        } = addEditRef.current
        const payload = {
            "docTypeCode": documentType.value,
            "cost": cost.value ? Number(cost.value) : ''
        }
        if (validateUpload(payload)) {
            dispatch(DocumentCostConfigActionCreator.saveDocumentCost(payload))
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
                        {editCost ? 'Edit Document Cost' : "Add New Document Cost"}
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
                                        name="documentType"
                                        disabled={editCost}
                                        defaultValue={editCost ? editCost.docTypeCode : ''}
                                        className="select_custom white">
                                        <option></option>
                                        {
                                            (documentTypes && documentTypes.length > 0) &&
                                            documentTypes.map((dT: any, index: number) => {
                                                return <option key={`cr_${index}`} disabled={costAlreadyAdded.indexOf(dT.shortCode) !== -1} value={dT.shortCode}>{dT.documentType}</option>
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
                                    <Form.Control
                                        defaultValue={editCost ? editCost.cost : ''}
                                        className="select_custom white"
                                        type="number"
                                        name="cost"
                                        step={0.1}
                                    />
                                    <span style={{ color: 'red' }}><small>{formError["cost"] ? 'Cost is required' : ''}</small></span>
                                    <span style={{ color: 'red' }}><small>{formError["costLessThanZero"] ? 'Document Cost cannot be less the 0' : ''}</small></span>
                                </Col>
                                <Form.Label className="label_custom white">Document Cost</Form.Label>
                            </Form.Group>
                        </Col>
                    </Container>
                </Modal.Body>
                <Modal.Footer style={{ padding: '1rem 4rem 2rem' }}>
                    {
                        editCost
                        &&
                        <>
                            <Button variant="dark" type="submit" style={{ width: '100%' }}>Save</Button>
                            <Button variant="dark" style={{ width: '100%' }} onClick={onHide}>Cancel</Button>
                        </>
                    }
                    {
                        !editCost
                        &&
                        <Button variant="dark" type="submit" style={{ width: '100%' }}>Add</Button>
                    }
                </Modal.Footer>
            </Form>
        </Modal >
    )
}

export default DocumentCostConfiguration;