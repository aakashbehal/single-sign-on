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
import { userService } from "../../services";
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
    const [editData, setEditData] = useState<any>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);

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
        if (addDocumentGroupSuccess) {
            addToast(createMessage('success', `added`, 'Document Group'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (deleteDocumentGroupSuccess) {
            addToast(createMessage('success', `deleting`, 'Document Group'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (updateSuccess) {
            addToast(createMessage('success', `updating`, 'Document Group'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        setShowAddEdit(false)
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

    useEffect(() => {
        console.log(editData)
    }, [editData])

    return (
        <>
            <Col sm={12} style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add {user.recordSource === 'Equabli' ? 'New' : ''} Document Group</Button>
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
                        !loading && documentGroup.length === 0
                        && <thead>
                            <tr className='no_records' style={{ lineHeight: '35px', backgroundColor: '#e9ecef', textAlign: 'center' }}>
                                <NoRecord />
                            </tr>
                        </thead>
                    }
                    {
                        !loading && documentGroup.length > 0
                        && <>
                            <thead>
                                <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                    <th>Document Group ID</th>
                                    <th>Name</th>
                                    <th>Short Code</th>
                                    <th>Domain Code</th>
                                    <th>Description</th>
                                    <th style={{ width: '120px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    documentGroup && documentGroup.map((cT: any, index: any) => {
                                        return (<tr key={`rD_${index}`}>
                                            <td>{cT.id}</td>
                                            <td>{cT.name}</td>
                                            <td>{cT.code}</td>
                                            <td>{cT.domainCode}</td>
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
    console.log(`-data-`, data)
    const documentGroupFormRef = useRef<any>()
    const domainRef = useRef<any>()
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
        productTypes: state.types.productType.data,
        // loadingProductTypes: state.types.productType.loading,
        // errorProductTypes: state.types.productType.error,
    }))

    useEffect(() => {
        dispatch(TypesActionCreator.getProductTypes())
    }, [])

    const validate = (formObj: any) => {
        let checkFormObj: any = {}
        let formIsValid = true;
        if (user.recordSource === 'Equabli') {
            checkFormObj = {
                domainCode: formObj.domainCode,
                name: formObj.name,
                description: formObj.description,
                docGroupId: formObj.docGroupId
            }
            const error: any = {
                domainCode: false,
                name: false,
                description: false,
                docGroupId: false
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
            setFormError(error)
        } else {
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
        }

        return formIsValid
    }

    const addEditSubmit = () => {
        const {
            domain,
            shortName,
            fullName,
            description,
            document_group
        } = documentGroupFormRef.current
        let formObject: any = {
            orgType: user.recordSource
        }
        if (user.recordSource !== 'Equabli') {
            formObject.docGroupConfigCode = document_group?.value
        } else {
            formObject.docGroupId = data?.id || null
            formObject.domainCode = domain?.value || null
            formObject.name = fullName?.value || null
            formObject.description = description?.value || null
            formObject.code = shortName?.value || null
        }
        if (validate(formObject)) {
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
                    {!data ? 'Add Document Group' : 'Edit Document Group'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={documentGroupFormRef}>
                        <Row>
                            <Col xs={12} md={12} className="mt-3">
                                {
                                    user.recordSource === 'Equabli' &&
                                    <>
                                        <Col lg={12} md={12} className="no_padding">
                                            <Form.Group as={Col} className="mb-4">
                                                <Domains selectedValue={data ? data.domainCode : ''} />
                                                <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shortName"] ? 'Short Name is required ' : ''}</small></span>
                                                <Form.Label className="label_custom white">Domains</Form.Label>
                                            </Form.Group>
                                        </Col>
                                        <Col lg={12} md={12} className="no_padding">
                                            <Form.Group as={Col} className="mb-4">
                                                <Col md={12} sm={12} className="no_padding">
                                                    <Form.Control type="text" name="shortName" defaultValue={data?.code || null} maxLength={5}></Form.Control>
                                                </Col>
                                                <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shortName"] ? 'Short Name is required ' : ''}</small></span>
                                                <Form.Label className="label_custom white">Short Name</Form.Label>
                                            </Form.Group>
                                        </Col>
                                        <Col lg={12} md={12} className="no_padding">
                                            <Form.Group as={Col} className="mb-4">
                                                <Col md={12} sm={12} className="no_padding">
                                                    <Form.Control type="text" name="fullName" defaultValue={data?.name || null}></Form.Control>
                                                </Col>
                                                <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["fullName"] ? 'Full Name is required ' : ''}</small></span>
                                                <Form.Label className="label_custom white">Full Name</Form.Label>
                                            </Form.Group>
                                        </Col>
                                        <Col lg={12} md={12} className="no_padding">
                                            <Form.Group as={Col} className="mb-4">
                                                <Col md={12} sm={12} className="no_padding">
                                                    <Form.Control type="text" name="description" defaultValue={data?.description || null}></Form.Control>
                                                </Col>
                                                <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["description"] ? 'Description is required ' : ''}</small></span>
                                                <Form.Label className="label_custom white">Description</Form.Label>
                                            </Form.Group>
                                        </Col>
                                    </>
                                }
                                {
                                    user.recordSource !== 'Equabli' &&
                                    <>
                                        <Col lg={12} md={12} className="no_padding">
                                            <Form.Group as={Col} className="mb-4">
                                                <Form.Control
                                                    as="select"
                                                    name="document_group"
                                                    className="select_custom white"
                                                >
                                                    <option value="" disabled selected>Select Document Group</option>
                                                    {
                                                        (productTypes && productTypes.length > 0) &&
                                                        productTypes.map((product: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={product?.code}>{product?.name}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                                <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["docGroupConfigCode"] ? 'Document Type is required' : ''}</small></span>
                                                <Form.Label className="label_custom white">Document Group</Form.Label>
                                            </Form.Group>
                                        </Col>

                                    </>

                                }

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