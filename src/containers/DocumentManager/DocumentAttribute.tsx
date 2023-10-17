import { useEffect, useRef } from "react"
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap'

import Styles from "./Setup.module.sass";
import { RootState } from "../../store"
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { useToasts } from "react-toast-notifications";
import { createMessage } from "../../helpers/messages";
import NoRecord from "../../components/Common/NoResult";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { CgSpinnerAlt } from "react-icons/cg";
import { DocumentGroupActionCreator } from "../../store/actions/documentGroup.actions";
import Domains from "../../components/Common/Domains";
import { DocumentTypePreferenceActionCreator } from "../../store/actions/documentTypePreference.actions";
import DocumentTypes from "../../components/Common/DocumentType";
import MultipleInputs from "../../components/Common/MultipleInputs";
import TableComponent from "../../components/Table/Table";
import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { DocumentAttributeActionCreator } from "../../store/actions/documentAttribute.actions";

const FILE_EXTENSIONS = ['.pdf', '.xlsx', '.xlx', '.csv']

export default () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts()
    const [sortElement, setSortElement] = useState('createdAt')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showAddEdit, setShowAddEdit] = useState<boolean>(false)
    const [editData, setEditData] = useState<any>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [productType, setProductType] = useState('');
    const {
        productTypes,
        loadingProductTypes,
        errorProductTypes,
    } = useSelector((state: any) => ({
        productTypes: state.types.productType.data,
        loadingProductTypes: state.types.productType.loading,
        errorProductTypes: state.types.productType.error
    }))

    useEffect(() => {
        dispatch(TypesActionCreator.getProductTypes())
    }, [])

    const {
        data,
        error,
        loading,
        updating,
        updateSuccess,
        updateError,
        adding,
        addSuccess,
        addError,
        deleting,
        deleteSuccess,
        deleteError,
        addingNew,
        addNewSuccess,
        addNewError,
    } = useSelector((state: RootState) => ({
        data: state.docAttribute.data,
        error: state.docAttribute.error,
        loading: state.docAttribute.loading,
        updating: state.docAttribute.updating,
        updateSuccess: state.docAttribute.updateSuccess,
        updateError: state.docAttribute.updateError,
        adding: state.docAttribute.adding,
        addSuccess: state.docAttribute.addSuccess,
        addError: state.docAttribute.addError,
        deleting: state.docAttribute.deleting,
        deleteSuccess: state.docAttribute.deleteSuccess,
        deleteError: state.docAttribute.deleteError,
        addingNew: state.docAttribute.addingNew,
        addNewSuccess: state.docAttribute.addNewSuccess,
        addNewError: state.docAttribute.addNewError,
    }))

    // useEffect(() => {
    //     if (addDocumentTypePreferenceSuccess) {
    //         addToast(createMessage('success', `added`, 'Document Type Preference'), { appearance: 'success', autoDismiss: true })
    //         search()
    //     }
    //     if (deleteDocumentTypePreferenceSuccess) {
    //         addToast(createMessage('success', `deleting`, 'Document Type Preference'), { appearance: 'success', autoDismiss: true })
    //         search()
    //     }
    //     setShowAddEdit(false)
    //     setEditData(null)
    //     setShowDeleteConfirm(false)
    // }, [addDocumentTypePreferenceSuccess,
    //     deleteDocumentTypePreferenceSuccess])

    // useEffect(() => {
    //     if (addDocumentTypePreferenceError) {
    //         addToast(createMessage('error', `adding`, 'Document Type Preference'), { appearance: 'error', autoDismiss: false })
    //     }
    //     if (deleteDocumentTypePreferenceError) {
    //         addToast(createMessage('error', `deleting`, 'Document Type Preference'), { appearance: 'error', autoDismiss: false })
    //     }
    // }, [addDocumentTypePreferenceError,
    //     deleteDocumentTypePreferenceError])

    useEffect(() => {
        search()
    }, [])

    const search = (
    ) => {
        dispatch(DocumentAttributeActionCreator.getAllDocumentAttribute())
    }

    const deleteDocumentTypePreference = () => {
        console.log(details)
        dispatch(DocumentTypePreferenceActionCreator.deleteDocumentTypePreference(details.prefId))
    }

    return (
        <>

            <Col sm={12} style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add Document Attribute</Button>{" "}
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add New Document Attribute</Button>
            </Col>
            <Col>
                {
                    loading &&
                    <div className={`table_loading`} >
                        <CgSpinnerAlt className="spinner" size={50} />
                    </div >
                }
                {JSON.stringify(data)}
            </Col>
            {
                showAddEdit
                && <AddEditClient
                    onHide={() => {
                        setShowAddEdit(!showAddEdit)
                        setEditData(null)
                    }}
                    show={showAddEdit}
                    data={editData}
                    productTypes={productTypes}
                    dispatch={dispatch}
                />
            }
            {
                showDeleteConfirm
                && <DeleteConfirm
                    show={showDeleteConfirm}
                    onHide={() => setShowDeleteConfirm(false)}
                    confirmDelete={() => deleteDocumentTypePreference()}
                    details={details}
                    type='documents'
                />
            }
        </>
    )
}

const AddEditClient = ({ onHide, show, data, dispatch, productTypes }: any) => {
    const documentGroupFormRef = useRef<any>()
    const [documentError, setDocumentError] = useState<boolean>(false)
    const [fileExtension, setFileExtension] = useState<string>(data?.fileExtension || '')
    const [productType, setProductType] = useState(data?.docGroupConfigCode || '')
    const [externalCodes, setExternalCodes] = useState(data?.externalDocTypeCodes || [])
    const [externalNames, setExternalNames] = useState(data?.externalDocNames || [])



    const addEditSubmit = () => {
        setDocumentError(false)
        const {
            document_type
        } = documentGroupFormRef.current
        let formObject = {
            docTypeCode: document_type.value,
            docGroupCode: productType,
            fileExtension: fileExtension,
            externalDocTypeCode: externalCodes,
            externalDocName: externalNames
        }
        if (!formObject.docTypeCode) {
            setDocumentError(true)
            return
        }
        dispatch(DocumentTypePreferenceActionCreator.addDocumentTypePreference({ prefOrgDocTypes: [formObject] }))
    }

    return (
        <Modal
            onHide={onHide}
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {!data ? 'Add Document Group' : 'Edit Document Group'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={documentGroupFormRef}>
                        <Row>
                            <Col xs={12} md={12} className="mt-3">
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12} className="no_padding">
                                            <DocumentTypes selectedValue={data?.code} />
                                            <span style={{ color: 'red' }}><small>{documentError ? 'Document Type is required ' : ''}</small></span>
                                        </Col>
                                        <Form.Label className="label_custom white">Document Type</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12} className="no_padding" >
                                            <Form.Control
                                                as="select"
                                                name="productType"
                                                value={productType}
                                                onChange={(e) => setProductType(e.target.value)}
                                                className="select_custom white">
                                                <option disabled value="">Select Product Type...</option>
                                                {
                                                    (productTypes && productTypes.length > 0) &&
                                                    productTypes.map((dT: any, index: number) => {
                                                        return <option key={`cr_${index}`} value={dT.code}>{dT.name}</option>
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Form.Label className="label_custom white">Product Type</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12} className="no_padding">
                                            <Form.Control
                                                as="select"
                                                name="fileExtension"
                                                value={fileExtension}
                                                className="select_custom"
                                                onChange={(e) => { setFileExtension(e.target.value) }}
                                            >
                                                <option disabled value="">Select Extension...</option>
                                                {
                                                    FILE_EXTENSIONS && FILE_EXTENSIONS.map((FE: any, index: number) => {
                                                        return (
                                                            <option
                                                                key={`client${index}`}
                                                                value={FE}
                                                            >
                                                                {FE}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Form.Label className="label_custom white">File Extension</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12} className="no_padding">
                                            <MultipleInputs multipleValues={externalCodes} setMultipleValues={setExternalCodes} />
                                        </Col>
                                        <Form.Label className="label_custom white">External Code</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12} className="no_padding">
                                            <MultipleInputs multipleValues={externalNames} setMultipleValues={setExternalNames} />
                                        </Col>
                                        <Form.Label className="label_custom white">External Name</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Modal.Body >
            <Modal.Footer>
                <Button variant="dark" onClick={onHide}>Close</Button>
                <Button variant="dark" onClick={() => addEditSubmit()}>Save</Button>
            </Modal.Footer>
        </Modal >
    )
}
