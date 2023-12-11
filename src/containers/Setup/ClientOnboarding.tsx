import { useState, useEffect, useRef } from "react";
import { Col, Row, Button, Modal, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import 'react-bootstrap-typeahead/css/Typeahead.css';

import TableComponent from "../../components/Table/Table";
import Styles from "./Setup.module.sass";
import { ClientSetupActionCreator } from "../../store/actions/clientSetup.actions";
import States from "../../components/Common/States";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";
import Domains from "../../components/Common/Domains";
import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { Typeahead } from "react-bootstrap-typeahead";
import DeleteConfirm from "../../components/modal/DeleteConfirm";

const ClientOnboarding = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [sortElement, setSortElement] = useState('modifiedDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showAddEdit, setShowAddEdit] = useState<boolean>(false)
    const [editData, setEditData] = useState<any>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        clients,
        totalCount,
        error,
        loading,
        addDomainClientSuccess,
        addDomainClientLoading,
        addDomainClientError,
        addGroupClientSuccess,
        addGroupClientLoading,
        addGroupClientError,
    } = useSelector((state: any) => ({
        clients: state.clients.data,
        error: state.clients.error,
        loading: state.clients.loading,
        totalCount: state.clients.totalCount,
        addDomainClientSuccess: state.clients.addDomainClientSuccess,
        addDomainClientLoading: state.clients.addDomainClientLoading,
        addDomainClientError: state.clients.addDomainClientError,
        addGroupClientSuccess: state.clients.addGroupClientSuccess,
        addGroupClientLoading: state.clients.addGroupClientLoading,
        addGroupClientError: state.clients.addGroupClientError,
    }))

    useEffect(() => {
        search(pageSize, pageNumber)
    }, [sortElement, sortType])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        dispatch(ClientSetupActionCreator.getAllClients({
            pageSize,
            pageNumber,
            isOnboarding: true
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

    useEffect(() => {
        if (addDomainClientSuccess) {
            addToast(createMessage('success', `added`, 'Client Domain'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (addGroupClientSuccess) {
            addToast(createMessage('success', `uploaded`, 'Client Document Group'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        setShowAddEdit(false)
        setEditData(null)
        setAddDomainModal(false)
        setAddGroupModal(false)
    }, [
        addDomainClientSuccess,
        addGroupClientSuccess
    ])

    useEffect(() => {
        if (addDomainClientError) {
            addToast(createMessage('error', `adding`, 'Client Domain'), { appearance: 'error', autoDismiss: false })
        }
        if (addGroupClientError) {
            addToast(createMessage('error', `adding`, 'Client Document Group'), { appearance: 'error', autoDismiss: false })
        }
    }, [
        addDomainClientError,
        addGroupClientError
    ])

    const [addDomainModal, setAddDomainModal] = useState(false)
    const [addGroupModal, setAddGroupModal] = useState(false)
    const addDomainHandler = (client: any) => {
        setEditData(client)
        setAddDomainModal(true)
    }

    const addGroupHandler = (client: any) => {
        setEditData(client)
        setAddGroupModal(true)
    }

    const deactivateHandler = () => {
        dispatch(ClientSetupActionCreator.deactivateClient(editData.clientId))
    }

    useEffect(() => {
        console.log(JSON.stringify(clients))
    }, [clients])

    return (
        <>
            <Col>
                <TableComponent
                    data={clients}
                    isLoading={loading}
                    map={{
                        fullName: "Client",
                        shortCode: "Client Code",
                        domainName: "Domain Name",
                        docGroup: "Document groups",
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
                        "fullName",
                        "shortCode",
                        "domainName",
                        "docGroup",
                    ]}
                    addEditArray={{
                        addDomainHandler: (client: any) => {
                            addDomainHandler(client)
                        },
                        addGroupHandler: (client: any) => {
                            addGroupHandler(client)
                        }
                    }}
                    onPaginationChange={(
                        pageSize: number, pageNumber: number
                    ) => handlePagination(pageSize, pageNumber)}></TableComponent >
            </Col>
            {
                addDomainModal
                && <AddClientDomain
                    onHide={() => {
                        setAddDomainModal(!addDomainModal)
                        setEditData(null)
                    }}
                    show={addDomainModal}
                    data={editData}
                    dispatch={dispatch}
                />
            }
            {
                addGroupModal
                && <AddClientDocumentGroup
                    onHide={() => {
                        setAddGroupModal(!addGroupModal)
                        setEditData(null)
                    }}
                    show={addGroupModal}
                    data={editData}
                    dispatch={dispatch}
                />
            }
        </>
    )
}

const AddClientDomain = ({ onHide, show, data, dispatch }: any) => {
    const clientFormRef = useRef<any>()
    const [formError, setFormError] = useState<any>({
        domainCode: false,
    })

    const validate = (formObj: any) => {
        let checkFormObj: any = {
            domainCode: formObj.domainCode,
        }
        let formIsValid = true;
        const error: any = {
            domainCode: false
        }
        for (let key in checkFormObj) {
            if (!checkFormObj[key] || checkFormObj[key] === "") {
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
            domain,
        } = clientFormRef.current
        let formObject = {
            orgTypeCode: 'CL',
            orgCode: data?.shortCode,
            domainCode: domain?.value
        }
        if (validate(formObject)) {
            dispatch(ClientSetupActionCreator.addClientDomain(formObject))
        }
    }

    return (
        <Modal
            onHide={onHide}
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Select Domain Code
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={clientFormRef}>
                        <Row>
                            <Col xs={12} md={12} className="mt-3">
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col}>
                                        <Col md={12} sm={12} >
                                            <Domains />
                                        </Col>
                                        <Form.Label className="label_custom white">Domain</Form.Label>
                                        <span style={{ color: 'red' }}><small>{formError["domainCode"] ? 'Please Select a Domain Code' : ''}</small></span>
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

const AddClientDocumentGroup = ({ onHide, show, data, dispatch }: any) => {
    const ref = useRef<any>()
    const clientFormRef = useRef<any>()
    const [documentGroups, setDocumentGroups] = useState<string[]>([])
    const [documentGroupError, setDocumentGroupError] = useState<boolean>(false)

    useEffect(() => {
        dispatch(TypesActionCreator.getProductTypes())
    }, [])

    const {
        productTypes,
        loadingProductTypes,
        errorProductTypes,
    } = useSelector((state: any) => ({
        productTypes: state.types.productType.data,
        loadingProductTypes: state.types.productType.loading,
        errorProductTypes: state.types.productType.error,
    }))


    const addEditSubmit = () => {
        let formObject = {
            orgTypeCode: 'CL',
            orgCode: data?.shortCode,
            documentGroupCode: documentGroups
        }
        if (documentGroups.length > 0) {
            dispatch(ClientSetupActionCreator.addClientGroup(formObject))
        } else {
            setDocumentGroupError(true)
        }
    }

    return (
        <Modal
            onHide={onHide}
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Select Domain Code
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={clientFormRef}>
                        <Row>
                            <Col xs={12} md={12} className="mt-3">
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} >
                                        <Col md={12} sm={12} >
                                            <Typeahead
                                                isLoading={loadingProductTypes}
                                                id="public-methods-example"
                                                labelKey="name"
                                                multiple
                                                ref={ref}
                                                className="input_custom_type_ahead"
                                                allowNew={true}
                                                newSelectionPrefix='Not a Platform User: '
                                                onChange={(selected) => {
                                                    let selectedUpdated = selected.map((s: any) => {
                                                        return s.code
                                                    })
                                                    setDocumentGroups(selectedUpdated)
                                                }}
                                                options={productTypes}
                                            />
                                        </Col>
                                        <Form.Label className="label_custom white">Document Group</Form.Label>
                                        <span style={{ color: 'red' }}><small>{documentGroupError ? 'Please Select at least 1 Document Group' : ''}</small></span>
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

export default ClientOnboarding;