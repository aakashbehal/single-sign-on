import React, { FormEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Form, Col, Row, Button } from "react-bootstrap"
import { useToasts } from 'react-toast-notifications';

import { userService } from "../../services"
import { MiscActionCreator } from "../../store/actions/common/misc.actions"
import { handleResponse, axiosCustom } from "../../helpers/util"
import { createMessage } from "../../helpers/messages";
import { HiPencil } from "react-icons/hi";
import DocumentUpload from "../../components/modal/DocumentUpload";


const UserAccount = () => {
    const formRef = useRef<any>()
    const dispatch = useDispatch()
    const { addToast } = useToasts();
    const [selectedQuestion1, setSelectedQuestion1] = useState<any>("")
    const [selectedQuestion2, setSelectedQuestion2] = useState<any>("")
    const [selectedState, setSelectedState] = useState<any>("")
    const [secretQuestions, setSecretQuestions] = useState<any>([])
    const [secretQuestions1, setSecretQuestions1] = useState<any>([])
    const [secretQuestions2, setSecretQuestions2] = useState<any>([])
    const [userPreferences, setUserPreferences] = useState<any>(null)
    const [emailConsent, setEmailConsent] = useState<any>(false)
    const [phoneConsent, setPhoneConsent] = useState<any>(false)
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [demoDashboard, setDemoDashboard] = useState<any>(false)

    const {
        states,
        loadingState,
        errorState,
        app,
        loadingApp,
        errorApp,
        recordStatus,
        loadingRecordStatus,
        errorRecordStatus,
        recordSource,
        loadingRecordSource,
        errorRecordSource,
    } = useSelector((state: any) => ({
        states: state.misc.state.data,
        loadingState: state.misc.state.loading,
        errorState: state.misc.state.error,
        app: state.misc.app.data,
        loadingApp: state.misc.app.loading,
        errorApp: state.misc.app.error,
        recordStatus: state.misc.recordStatus.data,
        loadingRecordStatus: state.misc.recordStatus.loading,
        errorRecordStatus: state.misc.recordStatus.error,
        recordSource: state.misc.recordSource.data,
        loadingRecordSource: state.misc.recordSource.loading,
        errorRecordSource: state.misc.recordSource.error,
    }))

    useEffect(() => {
        const user = userService.getUser()
        getSecretQuestions()
        getUserPreference(user.loginKey)
        dispatch(MiscActionCreator.getStates())
        dispatch(MiscActionCreator.getAppId('ECP-WEB'))
        dispatch(MiscActionCreator.getRecordStatus('Enabled'))
        dispatch(MiscActionCreator.getRecordSource('ECP-WB'))
        const demo = localStorage.getItem('isDemo')
        if (demo && demo === 'true') {
            setDemoDashboard(true)
        } else {
            setDemoDashboard(false)
        }
    }, [])

    useEffect(() => {
    }, [userPreferences])

    useEffect(() => {
        const sqFiltered = secretQuestions.filter((sQ: any) => {
            if (sQ.keycode !== selectedQuestion1) {
                return sQ
            }
        })
        setSecretQuestions2(sqFiltered)
    }, [selectedQuestion1])

    useEffect(() => {
        const sqFiltered = secretQuestions.filter((sQ: any) => {
            if (sQ.keycode !== selectedQuestion2) {
                return sQ
            }
        })
        setSecretQuestions1(sqFiltered)
    }, [selectedQuestion2])

    const getUserPreference = async (loginKey: any) => {
        try {

            const response: any = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL_SSO}${process.env.REACT_APP_SSO_USER_SERVICE}/public/user/getUserPreference?loginKey=${loginKey}`)
            const data = handleResponse(response)
            setUserPreferences(data.response)
            setSelectedState(data.response.state)
            setSelectedQuestion1(data.response.secretAnswers[0].question)
            setSelectedQuestion2(data.response.secretAnswers[1].question)
            userService.setImage(data.response.profilePicture)
        } catch (error: any) {
            setSecretQuestions([])
        }
    }

    const getSecretQuestions = async () => {
        try {
            const response: any = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/public/masters/lookup?lookupGroupKeyValue=secret_question`)
            const data = handleResponse(response)
            setSecretQuestions(data.response)
            setSecretQuestions1(data.response)
            setSecretQuestions2(data.response)
        } catch (error: any) {
            setSecretQuestions([])
        }
    }

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault()
        const userData = userService.getUser()
        const {
            communicationEmail,
            contactNumber,
            address1,
            address2,
            city,
            zip,
            answer1,
            answer2
        } = formRef.current
        const stateName = states.filter((s: any) => {
            if (s.stateCode === selectedState) {
                return s
            }
            return false
        })
        const reqBody = {
            "principleId": userData.principleId,
            "loginKey": userData.loginKey,
            "emailAddress": communicationEmail.value,
            "emailConsent": emailConsent,
            "phone": contactNumber.value,
            "phoneConsent": phoneConsent,
            "address1": address1.value,
            "address2": address2.value,
            "city": city.value,
            "state": selectedState,
            "stateName": stateName[0].fullName,
            "zip": zip.value,
            "recordSourceId": recordSource.recordSourceId,
            "appId": app.appId,
            "secretAnswers": [
                {
                    "secretAnswerId": userPreferences.secretAnswers[0].secretAnswerId,
                    "principleId": userData.principleId,
                    "question": "Q1",
                    "answer": answer1.value,
                    "updatedBy": userData.loginKey,
                    "recordSourceId": recordSource.recordSourceId,
                    "appId": app.appId
                },
                {
                    "secretAnswerId": userPreferences.secretAnswers[1].secretAnswerId,
                    "principleId": userData.principleId,
                    "question": "Q3",
                    "answer": answer2.value,
                    "updatedBy": userData.loginKey,
                    "recordSourceId": recordSource.recordSourceId,
                    "appId": app.appId
                }
            ]
        }
        try {
            const response: any = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_SSO}${process.env.REACT_APP_SSO_USER_SERVICE}/public/user/updateUserPreference`, reqBody)
            const data = handleResponse(response)
            addToast(createMessage('success', `updated`, 'User details'), { appearance: 'success', autoDismiss: true })
        } catch (error: any) {
            addToast(createMessage('error', `updating`, 'user details'), { appearance: 'error', autoDismiss: false })
        }
    }

    const toggleDemo = (isChecked: any) => {
        localStorage.setItem('isDemo', isChecked)
        setDemoDashboard(isChecked)
    }


    return <>
        <Row style={{ margin: 0, paddingTop: '2rem' }} className="form_container">
            <Col sm={2}></Col>
            <Col sm={2}>
                {
                    userPreferences
                    &&
                    <div className="profile_picture_container">
                        <div>
                            <img src={userPreferences?.profilePicture} alt="" loading="lazy" />
                            <div onClick={() => setUploadDocModal(true)} className="edit_profile_pic" ><HiPencil /></div>
                            <h5>{`${userPreferences?.firstName} ${userPreferences?.middleName} ${userPreferences?.lastName}`}</h5>
                            <p>{userPreferences.emailAddress}</p>
                        </div>
                    </div>
                }
            </Col>
            <Col sm={6} >
                {
                    userPreferences
                    &&
                    <Form onSubmit={(e) => onSubmitHandler(e)} ref={formRef}>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Email User ID</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            placeholder="Email User ID"
                                            disabled={true}
                                            defaultValue={userPreferences.emailAddress} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Organization Type</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            placeholder="Organization Type"
                                            disabled={true}
                                            defaultValue={userPreferences.recordSource} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        {
                            userPreferences.recordSource !== 'Equabli'
                            && <Row >
                                <Col sm={12}>
                                    <Form.Group as={Row}>
                                        <Form.Label column md={4} sm={12}>{userPreferences.recordSource === 'Partner' ? 'Partner Name' : 'Client Name'}</Form.Label>
                                        <Col sm={8}>
                                            <Form.Control type="text"
                                                placeholder="Client Name"
                                                disabled={true}
                                                defaultValue={userPreferences.recordSource === 'Partner' ? userPreferences.partnerName : userPreferences.clientName} />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Role Type</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            placeholder="Role Type"
                                            disabled={true}
                                            defaultValue={userPreferences.authRoleName} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Name</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            placeholder="Name"
                                            disabled={true}
                                            defaultValue={`${userPreferences.firstName} ${userPreferences.middleName} ${userPreferences.lastName}`} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Communication Email ID</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="communicationEmail"
                                            placeholder="Communication Email ID"
                                            defaultValue={userPreferences.emailAddress} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Communication Email Consent</Form.Label>
                                    <Col sm={8}>
                                        <input
                                            type="checkbox"
                                            className="switch"
                                            onChange={(e) => setEmailConsent((emailConsent: any) => !emailConsent)}
                                            name="emailConsent"
                                            defaultChecked={Boolean(userPreferences.emailConsent)}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row> */}
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Contact Number</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="contactNumber"
                                            placeholder="Contact Number"
                                            defaultValue={userPreferences.phone} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Contact Number Consent</Form.Label>
                                    <Col sm={8}>
                                        <input
                                            type="checkbox"
                                            className="switch"
                                            onChange={(e) => setPhoneConsent((phoneConsent: any) => !phoneConsent)}
                                            name="phoneConsent"
                                            defaultChecked={Boolean(userPreferences.phoneConsent)}
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row> */}
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Address Line 1</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="address1"
                                            placeholder="Address 1"
                                            defaultValue={userPreferences.address1} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Address Line 2</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="address2"
                                            placeholder="Address 2"
                                            defaultValue={userPreferences.address2} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>City</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="city"
                                            placeholder="City"
                                            defaultValue={userPreferences.city} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>State</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="state"
                                            value={selectedState}
                                            onChange={(e) => { setSelectedState(e.target.value) }}
                                        >
                                            <option></option>
                                            {
                                                states && states.map((sQ: any, index: number) => {
                                                    return (
                                                        <option
                                                            key={`secretQuestion_${index}`}
                                                            value={sQ.stateCode}
                                                        >
                                                            {sQ.fullName}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Zip Code</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="zip"
                                            placeholder="Zip Code"
                                            defaultValue={userPreferences.zip} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Secret Question 1 </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="selectedQuestion1"
                                            value={selectedQuestion1}
                                            onChange={(e) => { setSelectedQuestion1(e.target.value) }}
                                        >
                                            <option></option>
                                            {
                                                secretQuestions1 && secretQuestions1.map((sQ: any, index: number) => {
                                                    return (
                                                        <option
                                                            key={`secretQuestion_${index}`}
                                                            value={sQ.keyCode}
                                                        >
                                                            {sQ.keyValue}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Answer 1</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="answer1"
                                            placeholder="Answer 1" />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Secret Question 2</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="selectedQuestion2"
                                            value={selectedQuestion2}
                                            onChange={(e) => { setSelectedQuestion2(e.target.value) }}
                                        >
                                            <option></option>
                                            {
                                                secretQuestions2 && secretQuestions2.map((sQ: any, index: number) => {
                                                    return (
                                                        <option
                                                            key={`secretQuestion_${index}`}
                                                            value={sQ.keyCode}
                                                        >
                                                            {sQ.keyValue}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col sm={12}>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Answer 2</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text"
                                            name="answer2"
                                            placeholder="Answer 2" />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* {
                            window.location.host !== 'stage.equabli.net'
                            && window.location.host !== 'www.equabli.net'
                            && <Row >
                                <Col sm={12}>
                                    <Form.Group as={Row}>
                                        <Form.Label column md={4} sm={12}>Demo</Form.Label>
                                        <Col sm={8}>
                                            <input
                                                type="checkbox"
                                                className="switch"
                                                name="isNoRangeFix"
                                                checked={demoDashboard}
                                                onChange={(e) => toggleDemo(e.target.checked)}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        } */}
                        <Col sm={12}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button variant="dark" style={{ marginRight: '10px' }} type="submit">Submit</Button>
                            </div>
                        </Col>
                    </Form>
                }
            </Col>
            <Col sm={2}></Col>
        </Row>
        {
            uploadDocModal
            && <DocumentUpload
                show={uploadDocModal}
                onHide={() => setUploadDocModal(false)}
                accountId={123}
                Styles={{}}
                parentComponent="profile"
                search={() => getUserPreference(userPreferences.loginKey)} />
        }
    </>
}

export default UserAccount