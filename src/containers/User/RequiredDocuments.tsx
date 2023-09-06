import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { AiOutlineCloudDownload, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { CgOptions, CgSearch, CgSpinnerAlt } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead"
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useToasts } from "react-toast-notifications";

import { TypesActionCreator } from "../../store/actions/common/types.actions";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import Styles from "./User.module.sass";
import { RequiredDocumentActionCreator } from "../../store/actions/requiredDocuments.actions";
import { createMessage } from "../../helpers/messages"
import NoRecord from "../../components/Common/NoResult";

const RequiredDocuments = () => {
    const dispatch = useDispatch()
    const { addToast } = useToasts();
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [addEditRequired, setAddEditRequired] = useState(false)
    const [editRequired, setEditRequired] = useState(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null)
    const [selectedProduct, setSelectedProduct] = useState<any>([])
    const [requiredDocumentsUpdated, setRequiredDocumentsUpdated] = useState<any>([])
    const { requiredDocuments,
        loading,
        error,
        productTypes,
        loadingProductTypes,
        errorProductTypes,
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
        requiredDocuments: state.requiredDocuments.data,
        loading: state.requiredDocuments.loading,
        error: state.requiredDocuments.error,
        productTypes: state.types.productType.data,
        loadingProductTypes: state.types.productType.loading,
        errorProductTypes: state.types.productType.error,
        documentTypes: state.types.documentType.data,
        loadingDocumentTypes: state.types.documentType.loading,
        errorDocumentTypes: state.types.documentType.error,
        adding: state.requiredDocuments.adding,
        addSuccessful: state.requiredDocuments.addSuccessful,
        addError: state.requiredDocuments.addError,
        editing: state.requiredDocuments.editing,
        editSuccessful: state.requiredDocuments.editSuccessful,
        editError: state.requiredDocuments.editError,
        deleteSuccessful: state.requiredDocuments.deleteSuccessful,
        deleteError: state.requiredDocuments.deleteError
    }))

    useEffect(() => {
        getRequiredDocuments()
        dispatch(TypesActionCreator.getProductTypes())
        dispatch(TypesActionCreator.getDocumentTypes())
    }, [])

    useEffect(() => {
        if (requiredDocuments && requiredDocuments.length > 0) {
            let tempRequiredDocuments = Object.assign([], requiredDocuments)
            tempRequiredDocuments = tempRequiredDocuments.map((tRD: any) => {
                tRD.documents = tRD.documents.map((d: any) => {
                    d.keyCode = d.documentCode
                    d.keyValue = d.documentName
                    d.description = d.documentName
                    delete d.documentCode
                    delete d.documentName
                    return d
                })
                return tRD
            })
            // setRequiredDocumentsUpdated()
            let tempC = requiredDocuments.map((c: any) => {
                return c.productCode
            })
            setSelectedProduct(tempC)
        }
    }, [requiredDocuments])

    useEffect(() => {
        if (addSuccessful) {
            addToast(createMessage('success', `added`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setAddEditRequired(false);
            getRequiredDocuments()
        }
        if (addError) { addToast(createMessage('error', `adding`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
        if (editSuccessful) {
            addToast(createMessage('success', `edit`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setAddEditRequired(false)
            getRequiredDocuments()
        }
        if (editError) { addToast(createMessage('error', `editing`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
        if (deleteSuccessful) {
            addToast(createMessage('success', `delete`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            getRequiredDocuments()
        }
        if (deleteError) { addToast(createMessage('error', `deleting`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
    }, [addSuccessful,
        addError,
        editSuccessful,
        editError,
        deleteSuccessful,
        deleteError])

    const handleEdit = (required: any) => {
        setEditRequired(required)
        setAddEditRequired(true)
    }

    const getRequiredDocuments = () => {
        dispatch(RequiredDocumentActionCreator.getRequiredDocuments())
    }

    const deleteAlert = () => {
        dispatch(RequiredDocumentActionCreator.deleteRequiredDocuments(details.productCode))
    }

    const handleDetails = (required: any) => {
        setDetails(required)
        setShowDeleteConfirm(true)
    }


    return (<>
        <Col sm={12}>
            <Row>
                <Col md={10} sm={10} className={`${Styles.search_input} required_document_input`}>
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
                                                        return <option key={`cr_${index}`} value={dT.shortName}>{dT.fullName}</option>
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
                <Col md={2} sm={2} className="required_document_button">
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => {
                        setEditRequired(null)
                        setAddEditRequired(true)
                    }}>Add New Document Configuration</Button>
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
                    !loading && requiredDocuments.length === 0
                    && <thead>
                        <tr className='no_records' style={{ lineHeight: '35px', backgroundColor: '#e9ecef', textAlign: 'center' }}>
                            <NoRecord />
                        </tr>
                    </thead>
                }
                {
                    !loading && requiredDocuments.length > 0
                    && <>
                        <thead>
                            <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                <th>Product</th>
                                <th>Required Documents</th>
                                <th style={{ width: '120px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                requiredDocuments && requiredDocuments.map((cT: any, index: any) => {
                                    return (<tr key={`rD_${index}`}>
                                        <td>{cT.productName}</td>
                                        <td>
                                            {cT.documents && cT.documents.map((dL: any, index: any) => {
                                                return <span key={`dL_${index}`} className={Styles.required_documents}>{dL.keyValue}</span>
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
                    </>
                }
            </Table>
        </Col>
        {
            addEditRequired
            && <AddEditRequiredDocuments
                show={addEditRequired}
                onHide={() => setAddEditRequired(false)}
                editRequired={editRequired}
                Styles={Styles}
                documentTypes={documentTypes}
                dispatch={dispatch}
                productTypes={productTypes}
                selectedProduct={selectedProduct}
            />
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

const AddEditRequiredDocuments = ({ show, onHide, Styles, documentTypes, editRequired, productTypes, dispatch, selectedProduct }: any) => {
    const formRef = useRef<any>()
    const [documentTypesSelected, setDocumentTypesSelected] = useState<any>([])
    const [formError, setFormError] = useState<any>({
        productCode: false,
        requiredDoc: false
    })

    const validateUpload = (formObj: any) => {
        let formIsValid = true;
        const error: any = {
            productCode: false,
            requiredDoc: false
        }
        for (let key in formObj) {
            if (!formObj[key] || formObj[key] === "") {
                error[key] = true
            }
        }
        if (documentTypesSelected.length === 0) {
            error.requiredDoc = true
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        setFormError(error)
        return formIsValid
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        const {
            productType
        } = formRef.current;
        const payload = {
            "productCode": productType.value,
            "docTypeCode": documentTypesSelected.map((dT: any) => dT.keyCode)
        }

        if (validateUpload(payload)) {
            dispatch(RequiredDocumentActionCreator.saveRequiredDocuments(payload))
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
            <Form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
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
                                        name="productType"
                                        disabled={editRequired}
                                        defaultValue={editRequired ? editRequired.productCode : ''}
                                        className="select_custom white">
                                        <option></option>
                                        {
                                            (productTypes && productTypes.length > 0) &&
                                            productTypes.map((dT: any, index: number) => {
                                                return <option key={`cr_${index}`} disabled={selectedProduct.indexOf(dT.shortName) !== -1} value={dT.shortName}>{dT.fullName}</option>
                                            })
                                        }
                                    </Form.Control>
                                    <span style={{ color: 'red' }}><small>{formError["productCode"] ? 'Product is required' : ''}</small></span>
                                </Col>
                                <Form.Label className="label_custom white">Product</Form.Label>
                            </Form.Group>
                        </Col>
                        <br />
                        <Col sm={12}>
                            <Form.Group as={Col} className="mb-4">
                                <Col md={12} sm={12}>
                                    {/* <Form.Control defaultValue={editCost ? editCost.cost : ''} className="select_custom white" type="number" name="document_name" /> */}
                                    <PublicMethodsExample documentTypes={documentTypes} editRequired={editRequired} setDocumentTypesSelected={setDocumentTypesSelected} />
                                    <span style={{ color: 'red' }}><small>{formError["requiredDoc"] ? 'At least One Document Type is required' : ''}</small></span>
                                </Col>
                                <Form.Label className="label_custom white">Required Documents</Form.Label>
                            </Form.Group>
                        </Col>
                    </Container>
                </Modal.Body>
                <Modal.Footer style={{ padding: '1rem 4rem 2rem' }}>
                    {
                        editRequired
                        &&
                        <>
                            <Button variant="dark" type="submit" style={{ width: '100%' }}>Save</Button>
                            <Button variant="dark" style={{ width: '100%' }} onClick={onHide}>Cancel</Button>
                        </>
                    }
                    {
                        !editRequired
                        &&
                        <Button variant="dark" type="submit" style={{ width: '100%' }}>Add</Button>
                    }
                </Modal.Footer>
            </Form>
        </Modal >
    )
}

const PublicMethodsExample = ({ documentTypes, editRequired, setDocumentTypesSelected }: any) => {
    const ref = useRef<any>();
    return (
        <>
            <Typeahead
                defaultSelected={editRequired ? editRequired.documents : []}
                id="public-methods-example"
                labelKey={"keyValue"}
                multiple
                options={documentTypes}
                onChange={(selected) => {
                    setDocumentTypesSelected(selected)
                }}
                ignoreDiacritics={false}
                placeholder="Choose Document Types..."
                ref={ref}
            />
        </>
    );
};

export default RequiredDocuments;