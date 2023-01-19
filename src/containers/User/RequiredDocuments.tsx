import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { AiOutlineCloudDownload, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { CgOptions, CgSearch } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead"
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { DocumentCostConfigActionCreator } from "../../store/actions/documentCostConfiguration.actions";
import DeleteConfirm from "../../components/modal/DeleteConfirm";

import Styles from "./User.module.sass";
import { RequiredDocumentActionCreator } from "../../store/actions/requiredDocuments.actions";

const RequiredDocuments = () => {
    const dispatch = useDispatch()
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [addEditRequired, setAddEditRequired] = useState(false)
    const [editRequired, setEditRequired] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null)

    const { requiredDocuments, loading, error, productTypes, loadingProductTypes, errorProductTypes, documentTypes, loadingDocumentTypes, errorDocumentTypes } = useSelector((state: any) => ({
        requiredDocuments: state.requiredDocuments.data,
        loading: state.requiredDocuments.loading,
        error: state.requiredDocuments.error,
        productTypes: state.types.productType.data,
        loadingProductTypes: state.types.productType.loading,
        errorProductTypes: state.types.productType.error,
        documentTypes: state.types.documentType.data,
        loadingDocumentTypes: state.types.documentType.loading,
        errorDocumentTypes: state.types.documentType.error
    }))

    useEffect(() => {
        dispatch(RequiredDocumentActionCreator.getRequiredDocuments('CL'))
        dispatch(TypesActionCreator.getProductTypes('CL'))
        dispatch(TypesActionCreator.getDocumentTypes('CL'))
    }, [])

    const handleEdit = (required) => {
        setEditRequired(required)
        setAddEditRequired(true)
    }

    const deleteAlert = () => { }

    const handleDetails = (required) => {
        setDetails(required)
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
                                                    (productTypes && productTypes.length > 0) &&
                                                    productTypes.map((dT: any, index: number) => {
                                                        return <option key={`cr_${index}`} value={dT.productCode}>{dT.name}</option>
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
                        setEditRequired(null)
                        setAddEditRequired(true)
                    }}>Add New Document Configuration</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <Table striped bordered hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                <thead>
                    <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                        <th>Product</th>
                        <th>Required Documents</th>
                        <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        requiredDocuments && requiredDocuments.map((cT, index) => {
                            return (<tr key={`rD_${index}`}>
                                <td>{cT.productName}</td>
                                <td>
                                    {cT.documentList && cT.documentList.map((dL, index) => {
                                        return <span key={`dL_${index}`} className={Styles.required_documents}>{dL.documentName}</span>
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
            addEditRequired
            && <AddEditCost show={addEditRequired} onHide={() => setAddEditRequired(false)} editRequired={editRequired} Styles={Styles} documentTypes={documentTypes} productTypes={productTypes} />
        }
        {
            showDeleteConfirm
            && <DeleteConfirm
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                confirmDelete={() => deleteAlert()}
                details={details}
                type='requiredDocuments'
            />
        }
    </>)
}

const AddEditCost = ({ show, onHide, Styles, documentTypes, editRequired, productTypes }) => {
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
                    {editRequired ? 'Edit Required Document Configuration' : "Add New Required Document Configuration"}
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
                                    disabled={editRequired}
                                    defaultValue={editRequired ? editRequired.productName : ''}
                                    className="select_custom white">
                                    <option></option>
                                    {
                                        (productTypes && productTypes.length > 0) &&
                                        productTypes.map((dT: any, index: number) => {
                                            return <option key={`cr_${index}`} value={dT.statusCode}>{dT.name}</option>
                                        })
                                    }
                                </Form.Control>
                            </Col>
                            <Form.Label className="label_custom white">Product</Form.Label>
                        </Form.Group>
                    </Col>
                    <br />
                    <Col sm={12}>
                        <Form.Group as={Col} className="mb-4">
                            <Col md={12} sm={12}>
                                {/* <Form.Control defaultValue={editCost ? editCost.cost : ''} className="select_custom white" type="number" name="document_name" /> */}
                                <PublicMethodsExample documentTypes={documentTypes} editRequired={editRequired} />
                            </Col>
                            <Form.Label className="label_custom white">Required Documents</Form.Label>
                        </Form.Group>
                    </Col>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{ padding: '1rem 4rem 2rem' }}>
                <Button variant="dark" type="submit" style={{ width: '100%' }}>Save</Button>
                <Button variant="dark" type="submit" style={{ width: '100%' }} onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal >
    )
}

const PublicMethodsExample = ({ documentTypes, editRequired }) => {
    const ref = useRef<any>();
    return (
        <>
            <Typeahead
                defaultSelected={editRequired ? editRequired.documentList : []}
                id="public-methods-example"
                labelKey="documentName"
                multiple
                options={documentTypes}
                placeholder="Choose a state..."
                ref={ref}
            />
        </>
    );
};

export default RequiredDocuments;