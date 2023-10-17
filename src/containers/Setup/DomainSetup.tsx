import { useEffect, useRef } from "react"
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Container, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap'

import Styles from "./Setup.module.sass";
import { RootState } from "../../store"
import { DomainActionCreator } from "../../store/actions/domain.actions"
import TableComponent from '../../components/Table/Table'
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { useToasts } from "react-toast-notifications";
import { createMessage } from "../../helpers/messages";
import NoRecord from "../../components/Common/NoResult";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { CgSpinnerAlt } from "react-icons/cg";

const DomainSetup = () => {
    const dispatch = useDispatch();
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
        domain,
        loading,
        addDomainSuccess,
        deleteDomainSuccess,
        addClientError,
        deleteDomainError,
        updating,
        updateSuccess,
        updateError
    } = useSelector((state: RootState) => ({
        domain: state.domain.data,
        loading: state.domain.loading,
        addDomainSuccess: state.domain.addSuccess,
        deleteDomainSuccess: state.domain.deleteSuccess,
        addClientError: state.domain.addError,
        deleteDomainError: state.domain.deleteError,
        updating: state.domain.updating,
        updateSuccess: state.domain.updateSuccess,
        updateError: state.domain.updateError,
    }))

    useEffect(() => {
        if (addDomainSuccess) {
            addToast(createMessage('success', `added`, 'Domain'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (deleteDomainSuccess) {
            addToast(createMessage('success', `deleting`, 'Domain'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (updateSuccess) {
            addToast(createMessage('success', `updating`, 'Domain'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        setShowAddEdit(false)
        setEditData(null)
        setShowDeleteConfirm(false)
    }, [addDomainSuccess,
        updateSuccess,
        deleteDomainSuccess])

    useEffect(() => {
        if (addClientError) {
            addToast(createMessage('error', `adding`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (deleteDomainError) {
            addToast(createMessage('error', `deleting`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (updateError) {
            addToast(createMessage('error', `uploading`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
    }, [addClientError,
        updateError,
        deleteDomainError])

    useEffect(() => {
        search(pageSize, pageNumber)
    }, [sortElement, sortType])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        dispatch(DomainActionCreator.getAllDomains())
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

    const deleteDomain = () => {
        dispatch(DomainActionCreator.deleteDomains(details.domainId))
    }

    useEffect(() => {
        console.log(editData)
    }, [editData])

    return (
        <>
            <Col sm={12} style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add New Domain</Button>
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
                        !loading && domain.length === 0
                        && <thead>
                            <tr className='no_records' style={{ lineHeight: '35px', backgroundColor: '#e9ecef', textAlign: 'center' }}>
                                <NoRecord />
                            </tr>
                        </thead>
                    }
                    {
                        !loading && domain.length > 0
                        && <>
                            <thead>
                                <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                    <th>Domain ID</th>
                                    <th>Name</th>
                                    <th>Short Code</th>
                                    <th>Description</th>
                                    <th>Created By</th>
                                    <th style={{ width: '120px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    domain && domain.map((cT: any, index: any) => {
                                        return (<tr key={`rD_${index}`}>
                                            <td>{cT.domainId}</td>
                                            <td>{cT.name}</td>
                                            <td>{cT.shortCode}</td>
                                            <td>{cT.description}</td>
                                            <td>{cT.createdBy}</td>
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
                                                        <FiEdit2 onClick={() => {
                                                            setShowAddEdit(true)
                                                            setEditData(cT)
                                                        }} size={20} style={{ cursor: 'pointer' }} />
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
                    dispatch={dispatch}
                />
            }
            {
                showDeleteConfirm
                && <DeleteConfirm
                    show={showDeleteConfirm}
                    onHide={() => setShowDeleteConfirm(false)}
                    confirmDelete={() => deleteDomain()}
                    details={details}
                    type='documents'
                />
            }
        </>
    )
}

const AddEditClient = ({ onHide, show, data, dispatch }: any) => {
    const clientFormRef = useRef<any>()
    const [formError, setFormError] = useState<any>({
        domainShortCode: false,
        domainName: false,
        description: false
    })

    const validate = (formObj: any) => {
        let checkFormObj: any = {
            domainShortCode: formObj.domainShortCode,
            domainName: formObj.domainName,
            description: formObj.description,
            domainId: formObj.domainId
        }
        let formIsValid = true;
        const error: any = {
            domainShortCode: false,
            domainName: false,
            description: false,
            domainId: false
        }
        for (let key in checkFormObj) {
            if ((!checkFormObj[key] || checkFormObj[key] === "") && key !== 'domainId') {
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
            shortName,
            fullName,
            description
        } = clientFormRef.current
        let formObject = {
            domainId: data?.domainId || null,
            domainShortCode: shortName?.value || null,
            domainName: fullName?.value || null,
            description: description?.value || null
        }
        if (validate(formObject)) {
            if (!data) {
                dispatch(DomainActionCreator.addDomains(formObject))
            } else {
                dispatch(DomainActionCreator.updateDomain(formObject))
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
                    {!data ? 'Add Domain' : 'Edit Domain'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={clientFormRef}>
                        <Row>
                            <Col xs={12} md={12} className="mt-3">
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="shortName" defaultValue={data?.shortCode || null} maxLength={5}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shortName"] ? 'Short Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Short Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="fullName" defaultValue={data?.name || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["fullName"] ? 'Full Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Full Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="description" defaultValue={data?.description || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["description"] ? 'Description is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Description</Form.Label>
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

export default DomainSetup