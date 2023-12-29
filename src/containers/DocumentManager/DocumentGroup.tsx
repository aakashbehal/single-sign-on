import { useEffect, useRef } from "react"
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap'

import Styles from "./DocumentManager.module.sass";
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
import { clientServices, userService } from "../../services";
import { TypesActionCreator } from "../../store/actions/common/types.actions";

const DocumentGroup = () => {
    const dispatch = useDispatch();
    const user = userService.getUser()
    const { addToast } = useToasts()
    const [sortElement, setSortElement] = useState('modifiedDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showAddEdit, setShowAddEdit] = useState<boolean>(false)
    const [showSelectGroup, setShowSelectGroup] = useState<boolean>(false)
    const [editData, setEditData] = useState<any>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [docGroups, setDocGroups] = useState([])

    const {
        documentGroup,
        loading,
        totalCount,
        addDocumentGroupSuccess,
        deleteDocumentGroupSuccess,
        addClientError,
        deleteDocumentGroupError,
        updating,
        updateSuccess,
        updateError
    } = useSelector((state: RootState) => ({
        documentGroup: state.documentGroup.data,
        loading: state.documentGroup.loading,
        totalCount: state.documentGroup.totalCount,
        addDocumentGroupSuccess: state.documentGroup.addSuccess,
        deleteDocumentGroupSuccess: state.documentGroup.deleteSuccess,
        addClientError: state.documentGroup.addError,
        deleteDocumentGroupError: state.documentGroup.deleteError,
        updating: state.documentGroup.updating,
        updateSuccess: state.documentGroup.updateSuccess,
        updateError: state.documentGroup.updateError,
    }))

    useEffect(() => {
        const userType = userService.getUserType()
        if (userType === 'Client') {
            setDocGroups(documentGroup.pickedDocGroups)
        } else if (userType === 'Equabli') {
            setDocGroups(documentGroup)
        }
    }, [documentGroup])

    useEffect(() => {
        if (addDocumentGroupSuccess) {
            addToast(createMessage('success', `added`, 'Product Type'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (deleteDocumentGroupSuccess) {
            addToast(createMessage('success', `deleting`, 'Product Type'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (updateSuccess) {
            addToast(createMessage('success', `updating`, 'Product Type'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        setShowAddEdit(false)
        setShowSelectGroup(false)
        setEditData(null)
        setShowDeleteConfirm(false)
    }, [addDocumentGroupSuccess,
        updateSuccess,
        deleteDocumentGroupSuccess])

    useEffect(() => {
        if (addClientError) {
            addToast(createMessage('error', `adding`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (deleteDocumentGroupError) {
            addToast(createMessage('error', `deleting`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (updateError) {
            addToast(createMessage('error', `uploading`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
    }, [addClientError,
        updateError,
        deleteDocumentGroupError])

    useEffect(() => {
        search(pageSize, pageNumber)
    }, [sortElement, sortType])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        dispatch(DocumentGroupActionCreator.getAllDocumentGroup({
            pageSize,
            pageNumber,
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

    const deleteDocumentGroup = () => {
        dispatch(DocumentGroupActionCreator.deleteDocumentGroup(details.id, user.recordSource))
    }
    const [documentGroupPicked, setDocumentGroupPicked] = useState([])
    useEffect(() => {
        setDocumentGroupPicked(documentGroup?.pickedDocGroups)
    }, [documentGroup])

    return (
        <>
            <Col sm={12} style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add {user.recordSource === 'Equabli' ? 'New' : ''} Product Type</Button>{" "}
                {user.recordSource !== 'Equabli' && <Button variant="dark" className="pull-right" onClick={() => setShowSelectGroup(true)}>Select Product Type</Button>}
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
                        !loading && docGroups?.length === 0
                        && <thead>
                            <tr className='no_records' style={{ lineHeight: '35px', backgroundColor: '#e9ecef', textAlign: 'center' }}>
                                <NoRecord />
                            </tr>
                        </thead>
                    }
                    {
                        !loading && docGroups?.length > 0
                        && <>
                            <thead>
                                <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                    <th>Product Type ID</th>
                                    <th>Name</th>
                                    <th>Short Code</th>
                                    <th>Domain</th>
                                    <th>Description</th>
                                    <th style={{ width: '120px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    docGroups && docGroups.map((cT: any, index: any) => {
                                        return (<tr key={`rD_${index}`}>
                                            <td>{cT.id}</td>
                                            <td>{cT.name}</td>
                                            <td>{cT.code}</td>
                                            <td>{cT.domainName}</td>
                                            <td>{cT.description}</td>
                                            <td className='span1' style={{ minWidth: '130px', textAlign: 'center' }}>
                                                {/* <span>
                                                    <OverlayTrigger
                                                        placement="bottom"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={
                                                            <Tooltip id={`tooltip-error`}>
                                                                Edit
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <FiEdit2 onClick={() => {
                                                            setShowAddEdit(true)
                                                            setEditData(cT)
                                                        }} size={20} style={{ cursor: 'pointer' }} />
                                                    </OverlayTrigger>
                                                </span> &nbsp; */}
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
                                                        <AiOutlineDelete onClick={() => {
                                                            setShowDeleteConfirm(true)
                                                            setDetails(cT)
                                                        }} size={20} style={{ cursor: 'pointer' }} />
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
                showAddEdit
                && <AddEditClient
                    onHide={() => {
                        setShowAddEdit(!showAddEdit)
                        setEditData(null)
                    }}
                    show={showAddEdit}
                    data={editData}
                    user={user}
                    dispatch={dispatch}
                />
            }
            {
                showSelectGroup
                && <SelectDocumentGroup
                    onHide={() => {
                        setShowSelectGroup(!showSelectGroup)
                    }}
                    show={showSelectGroup}
                    user={user}
                    dispatch={dispatch}
                />
            }
            {
                showDeleteConfirm
                && <DeleteConfirm
                    show={showDeleteConfirm}
                    onHide={() => setShowDeleteConfirm(false)}
                    confirmDelete={() => deleteDocumentGroup()}
                    details={details}
                    type='documents'
                />
            }
        </>
    )
}

const AddEditClient = ({ onHide, show, data, dispatch, user }: any) => {
    const documentGroupFormRef = useRef<any>()
    const domainRef = useRef<any>()
    const [clientDomain, setClientDomain] = useState('')
    const [formError, setFormError] = useState<any>({
        documentGroupShortCode: false,
        domainName: false,
        description: false,
        docGroupConfigCode: false
    })

    const {
        productTypes,
        // loadingProductTypes,
        // errorProductTypes,
    } = useSelector((state: any) => ({
        productTypes: state.documentGroup.data,
        // loadingProductTypes: state.types.productType.loading,
        // errorProductTypes: state.types.productType.error,
    }))

    useEffect(() => {
        dispatch(DocumentGroupActionCreator.getAllDocumentGroup({}))
        const userType = userService.getUserType()
        if (userType === 'Client') {
            getClientDomain()
        }
    }, [])

    const getClientDomain = async () => {
        let data = await clientServices.getOnboardingDetails([user.userOrgCode])
        setClientDomain(data[0].code)
    }

    const validate = (formObj: any) => {
        console.log(`--formObj-`, formObj)
        let formIsValid = true;
        let checkFormObj: any = {
            domainCode: formObj.domainCode,
            name: formObj.name,
            description: formObj.description,
            code: formObj.code
        }
        let error: any = {
            domainCode: false,
            name: false,
            description: false,
            code: false
        }
        for (let key in checkFormObj) {
            if ((!checkFormObj[key] || checkFormObj[key] === "") && key !== 'docGroupId') {
                error[key] = true
            }
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        console.log(`---error`, error)
        setFormError(error)
        return formIsValid
    }

    const addEditSubmit = () => {
        const {
            domain,
            code,
            name,
            description
        } = documentGroupFormRef.current
        let formObject: any = {}
        if (user.recordSource === 'Equabli' && !data) {
            formObject.docGroupId = data?.id || null
        }
        formObject.name = name?.value || null
        formObject.description = description?.value || null
        formObject.code = code?.value || null
        formObject.domainCode = user.recordSource === 'Equabli' ? domain?.value : clientDomain
        formObject.orgType = user.recordSource
        if (validate(formObject)) {
            formObject.isNative = user.recordSource === 'Equabli'
            console.log(`---formObject--`, formObject)
            if (!data) {
                dispatch(DocumentGroupActionCreator.addDocumentGroup(formObject))
            } else {
                dispatch(DocumentGroupActionCreator.updateDocumentGroup(formObject))
            }
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
                    {!data ? 'Add Product Type' : 'Edit Product Type'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={documentGroupFormRef}>
                        <Row>
                            <Col xs={12} md={12} className="mt-3">
                                <>
                                    {
                                        user.recordSource === 'Equabli' &&
                                        <Col lg={12} md={12} className="">
                                            <Form.Group as={Col} className="mb-3">
                                                <Domains selectedValue={data ? data.domainCode : ''} />
                                                <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["domainCode"] ? 'Short Name is required ' : ''}</small></span>
                                                <Form.Label className="label_custom white">Domains</Form.Label>
                                            </Form.Group>
                                        </Col>
                                    }
                                    <Col lg={12} md={12} className="">
                                        <Form.Group as={Col} className="mb-3">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control type="text" name="code" defaultValue={data?.code || null} maxLength={5}></Form.Control>
                                            </Col>
                                            <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["code"] ? 'Short Name is required ' : ''}</small></span>
                                            <Form.Label className="label_custom white">Short Name</Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12} md={12} className="">
                                        <Form.Group as={Col} className="mb-3">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control type="text" name="name" defaultValue={data?.name || null}></Form.Control>
                                            </Col>
                                            <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["name"] ? 'Full Name is required ' : ''}</small></span>
                                            <Form.Label className="label_custom white">Full Name</Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12} md={12} className="">
                                        <Form.Group as={Col} className="mb-0">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control type="text" name="description" defaultValue={data?.description || null}></Form.Control>
                                            </Col>
                                            <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["description"] ? 'Description is required ' : ''}</small></span>
                                            <Form.Label className="label_custom white">Description</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </>
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

const SelectDocumentGroup = ({ onHide, show, dispatch, user }: any) => {
    const documentGroupFormRef = useRef<any>()
    const domainRef = useRef<any>()
    const [formError, setFormError] = useState<any>({
        documentGroupShortCode: false,
    })

    const {
        productTypes,
        // loadingProductTypes,
        // errorProductTypes,
    } = useSelector((state: any) => ({
        productTypes: state.documentGroup.data,
        // loadingProductTypes: state.types.productType.loading,
        // errorProductTypes: state.types.productType.error,
    }))

    useEffect(() => {
        dispatch(DocumentGroupActionCreator.getAllDocumentGroup({}))
    }, [])

    const validate = (formObj: any) => {
        let checkFormObj: any = {}
        let formIsValid = true;
        checkFormObj = {
            docGroupConfigCode: formObj.docGroupConfigCode
        }
        const error: any = {
            docGroupConfigCode: false
        }
        for (let key in checkFormObj) {
            if ((!checkFormObj[key] || checkFormObj[key] === "")) {
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

    const addEditSubmit = () => {
        const {
            document_group
        } = documentGroupFormRef.current
        let formObject: any = {
            orgType: user.recordSource,
            docGroupConfigCode: document_group?.value || null
        }
        if (validate(formObject)) {
            dispatch(DocumentGroupActionCreator.addDocumentGroup(formObject))
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
                    Select Product Type
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={documentGroupFormRef}>
                        <Row>
                            <Col xs={12} md={12} className="mt-3">
                                <Col lg={12} md={12} className="">
                                    <Form.Group as={Col} className="mb-4">
                                        <Form.Control
                                            as="select"
                                            name="document_group"
                                            className="select_custom white"
                                        >
                                            <option value="" disabled selected>Select Product Type</option>
                                            {
                                                (productTypes && productTypes?.availableDocGroups?.length > 0) &&
                                                productTypes?.availableDocGroups?.map((product: any, index: number) => {
                                                    return <option key={`cr_${index}`} value={product?.code}>{product?.name}</option>
                                                })
                                            }
                                        </Form.Control>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["docGroupConfigCode"] ? 'Product Type is required' : ''}</small></span>
                                        <Form.Label className="label_custom white">Product Type</Form.Label>
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

export default DocumentGroup