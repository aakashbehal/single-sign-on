import { useEffect, useRef } from "react"
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'

import Styles from "./Setup.module.sass";
import { RootState } from "../../store"
import { DomainActionCreator } from "../../store/actions/domain.actions"
import TableComponent from '../../components/Table/Table'
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { useToasts } from "react-toast-notifications";
import { createMessage } from "../../helpers/messages";

const Domain = () => {
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
    const { domain, loading, totalCount, addDomainSuccess, deleteDomainSuccess, addClientError, deleteDomainError } = useSelector((state: RootState) => ({
        domain: state.domain.data,
        loading: state.domain.loading,
        totalCount: state.domain.totalCount,
        addDomainSuccess: state.domain.addSuccess,
        deleteDomainSuccess: state.domain.deleteSuccess,
        addClientError: state.domain.addError,
        deleteDomainError: state.domain.deleteError
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
        setShowAddEdit(false)
        setEditData(null)
        setShowDeleteConfirm(false)
    }, [addDomainSuccess,
        deleteDomainSuccess])

    useEffect(() => {
        if (addClientError) {
            addToast(createMessage('error', `adding`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (deleteDomainError) {
            addToast(createMessage('error', `uploading`, 'Client'), { appearance: 'error', autoDismiss: false })

        }
    }, [addClientError,
        deleteDomainError])

    useEffect(() => {
        search(pageSize, pageNumber)
    }, [sortElement, sortType])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        dispatch(DomainActionCreator.getAllDomains({
            pageSize,
            pageNumber
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

    const deleteDomain = () => {
        dispatch(DomainActionCreator.deleteDomains(details.domainId))
    }

    return (
        <>
            <Col sm={12}>
                <Row style={{ margin: 0 }} sm={12} className="form_container">
                    <Col lg={3} sm={12}></Col>
                    <Col lg={6} sm={12}>
                        <div className={Styles.add_buttons}>
                            <Button variant="dark"
                                onClick={() => setShowAddEdit(true)}
                            >Add Domain</Button>{' '}
                        </div>
                    </Col>
                    <Col lg={3} sm={12}></Col>
                </Row>
                <br />
                <br />
            </Col>
            <Col>
                <TableComponent
                    data={domain}
                    isLoading={loading}
                    map={{
                        domainId: "Domain ID",
                        name: "Name",
                        shortCode: "Short Code",
                        description: "Description",
                        createdBy: "Created By",
                    }}
                    totalCount={totalCount}
                    actionArray={[]}
                    handleNavigate={() => { }}
                    currencyColumns={[]}
                    sortElement={(header: any) => setSortElement(header)}
                    sortType={(type: any) => setSortType(type)}
                    currentPage={pageNumber}
                    setCurrentPage={setPageNumber}
                    parentComponent={'clientSetup'}
                    searchCriteria={{}}
                    hideShareArray={[
                        "domainId",
                        "name",
                        "shortCode",
                        "description",
                        "createdBy",
                    ]}
                    addEditArray={{
                        editClient: (data: any) => {
                            setShowAddEdit(true)
                            setEditData(data)
                        },
                        delete: (data: any) => {
                            setShowDeleteConfirm(true)
                            setDetails(data)
                        }
                    }}
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
            dispatch(DomainActionCreator.addDomains(formObject))
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
                                            <Form.Control type="text" name="shortName" defaultValue={data?.shortName || null} maxLength={5}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shortName"] ? 'Short Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Short Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="fullName" defaultValue={data?.fullName || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["fullName"] ? 'Full Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Full Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="description" defaultValue={data?.clientType || null}></Form.Control>
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

export default Domain