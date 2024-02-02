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

// const FILE_EXTENSIONS = ['.pdf', '.xlsx', '.xlx', '.csv']
const FILE_EXTENSIONS = [
    {
        type: 'application/pdf',
        name: "PDF"
    },
    {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: "XLSX / XLS"
    },
    {
        type: '.csv',
        name: "CSV"
    }
]

const DocumentTypePreference = () => {
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
        productTypes: state.documentGroup.data,
        loadingProductTypes: state.documentGroup.loading,
        errorProductTypes: state.documentGroup.error
    }))

    useEffect(() => {
        dispatch(DocumentGroupActionCreator.getAllDocumentGroup({}))
    }, [])

    const {
        documentTypePreference,
        loading,
        totalCount,
        addDocumentTypePreferenceSuccess,
        deleteDocumentTypePreferenceSuccess,
        updateDocumentTypePreferenceSuccess,
        addDocumentTypePreferenceError,
        deleteDocumentTypePreferenceError,
        updateDocumentTypePreferenceError,
    } = useSelector((state: RootState) => ({
        documentTypePreference: state.docTypePreference.data,
        loading: state.docTypePreference.loading,
        totalCount: state.docTypePreference.totalCount,
        addDocumentTypePreferenceSuccess: state.docTypePreference.addSuccess,
        deleteDocumentTypePreferenceSuccess: state.docTypePreference.deleteSuccess,
        updateDocumentTypePreferenceSuccess: state.docTypePreference.updatingSuccess,
        addDocumentTypePreferenceError: state.docTypePreference.addError,
        deleteDocumentTypePreferenceError: state.docTypePreference.deleteError,
        updateDocumentTypePreferenceError: state.docTypePreference.updatingError,
    }))

    useEffect(() => {
        if (addDocumentTypePreferenceSuccess) {
            addToast(createMessage('success', `added`, 'Document Type Preference'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (deleteDocumentTypePreferenceSuccess) {
            addToast(createMessage('success', `deleted`, 'Document Type Preference'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (updateDocumentTypePreferenceSuccess) {
            addToast(createMessage('success', `updating`, 'Document Type Preference'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        setShowAddEdit(false)
        setEditData(null)
        setShowDeleteConfirm(false)
    }, [addDocumentTypePreferenceSuccess,
        deleteDocumentTypePreferenceSuccess,
        updateDocumentTypePreferenceSuccess])

    useEffect(() => {
        if (addDocumentTypePreferenceError) {
            addToast(createMessage('error', `adding`, 'Document Type Preference'), { appearance: 'error', autoDismiss: false })
        }
        if (deleteDocumentTypePreferenceError) {
            addToast(createMessage('error', `deleting`, 'Document Type Preference'), { appearance: 'error', autoDismiss: false })
        }
        if (updateDocumentTypePreferenceError) {
            addToast(createMessage('error', `updating`, 'Document Type Preference'), { appearance: 'error', autoDismiss: false })
        }
    }, [addDocumentTypePreferenceError,
        deleteDocumentTypePreferenceError,
        updateDocumentTypePreferenceError])

    useEffect(() => {
        search(pageSize, pageNumber)
    }, [productType, sortElement, sortType])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        dispatch(DocumentTypePreferenceActionCreator.getAllDocumentTypePreference({
            pageSize,
            pageNumber,
            sortParam: sortElement,
            sortOrder: sortType,
            docGroupConfigCode: productType
        }))
    }

    /**
     * function is used in pagination
     * @param pageSize 
     * @param pageNumber 
     */
    const handlePagination = (pageSize: number, pageNumber: number) => {
        setPageSize(pageSize)
        search(pageSize, pageNumber)
    }

    const deleteDocumentTypePreference = () => {
        dispatch(DocumentTypePreferenceActionCreator.deleteDocumentTypePreference(details.prefId))
    }

    return (
        <>
            <Col sm={12} style={{ marginBottom: '1rem' }} >
                <Row style={{ margin: 0 }} className="form_container">
                    <Col sm={3}></Col>
                    <Col sm={6} >
                        <Row>
                            <Col sm={9}>
                                <Form.Group as={Col} className="mt-2">
                                    <Col md={12} sm={12} className="no_padding" >
                                        <Form.Control
                                            as="select"
                                            name="productType"
                                            value={productType}
                                            onChange={(e) => setProductType(e.target.value)}
                                            className="select_custom white">
                                            <option disabled value="" selected>Select Product Type...</option>
                                            {
                                                (productTypes && productTypes?.pickedDocGroups?.length > 0) &&
                                                productTypes?.pickedDocGroups.map((dT: any, index: number) => {
                                                    return <option key={`cr_${index}`} value={dT.code}>{dT.name}</option>
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                    {/* <Form.Label className="label_custom ">Product Type</Form.Label> */}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Button variant="dark" style={{ marginTop: '.8rem' }} onClick={() => setProductType('')}>Reset</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
            </Col>

            <Col sm={12} style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add New Document Type Preference</Button>
            </Col>
            <Col>
                {
                    loading &&
                    <div className={`table_loading`} >
                        <CgSpinnerAlt className="spinner" size={50} />
                    </div >
                }
                <TableComponent
                    data={documentTypePreference}
                    isLoading={loading}
                    map={{
                        "prefId": "ID",
                        "name": "Document Type",
                        "docGroupConfigName": "Product Type",
                        "fileExtension": "File Extension",
                        "externalDocTypeCodes": "External Code",
                        "externalDocNames": "External Name",
                    }}
                    totalCount={totalCount}
                    actionArray={[]}
                    handleNavigate={(data: any) => { }}
                    sortElement={(header: any) => setSortElement(header)}
                    sortType={(type: any) => setSortType(type)}
                    currentPage={pageNumber}
                    setCurrentPage={setPageNumber}
                    parentComponent={'documentTypePref'}
                    hideShareArray={[
                        "prefId",
                        "name",
                        "docGroupConfigName",
                        "fileExtension",
                        "externalDocTypeCodes",
                        "externalDocNames",
                    ]}
                    searchCriteria={{}}
                    addEditArray={
                        {
                            editClient: (data: any) => {
                                setShowAddEdit(true)
                                setEditData(data)
                            },
                            delete: (data: any) => {
                                setShowDeleteConfirm(true);
                                setDetails(data)
                            }
                        }
                    }
                    onPaginationChange={(
                        pageSize: number, pageNumber: number
                    ) => handlePagination(pageSize, pageNumber)}></TableComponent >
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
        if (data) {
            dispatch(DocumentTypePreferenceActionCreator.updateDocumentTypePreference(data.prefId, formObject))
        } else {
            dispatch(DocumentTypePreferenceActionCreator.addDocumentTypePreference(formObject))
        }
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
                    {!data ? 'Add Document Type Preference' : 'Edit Document Type Preference'}
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
                                                    (productTypes && productTypes?.availableDocGroups.length > 0) &&
                                                    [...productTypes?.availableDocGroups, ...productTypes?.pickedDocGroups].map((dT: any, index: number) => {
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
                                                                value={FE.type}
                                                            >
                                                                {FE.name}
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

export default DocumentTypePreference