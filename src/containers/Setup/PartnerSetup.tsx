import { useState, useEffect, useRef } from "react";
import { Col, Row, Button, Modal, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import TableComponent from "../../components/Table/Table";
import Styles from "./Setup.module.sass";
import { PartnerSetupActionCreator } from "../../store/actions/partnerSetup.actions";
import States from "../../components/Common/States";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import { RootState } from "../../store";

const PartnerSetup = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [sortElement, setSortElement] = useState('modifiedDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showAddEdit, setShowAddEdit] = useState<boolean>(false)
    const [editData, setEditData] = useState<any>(null)
    const {
        partners,
        totalCount,
        error,
        loading,
        addPartnerSuccess,
        addPartnerLoading,
        addPartnerError,
        editPartnerSuccess,
        editPartnerLoading,
        editPartnerError,
        deactivatePartnerSuccess,
        deactivatePartnerLoading,
        deactivatePartnerError,
    } = useSelector((state: any) => ({
        partners: state.partners.data,
        error: state.partners.error,
        loading: state.partners.loading,
        totalCount: state.partners.totalCount,
        addPartnerSuccess: state.partners.addPartnerSuccess,
        addPartnerLoading: state.partners.addPartnerLoading,
        addPartnerError: state.partners.addPartnerError,
        editPartnerSuccess: state.partners.editPartnerSuccess,
        editPartnerLoading: state.partners.editPartnerLoading,
        editPartnerError: state.partners.editPartnerError,
        deactivatePartnerSuccess: state.partners.deactivatePartnerSuccess,
        deactivatePartnerLoading: state.partners.deactivatePartnerLoading,
        deactivatePartnerError: state.partners.deactivatePartnerError,
    }))

    useEffect(() => {
        search(pageSize, pageNumber)
    }, [sortElement, sortType])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        dispatch(PartnerSetupActionCreator.getAllPartners({
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

    const activateHandler = (data: any) => {
        console.log(data)
    }

    useEffect(() => {
        if (addPartnerSuccess) {
            addToast(createMessage('success', `added`, 'Partner'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)

        }
        if (editPartnerSuccess) {
            addToast(createMessage('success', `edited`, 'Partner'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)

        }
        if (deactivatePartnerSuccess) {
            addToast(createMessage('success', `uploaded`, 'Partner'), { appearance: 'success', autoDismiss: true })
            search(pageSize, pageNumber)

        }
        setShowAddEdit(false)
        setEditData(null)
    }, [addPartnerSuccess,
        editPartnerSuccess,
        deactivatePartnerSuccess])

    useEffect(() => {
        if (addPartnerError) {
            addToast(createMessage('error', `adding`, 'Partner'), { appearance: 'error', autoDismiss: false })
        }
        if (editPartnerError) {
            addToast(createMessage('error', `editing`, 'Partner'), { appearance: 'error', autoDismiss: false })
        }
        if (deactivatePartnerError) {
            addToast(createMessage('error', `uploading`, 'Partner'), { appearance: 'error', autoDismiss: false })
        }
    }, [addPartnerError,
        editPartnerError,
        deactivatePartnerError])

    return (
        <>
            <Col sm={12} style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => setShowAddEdit(true)}>Add New Partner</Button>
            </Col>
            <Col>
                <TableComponent
                    data={partners}
                    isLoading={loading}
                    map={{
                        partnerId: "Partner ID",
                        shortCode: "Short Name",
                        fullName: "Full Name",
                        emailAddress: "Email",
                        // quicksiteId: "Quicksite ID",
                        isEqassociate: "Equabli Associated",
                    }}
                    totalCount={totalCount}
                    actionArray={[]}
                    handleNavigate={() => { }}
                    currencyColumns={[]}
                    sortElement={(header: any) => setSortElement(header)}
                    sortType={(type: any) => setSortType(type)}
                    currentPage={pageNumber}
                    setCurrentPage={setPageNumber}
                    parentComponent={'partnerSetup'}
                    searchCriteria={{}}
                    hideShareArray={[
                        "partnerId",
                        "shortCode",
                        "fullName",
                        "emailAddress",
                        // "quicksiteId",
                        "isEqassociate",
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
                && <AddEditPartner
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

const AddEditPartner = ({ onHide, show, data, dispatch }: any) => {
    const clientFormRef = useRef<any>()
    const [serviceType, setServiceType] = useState(data?.servicetypeId || '')
    const [formError, setFormError] = useState<any>({
        shortCode: false,
        fullName: false,
        // quickSiteId: false,
        serviceTypeId: false,
        pocName: false,
        address1: false,
        phone1: false,
        emailAddress: false,
        stateCode: false,
    })

    const {
        recordSource,
        loading,
        error
    } = useSelector((state: any) => ({
        recordSource: state.misc.recordSourceAll.data,
        loading: state.misc.recordSourceAll.loading,
        error: state.misc.recordSourceAll.error
    }))

    useEffect(() => {
        dispatch(MiscActionCreator.getAllRecordSource())
    }, [])


    const validate = (formObj: any) => {
        let checkFormObj: any = {
            shortCode: formObj.shortCode,
            fullName: formObj.fullName,
            // quickSiteId: formObj.quickSiteId,
            serviceTypeId: formObj.servicetypeId,
            pocName: formObj.pocName,
            address1: formObj.address1,
            phone1: formObj.phone1,
            emailAddress: formObj.emailAddress,
            stateCode: formObj.stateCode
        }
        let formIsValid = true;
        const error: any = {
            shortCode: false,
            fullName: false,
            // quickSiteId: false,
            serviceTypeId: false,
            pocName: false,
            address1: false,
            phone1: false,
            emailAddress: false,
            stateCode: false
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
            shortCode,
            fullName,
            pocName,
            emailAddress,
            address1,
            address2,
            city,
            zip,
            phone1,
            state,
            phone2,
            website,
            namePronunciation,
            emailPronunciation,
            phonePronunciation,
            addressPronunciation,
            serviceTypeId,
            // quickSiteId
        } = clientFormRef.current
        let formObject = {
            partnerId: data?.partnerId || null,
            shortCode: shortCode?.value || null,
            fullName: fullName?.value || null,
            pocName: pocName?.value || null,
            emailAddress: emailAddress?.value || null,
            address1: address1?.value || null,
            address2: address2?.value || null,
            city: city?.value || null,
            zip: zip?.value || null,
            stateCode: state?.value || null,
            phone1: phone1?.value || null,
            phone2: phone2?.value || null,
            website: website?.value || null,
            namePronunciation: namePronunciation?.value || null,
            emailPronunciation: emailPronunciation?.value || null,
            phonePronunciation: phonePronunciation?.value || null,
            addressPronunciation: addressPronunciation?.value || null,
            servicetypeId: serviceTypeId?.value || null,
            // quickSiteId: quickSiteId?.value || null
        }
        if (validate(formObject)) {
            if (!data) {
                dispatch(PartnerSetupActionCreator.addPartner(formObject))
            } else {
                dispatch(PartnerSetupActionCreator.editPartner(formObject))
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
                    {!data ? 'Add Partner' : 'Edit Partner'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <br />
                    <Form ref={clientFormRef}>
                        <Row>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="shortCode" defaultValue={data?.shortCode || null} maxLength={5}></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shortCode"] ? 'Short Name is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Short Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="fullName" defaultValue={data?.fullName || null}></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["fullName"] ? 'Full Name is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Full Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="namePronunciation" defaultValue={data?.namePronunciation || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Full Name (IVR)</Form.Label>
                                </Form.Group>
                            </Col>
                            {/* <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="quickSiteId" defaultValue={data?.quickSiteId || null}></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["quickSiteId"] ? 'Partner\'s VPN IP Address is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Partner's VPN IP Address <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col> */}
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control
                                            as="select"
                                            name="serviceTypeId"
                                            value={serviceType}
                                            onChange={(e) => setServiceType(e.target.value)}
                                        >
                                            <option></option>
                                            {
                                                recordSource && recordSource.map((rS: any, index: number) => {
                                                    return (
                                                        <option
                                                            key={`rS_${index}`}
                                                            value={rS.id}
                                                        >
                                                            {rS.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["serviceTypeId"] ? 'Service Type is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">{data?.servicetypeId} Service Type <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="pocName" defaultValue={data?.pocName || null}></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["pocName"] ? 'Point Of Contact is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Point Of Contact <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="address1" defaultValue={data?.address1 || null}></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["address1"] ? 'Address 1 is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white" >Address 1 <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="address2" defaultValue={data?.address2 || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white" >Address 2</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="city" defaultValue={data?.city || null}></Form.Control>
                                    </Col>
                                    <Form.Label className="label_custom white">City</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <States selectedValue={data?.stateCode || ''} />
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["stateCode"] ? 'State is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">State <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="zip" defaultValue={data?.zip || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Zip</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="addressPronunciation" defaultValue={data?.addressPronunciation || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Full Address (IVR)</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="phone1" defaultValue={data?.phone1 || null}></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["phone1"] ? 'Phone1 is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Phone1 <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="phonePronunciation" defaultValue={data?.phonePronunciation || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Phone1 (IVR)</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="phone2" defaultValue={data?.phone2 || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Phone2 </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="phonePronunciation" defaultValue={data?.phonePronunciation || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Phone2 (IVR)</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="website" defaultValue={data?.website || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Website</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="emailAddress" defaultValue={data?.emailAddress || null}></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["emailAddress"] ? 'Email Address is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Email Address <span style={{ color: 'red' }}>*</span></Form.Label>
                                </Form.Group>
                            </Col>

                            <Col lg={6} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="emailPronunciation" defaultValue={data?.emailPronunciation || null}></Form.Control>
                                    </Col>
                                    {/* <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span> */}
                                    <Form.Label className="label_custom white">Email Address (IVR)</Form.Label>
                                </Form.Group>
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

export default PartnerSetup;