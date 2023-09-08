import { useState, useEffect, useRef } from "react";
import { Col, Row, Button, Modal, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import TableComponent from "../../components/Table/Table";
import Styles from "./Setup.module.sass";
import { ClientSetupActionCreator } from "../../store/actions/clientSetup.actions";
import States from "../../components/Common/States";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";

const ClientSetup = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [sortElement, setSortElement] = useState('modifiedDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showAddEdit, setShowAddEdit] = useState<boolean>(false)
    const [editData, setEditData] = useState<any>(null)
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
            addToast(createMessage('success', `uploaded`, 'Client'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)
        }
        setShowAddEdit(false)
        setEditData(null)
    }, [addClientSuccess,
        editClientSuccess,
        deactivateClientSuccess])

    useEffect(() => {
        if (addClientError) {
            addToast(createMessage('error', `adding`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (editClientError) {
            addToast(createMessage('error', `editing`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
        if (deactivateClientError) {
            addToast(createMessage('error', `uploading`, 'Client'), { appearance: 'error', autoDismiss: false })
        }
    }, [addClientError,
        editClientError,
        deactivateClientError])

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
                        shortName: "Short Name",
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
                        "shortName",
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
        </>
    )
}

const AddEditClient = ({ onHide, show, data, dispatch }: any) => {
    const clientFormRef = useRef<any>()
    const [formError, setFormError] = useState<any>({
        shortName: false,
        fullName: false,
        clientType: false
    })

    const validate = (formObj: any) => {
        let checkFormObj: any = {
            shortName: formObj.shortName,
            fullName: formObj.fullName,
            clientType: formObj.clientType,
        }
        let formIsValid = true;
        const error: any = {
            shortName: false,
            fullName: false,
            clientType: false
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
            shortName,
            fullName,
            clientType,
            pocName,
            quickSiteId,
            isMasterserviced,
            emailAddress,
            address1,
            address2,
            city,
            zip,
            phone1,
            phone2,
            website
        } = clientFormRef.current
        let formObject = {
            clientId: data?.clientId || null,
            shortName: shortName?.value || null,
            fullName: fullName?.value || null,
            clientType: clientType?.value || null,
            pocName: pocName?.value || null,
            quickSiteId: quickSiteId?.value || null,
            isMasterserviced: isMasterserviced?.checked || false,
            emailAddress: emailAddress?.value || null,
            address1: address1?.value || null,
            address2: address2?.value || null,
            city: city?.value || null,
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
                                            <Form.Control type="text" name="shortName" defaultValue={data?.shortName || null} maxLength={5}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shortName"] ? 'Short Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Short Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="fullName" defaultValue={data?.fullName || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["fullName"] ? 'Full Name is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Full Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="clientType" defaultValue={data?.clientType || null}></Form.Control>
                                        </Col>
                                        <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["clientType"] ? 'Client Type is required ' : ''}</small></span>
                                        <Form.Label className="label_custom white">Client Type</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="pocName" defaultValue={data?.pocName || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">Point Of Contact</Form.Label>
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
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="address1" defaultValue={data?.address1 || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white" >Address 1</Form.Label>
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
                                {/* <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <States />
                                        </Col>
                                        <Form.Label className="label_custom white">City</Form.Label>
                                    </Form.Group>
                                </Col> */}
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
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="phone1" defaultValue={data?.phone1 || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">Primary Phone</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control type="text" name="phone2" defaultValue={data?.phone2 || null}></Form.Control>
                                        </Col>
                                        {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                        <Form.Label className="label_custom white">Secondary Phone</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={6} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
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

export default ClientSetup;