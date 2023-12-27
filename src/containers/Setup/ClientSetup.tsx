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

const ClientSetup = () => {
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
        addClientSuccess,
        addClientLoading,
        addClientError,
        editClientSuccess,
        editClientLoading,
        editClientError,
        deactivateClientSuccess,
        deactivateClientLoading,
        deactivateClientError,
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
        addClientSuccess: state.clients.addClientSuccess,
        addClientLoading: state.clients.addClientLoading,
        addClientError: state.clients.addClientError,
        editClientSuccess: state.clients.editClientSuccess,
        editClientLoading: state.clients.editClientLoading,
        editClientError: state.clients.editClientError,
        deactivateClientSuccess: state.clients.deactivateClientSuccess,
        deactivateClientLoading: state.clients.deactivateClientLoading,
        deactivateClientError: state.clients.deactivateClientError,
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

    useEffect(() => {
        if (addClientSuccess) {
            addToast(createMessage('success', `added`, 'Client'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (editClientSuccess) {
            addToast(createMessage('success', `edited`, 'Client'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (deactivateClientSuccess) {
            addToast(createMessage('success', `deactivated`, 'Client'), { appearance: 'success', autoDismiss: true })
            setEditData(null)
            setShowDeleteConfirm(false)
            search(pageSize, pageNumber)
        }
        if (addDomainClientSuccess) {
            addToast(createMessage('success', `added`, 'Client Domain'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        if (addGroupClientSuccess) {
            addToast(createMessage('success', `uploaded`, 'Client Product Type'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        setShowAddEdit(false)
        setEditData(null)
        setAddDomainModal(false)
        setAddGroupModal(false)
    }, [
        addClientSuccess,
        editClientSuccess,
        deactivateClientSuccess,
        addDomainClientSuccess,
        addGroupClientSuccess
    ])

    useEffect(() => {
        if (addClientError) {
            addToast(createMessage('error', `adding`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (editClientError) {
            addToast(createMessage('error', `editing`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (deactivateClientError) {
            addToast(createMessage('error', `Deactivating`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (addDomainClientError) {
            addToast(createMessage('error', `adding`, 'Client Domain'), { appearance: 'error', autoDismiss: false })
        }
        if (addGroupClientError) {
            addToast(createMessage('error', `adding`, 'Client Product Type'), { appearance: 'error', autoDismiss: false })
        }
    }, [addClientError,
        editClientError,
        deactivateClientError,
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

    return (
        <>
            <Col sm={12} style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add New Client</Button>
            </Col>
            <Col>
                <TableComponent
                    data={clients}
                    isLoading={loading}
                    map={{
                        clientId: "Client ID",
                        shortCode: "Short Name",
                        fullName: "Full Name",
                        clientType: "Client Type",
                        emailAddress: "Email",
                        quicksiteId: "Quicksite ID",
                        isMasterserviced: "Master Serviced",
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
                        "clientId",
                        "shortCode",
                        "fullName",
                        "clientType",
                        "emailAddress",
                        "quicksiteId",
                        "isMasterserviced"
                    ]}
                    addEditArray={{
                        editClient: (data: any) => {
                            setShowAddEdit(true)
                            setEditData(data)
                        },
                        delete: (data: any) => {
                            setEditData(data)
                            setShowDeleteConfirm(true)
                        }
                        // addDomainHandler: (client: any) => {
                        //     addDomainHandler(client)
                        // },
                        // addGroupHandler: (client: any) => {
                        //     addGroupHandler(client)
                        // }
                    }}
                    onPaginationChange={(
                        pageSize: number, pageNumber: number
                    ) => handlePagination(pageSize, pageNumber)}></TableComponent >
            </Col>
            {
                showDeleteConfirm
                && <DeleteConfirm
                    show={showDeleteConfirm}
                    onHide={() => setShowDeleteConfirm(false)}
                    confirmDelete={() => deactivateHandler()}
                    details={editData}
                    type='clients'
                />
            }
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

const AddEditClient = ({ onHide, show, data, dispatch }: any) => {
    const clientFormRef = useRef<any>()
    const [formError, setFormError] = useState<any>({
        shortCode: false,
        fullName: false,
        clientType: false,
        pocName: false,
        address1: false,
        phone1: false,
        phone1NumberAlphabets: false,
        phone2NumberAlphabets: false,
        phone1NumberMin: false,
        phone2NumberMin: false
    })

    const validate = (formObj: any) => {
        let checkFormObj: any = {
            shortCode: formObj.shortCode,
            fullName: formObj.fullName,
            clientType: formObj.clientType,
            pocName: formObj.pocName,
            address1: formObj.address1,
            phone1: formObj.phone1,
        }
        let formIsValid = true;
        const error: any = {
            shortCode: false,
            fullName: false,
            clientType: false,
            pocName: false,
            address1: false,
            phone1: false,
            phone1NumberAlphabets: false,
            phone2NumberAlphabets: false,
            phone1NumberMin: false,
            phone2NumberMin: false
        }
        for (let key in checkFormObj) {
            if (!checkFormObj[key] || checkFormObj[key] === "") {
                error[key] = true
            }
            if (formObj['phone1'] && /^\d+$/.test(formObj['phone1']) === false) {
                error['phone1NumberAlphabets'] = true
            }
            if (formObj['phone2'] && /^\d+$/.test(formObj['phone2']) === false) {
                error['phone2NumberAlphabets'] = true
            }
            if (formObj['phone1'] && formObj['phone1'].length <= 9) {
                error['phone1NumberMin'] = true
            }
            if (formObj['phone2'] && formObj['phone2'].length <= 9) {
                error['phone2NumberMin'] = true
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
            shortCode,
            fullName,
            clientType,
            pocName,
            quickSiteId,
            isMasterserviced,
            emailAddress,
            address1,
            address2,
            city,
            state,
            zip,
            phone1,
            phone2,
            website
        } = clientFormRef.current
        let formObject = {
            clientId: data?.clientId || null,
            shortCode: shortCode?.value || null,
            fullName: fullName?.value || null,
            clientType: clientType?.value || null,
            pocName: pocName?.value || null,
            quickSiteId: quickSiteId?.value || null,
            isMasterserviced: isMasterserviced?.checked || false,
            emailAddress: emailAddress?.value || null,
            address1: address1?.value || null,
            address2: address2?.value || null,
            city: city?.value || null,
            stateCode: state?.value || null,
            zip: zip?.value || null,
            phone1: phone1?.value || null,
            phone2: phone2?.value || null,
            website: website?.value || null
        }
        if (validate(formObject)) {
            if (!data) {
                dispatch(ClientSetupActionCreator.addClient(formObject))
            } else {
                dispatch(ClientSetupActionCreator.editClient(formObject))
            }
        }
    }

    return (
        <Modal
            onHide={onHide}
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {!data ? 'Add Client' : 'Edit Client'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Form ref={clientFormRef}>
                        <Row>
                            <Col xs={12} md={6} className="mt-3">
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="shortCode" defaultValue={data?.shortCode || null} maxLength={5}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shortCode"] ? 'Short Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Short Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="fullName" defaultValue={data?.fullName || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["fullName"] ? 'Full Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Full Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="clientType" defaultValue={data?.clientType || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["clientType"] ? 'Client Type is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Client Type <span style={{ color: 'red' }}>*</span></Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="pocName" defaultValue={data?.pocName || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["pocName"] ? 'Point Of Contact is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Point Of Contact <span style={{ color: 'red' }}>*</span></Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="quickSiteId" defaultValue={data?.quickSiteId || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">QuickSight ID</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12} className="mt-1">
                                            <input
                                                type="checkbox"
                                                className="switch mt-2"
                                                name="isMasterserviced"
                                                defaultChecked={data?.isMasterserviced}
                                            />
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">Master Serviced</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="emailAddress" defaultValue={data?.emailAddress || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">Email Address</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Col>
                            <Col xs={12} md={6} className="mt-3" >
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="address1" defaultValue={data?.address1 || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["address1"] ? 'Address 1 is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white" >Address 1 <span style={{ color: 'red' }}>*</span></Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="address2" defaultValue={data?.address2 || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white" >Address 2</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="city" defaultValue={data?.city || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">City</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <States />
                                        </Col>
                                        <Form.Label className="label_custom white">State</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="zip" defaultValue={data?.zip || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">ZIP Code</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="phone1" maxLength={10} defaultValue={data?.phone1 || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["phone1"] ? 'Primary Phone is required ' : ''}</small></span>
                                        <span style={{ color: 'red' }}><small>{formError["phone1NumberAlphabets"] ? 'Primary Phone should not contain Alphabets' : ''}</small></span>
                                        <span style={{ color: 'red' }}><small>{formError["phone1NumberMin"] ? 'Primary Phone cannot be less than 10 digits' : ''}</small></span>
                                        <Form.Label className="label_custom white">Primary Phone <span style={{ color: 'red' }}>*</span></Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="phone2" maxLength={10} defaultValue={data?.phone2 || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["phone2NumberAlphabets"] ? 'Secondary Phone should not contain Alphabets ' : ''}</small></span>
                                        <span style={{ color: 'red' }}><small>{formError["phone2NumberMin"] ? 'Secondary Phone cannot be less than 10 digits ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Secondary Phone</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="website" defaultValue={data?.website || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">Website</Form.Label>
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
                                        <Form.Label className="label_custom white">Product Type</Form.Label>
                                        <span style={{ color: 'red' }}><small>{documentGroupError ? 'Please Select at least 1 Product Type' : ''}</small></span>
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

export default ClientSetup;