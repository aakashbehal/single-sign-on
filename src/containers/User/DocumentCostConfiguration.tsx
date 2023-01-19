import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { AiOutlineCloudDownload, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { CgOptions, CgSearch } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { DocumentCostConfigActionCreator } from "../../store/actions/documentCostConfiguration.actions";
import DeleteConfirm from "../../components/modal/DeleteConfirm";

import Styles from "./User.module.sass";

const DocumentCostConfiguration = () => {
    const dispatch = useDispatch()
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [addEditCost, setAddEditCost] = useState(false)
    const [editCost, setEditCost] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null)

    const { cost, loading, error, documentTypes, loadingDocumentTypes, errorDocumentTypes } = useSelector((state: any) => ({
        cost: state.cost.data,
        loading: state.cost.loading,
        error: state.cost.error,
        documentTypes: state.types.documentType.data,
        loadingDocumentTypes: state.types.documentType.loading,
        errorDocumentTypes: state.types.documentType.error
    }))

    useEffect(() => {
        dispatch(DocumentCostConfigActionCreator.getDocumentCost('CL'))
        dispatch(TypesActionCreator.getDocumentTypes('CL'))
    }, [])

    const handleEdit = (cost) => {
        setEditCost(cost)
        setAddEditCost(true)
    }

    const deleteAlert = () => { }

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
                                                name="service_offered"
                                                className="select_custom white">
                                                <option></option>
                                                {
                                                    (documentTypes && documentTypes.length > 0) &&
                                                    documentTypes.map((dT: any, index: number) => {
                                                        return <option key={`cr_${index}`} value={dT.statusCode}>{dT.documentName}</option>
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
            <Table striped bordered hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
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
                        cost && cost.map((cT, index) => {
                            return (<tr>
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
            </Table>
        </Col>
        {
            addEditCost
            && <AddEditCost show={addEditCost} onHide={() => setAddEditCost(false)} editCost={editCost} Styles={Styles} documentTypes={documentTypes} />
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

const AddEditCost = ({ show, onHide, Styles, documentTypes, editCost }) => {
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
                                    name="service_offered"
                                    disabled={editCost}
                                    defaultValue={editCost ? editCost.documentType : ''}
                                    className="select_custom white">
                                    <option></option>
                                    {
                                        (documentTypes && documentTypes.length > 0) &&
                                        documentTypes.map((dT: any, index: number) => {
                                            return <option key={`cr_${index}`} value={dT.statusCode}>{dT.documentName}</option>
                                        })
                                    }
                                </Form.Control>
                            </Col>
                            <Form.Label className="label_custom white">Document Type</Form.Label>
                        </Form.Group>
                    </Col>
                    <br />
                    <Col sm={12}>
                        <Form.Group as={Col} className="mb-4">
                            <Col md={12} sm={12}>
                                <Form.Control defaultValue={editCost ? editCost.cost : ''} className="select_custom white" type="number" name="document_name" />
                            </Col>
                            <Form.Label className="label_custom white">Document Cost</Form.Label>
                        </Form.Group>
                    </Col>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{ padding: '1rem 4rem 2rem' }}>
                <Button variant="dark" type="submit" style={{ width: '100%' }}>Add</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default DocumentCostConfiguration;