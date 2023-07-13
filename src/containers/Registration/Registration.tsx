import React, {
    createRef,
    useEffect,
    useRef,
    useState
} from "react";
import { VscTypeHierarchySub } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux";
import { Form, Col, Row, Button } from "react-bootstrap"
import { useToasts } from 'react-toast-notifications';
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi"
import { CgSpinnerAlt } from "react-icons/cg"
import { AiFillWarning } from "react-icons/ai"
import StepProgressBar from 'react-step-progress';
import 'react-step-progress/dist/index.css';
import { useHistory } from "react-router-dom";

import Styles from './Registration.module.sass';
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import { RegistrationActionCreator } from "../../store/actions/registration.actions";
import { registrationService } from "../../services";
import { TiTick } from "react-icons/ti";

let isValidOrg = false
let orgId: any = null

const Registration = () => {
    const { addToast } = useToasts();
    const dispatch = useDispatch()
    const step1Ref = createRef<any>()
    const step2Ref = useRef<any>()
    const step4Ref = useRef<any>();
    const history = useHistory();
    const [formData, setFormData] = useState<any>({
        firstName: null,
        middleName: null,
        lastName: null,
        emailAddress: null,
        phone: null,
        address1: null,
        address2: null,
        address3: null,
        city: null,
        orgType: null,
        stateCode: '',
        country: null,
        zip: null,
    })
    const isLoading = useSelector((isLoading: any) => isLoading.auth.loading)
    const errorLogin = useSelector((error: any) => error.auth.error)
    const {
        loadingRegistration,
        errorRegistration,
        successRegistration,
        loadingOrgName,
        errorOrgName,
        successOrgName } = useSelector((state: any) => ({
            loadingRegistration: state.registration.loadingRegistration,
            errorRegistration: state.registration.errorRegistration,
            successRegistration: state.registration.successRegistration,
            loadingOrgName: state.registration.loadingOrgName,
            errorOrgName: state.registration.errorOrgName,
            successOrgName: state.registration.successOrgName
        }))


    useEffect(() => {
        const userD: any = localStorage.getItem('registerUser')
        if (userD) {
            let _formData = formData
            let newData = {
                firstName: JSON.parse(userD)[0].consumer.firstName,
                middleName: JSON.parse(userD)[0].consumer.middleName,
                lastName: JSON.parse(userD)[0].consumer.lastName,
                emailAddress: JSON.parse(userD)[0].email.email,
                phone: JSON.parse(userD)[0].phone.phone,
                orgType: JSON.parse(userD)[0].phone.orgType,
                clientId: JSON.parse(userD)[0].account.clientId,
                partnerId: JSON.parse(userD)[0].account.partnerId,
            }
            setFormData({ ..._formData, ...newData })
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('registerStep', JSON.stringify(formData))
    }, [formData])

    useEffect(() => {
        if (successRegistration) {
            addToast('Successfully registered, Please wait while we process your registrations. Thank you for your patience', { appearance: 'success', autoDismiss: true })
            history.push({
                pathname: '/login'
            });
        }
    }, [successRegistration])

    useEffect(() => {
        if (errorRegistration) {
            addToast(errorRegistration, { appearance: 'error', autoDismiss: false })
        }
    }, [errorRegistration])

    function step4Validator() {
        const {
            connectionType,
            orgName
        } = step4Ref.current
        let resultFlag = true

        if (!isValidOrg) {
            resultFlag = false
        }
        if (connectionType.value === '') {
            resultFlag = false
        }
        if ((connectionType.value === 'CL' || connectionType.value === 'PT') && orgName.value === '') {
            resultFlag = false
        } else {
            const formD: any = localStorage.getItem('registerStep')
            let _formData = JSON.parse(formD)
            let dataToSet: any = {
                ..._formData, ...{
                    orgType: connectionType.value
                }
            }
            if (connectionType.value === 'CL') {
                dataToSet.clientId = orgId
            }
            if (connectionType.value === 'PT') {
                dataToSet.partnerId = orgId
            } else {
                delete dataToSet.orgName
            }
            setFormData(dataToSet)
        }
        return resultFlag
    }

    const validateEmail = (email: any) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePhone = (phone: any) => {
        return String(phone)
            .toLowerCase()
            .match(
                /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
            );
    }

    function step1Validator() {
        const {
            firstName,
            middleName,
            lastName,
            emailAddress,
            phone
        } = step1Ref.current
        if (firstName.value && lastName.value && emailAddress.value && phone.value) {
            if (!validateEmail(emailAddress.value)) {
                addToast('Please enter a valid email', { appearance: 'error', autoDismiss: false })
                return false
            }
            if (!validatePhone(phone.value)) {
                addToast('Please enter a valid phone', { appearance: 'error', autoDismiss: false })
                return false
            }
            const formDataStep1 = {
                firstName: firstName.value,
                middleName: middleName.value,
                lastName: lastName.value,
                emailAddress: emailAddress.value,
                phone: phone.value
            }
            const formD: any = localStorage.getItem('registerStep')
            let _formData = JSON.parse(formD)
            let dataToSet = { ..._formData, ...formDataStep1 }
            setFormData(dataToSet)
            return true
        } else {
            return false
        }
    }

    function onFormSubmit() {
        try {
            const { address1,
                address2,
                address3,
                city,
                stateCode,
                country,
                zip } = step2Ref.current
            if (
                address1.value
                && stateCode.value
                && city.value
                && country.value
                && zip.value
            ) {
                const formDataStep2 = {
                    address1: address1.value,
                    address2: address2.value,
                    address3: address3.value,
                    city: city.value,
                    stateCode: stateCode.value,
                    country: country.value,
                    zip: zip.value
                }
                const formD: any = localStorage.getItem('registerStep')
                let _formData = JSON.parse(formD)
                setFormData({ ..._formData, ...formDataStep2 })
                dispatch(RegistrationActionCreator.registration({ ..._formData, ...formDataStep2 }))
                return true
            } else {
                addToast('Please enter all details', { appearance: 'error', autoDismiss: false })
                return false
            }
        } catch (error: any) {
            addToast(error, { appearance: 'error', autoDismiss: false })
            return false
        }

    }

    useEffect(() => {
        if (errorLogin) {
            // addToast('Unauthorized', {
            //     appearance: 'error',
            //     autoDismiss: false,
            //     autoDismissTimeout: 2000,
            //     onDismiss: () => {
            //         dispatch(LoginActionCreator.logout())
            //     }
            // });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, errorLogin])

    const [startingStep, setStartingStep] = useState<any>(0)

    return (
        <div className={Styles.login}>
            <div className={Styles.login_container}>
                <Col sm={12} md={12}>
                    <div>


                        <Row className={Styles.checking}>
                            <Col sm={3} md={3} className={`${Styles.loginScreenLeft} pulls-left`} >
                                {/* <p>Already have an account? Please login</p> */}
                                {/* <Button onClick={() => loadSignUp(1)}>
                    Sign In
                </Button> */}
                            </Col>
                            <Col sm={9} md={9}>
                                <div className={Styles.inner_login_container}>
                                    <h2>Create Account</h2>
                                    <StepProgressBar
                                        startingStep={startingStep}
                                        onSubmit={onFormSubmit}
                                        stepClass={Styles.progress_bar}
                                        contentClass={Styles.progress_bar_container}
                                        primaryBtnClass={Styles.next_button}
                                        steps={[
                                            {
                                                label: "Account Type",
                                                name: "Account Type",
                                                content: <Step4Content ref={step4Ref} />,
                                                validator: step4Validator
                                            },
                                            {
                                                label: 'Personal Details',
                                                name: 'Personal Details',
                                                content: <Step1Content ref={step1Ref} />,
                                                validator: step1Validator
                                            },
                                            {
                                                label: 'Address',
                                                name: 'Address',
                                                content: <Step2Content ref={step2Ref} />,
                                                // validator: step2Validator
                                            }
                                        ]}
                                    />
                                    <br />

                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </div>
        </div>
    )
}

const Step4Content = React.forwardRef((
    props: any,
    ref: any,
) => {
    const { addToast } = useToasts();
    const [formDataStep4, setFormDataStep4] = useState<any>({})
    const [connectionType, setConnectionType] = useState<any>('')
    const [orgName, setOrgName] = useState<any>('');
    const [showCheck, showNotCheck] = useState(true);
    const [isValidOrgName, setIsValidOrgName] = useState<any>(null)
    const [validating, setValidating] = useState<any>(false)
    useEffect(() => {
        setTimeout(() => {
            const formD: any = localStorage.getItem('registerStep')
            if (formD) {
                const _formD = JSON.parse(formD)
                setFormDataStep4(_formD)
                setConnectionType(_formD.orgType)
                setOrgName(_formD.orgName)
            }
        }, 0)
    }, [])

    const validateOrgName = async () => {
        if (showCheck) {
            const {
                orgName
            } = ref.current
            //validate orgType and orgName
            if (connectionType !== "EQ") {
                if (orgName?.value) {
                    setIsValidOrgName(null)
                    setValidating(true);
                    try {
                        const result = await registrationService.validateOrgName(orgName.value, connectionType)
                        orgId = result.response
                        showNotCheck(false)
                        if (result.validation) {
                            isValidOrg = true
                        }
                    } catch (err: any) {
                        isValidOrg = false
                        showNotCheck(false)
                        addToast(err, { appearance: 'error', autoDismiss: false })
                    }
                    setIsValidOrgName(isValidOrg)
                    setValidating(false)
                }
            } else {
                isValidOrg = true
            }
        }
    }

    return (<Form className={Styles.login_form} ref={ref} onMouseLeave={() => validateOrgName()}>
        <Form.Group controlId="formBasicUsername" className={Styles.input_group}>
            <VscTypeHierarchySub className={Styles.input_icon} />
            <Form.Control
                as="select"
                name="connectionType"
                style={{
                    paddingLeft: '1.8rem',
                    height: '44px'
                }}
                value={connectionType}
                onChange={(e) => {
                    setOrgName('')
                    setConnectionType(e.target.value)
                }}
            >
                <option value="" disabled>Select Connection Type</option>
                <option value="CL">Client</option>
                <option value="PT">Partner</option>
                <option value="EQ">Equabli </option>
                {/* <option value="" value={}>Select Connection Type</option> */}
            </Form.Control>
        </Form.Group>
        {
            connectionType
            && (connectionType === 'CL'
                || connectionType === 'PT')
            && < Form.Group controlId="formBasicUsername" className={Styles.input_group}>
                <HiOutlineMail className={Styles.input_icon} />
                <Form.Control
                    type="text"
                    placeholder="Organization name"
                    name="orgName"
                    onKeyDown={() => showNotCheck(true)}
                    defaultValue={orgName}
                // className={errors['mName'] ? Styles.error : ''}
                />
                {!validating && isValidOrgName && <TiTick size={20} className={Styles.indicator} style={{ color: '#05de05' }} />}
                {!validating && isValidOrgName === false && <AiFillWarning size={20} className={Styles.indicator} style={{ color: 'red' }} />}
                {validating && <CgSpinnerAlt size={20} className={`spinner ${Styles.indicator}`} />}
            </Form.Group>
        }
        < div style={{
            justifyContent: 'center',
            display: 'flex'
        }}>
        </div >
    </Form >)
})

const Step1Content = React.forwardRef((props: any, ref: any) => {
    const [formDataStep1, setFormDataStep1] = useState<any>({})
    useEffect(() => {
        setTimeout(() => {
            const formD: any = localStorage.getItem('registerStep')
            if (formD) {
                setFormDataStep1(JSON.parse(formD))
            }
        }, 0)
    }, [])

    return (<Form className={Styles.login_form} ref={ref}>
        <Row>
            <Col sm={4}>
                <Form.Group controlId="formBasicUsername" className={Styles.input_group}>
                    <HiOutlineMail className={Styles.input_icon} />
                    <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        defaultValue={JSON.stringify(formDataStep1) !== "{}" ? formDataStep1.firstName : null}
                    // className={errors['fName'] ? Styles.error : ''}
                    />
                </Form.Group>
            </Col>
            <Col sm={4}>
                <Form.Group controlId="formBasicUsername" className={Styles.input_group}>
                    <HiOutlineMail className={Styles.input_icon} />
                    <Form.Control
                        type="text"
                        placeholder="Middle Name"
                        name="middleName"
                        defaultValue={JSON.stringify(formDataStep1) !== "{}" ? formDataStep1.middleName : null}
                    // className={errors['mName'] ? Styles.error : ''}
                    />
                </Form.Group>
            </Col>
            <Col sm={4}>
                <Form.Group controlId="formBasicUsername" className={Styles.input_group}>
                    <HiOutlineMail className={Styles.input_icon} />
                    <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        defaultValue={JSON.stringify(formDataStep1) !== "{}" ? formDataStep1.lastName : null}
                    // className={errors['lName'] ? Styles.error : ''}
                    />
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col sm={6}>
                <Form.Group controlId="formBasicUsername" className={Styles.input_group}>
                    <HiOutlineMail className={Styles.input_icon} />
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        defaultValue={JSON.stringify(formDataStep1) !== "{}" ? formDataStep1.emailAddress : null}
                        name="emailAddress"
                    // className={errors['email'] ? Styles.error : ''}
                    />
                </Form.Group>

            </Col>
            <Col sm={6}>
                <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                    <HiOutlineLockClosed className={Styles.input_icon} />
                    <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        defaultValue={JSON.stringify(formDataStep1) !== "{}" ? formDataStep1.phone : null}
                    // className={errors['password'] ? Styles.error : ''}
                    />
                </Form.Group>
            </Col>
        </Row>
    </Form>
    )
});

const Step2Content = React.forwardRef((props: any, ref: any) => {
    const [formDataStep2, setFormDataStep2] = useState<any>({})
    const dispatch = useDispatch()

    useEffect(() => {
        setTimeout(() => {
            const formD: any = localStorage.getItem('registerStep')
            if (formD) {
                const _formD = JSON.parse(formD)
                setFormDataStep2(_formD)
                setValue(_formD.stateCode)
            }
        }, 0)
        dispatch(MiscActionCreator.getStates())
    }, [])

    const [value, setValue] = useState<any>('')

    const { states, error, loading }: any = useSelector((state: any) => ({
        states: state.misc.state.data,
        error: state.misc.state.error,
        loading: state.misc.state.loading
    }))

    return (
        <Form className={Styles.login_form} ref={ref}>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                        <HiOutlineLockClosed className={Styles.input_icon} />
                        <Form.Control
                            type="text"
                            name="address1"
                            placeholder="Address 1"
                            defaultValue={JSON.stringify(formDataStep2) !== "{}" ? formDataStep2.address1 : null}
                        // className={errors['address1'] ? Styles.error : ''}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                        <HiOutlineLockClosed className={Styles.input_icon} />
                        <Form.Control
                            type="text"
                            name="address2"
                            placeholder="Address 2"
                            defaultValue={JSON.stringify(formDataStep2) !== "{}" ? formDataStep2.address2 : null}
                        // className={errors['address2'] ? Styles.error : ''}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                        <HiOutlineLockClosed className={Styles.input_icon} />
                        <Form.Control
                            type="text"
                            name="address3"
                            placeholder="Address 3"
                            defaultValue={JSON.stringify(formDataStep2) !== "{}" ? formDataStep2.address3 : null}
                        // className={errors['address3'] ? Styles.error : ''}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                        <HiOutlineLockClosed className={Styles.input_icon} />
                        <Form.Control
                            type="text"
                            name="city"
                            placeholder="City"
                            defaultValue={JSON.stringify(formDataStep2) !== "{}" ? formDataStep2.city : null}
                        // className={errors['address3'] ? Styles.error : ''}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                        <HiOutlineLockClosed className={Styles.input_icon} />
                        <Form.Control
                            as="select"
                            name="stateCode"
                            style={{
                                paddingLeft: '1.8rem',
                                height: '44px'
                            }}
                            value={value}
                            onChange={(e) => { setValue(e.target.value) }}
                        >
                            <option value="" disabled >States</option>
                            {
                                states && states.map((state: any, index: number) => {
                                    return (
                                        <option
                                            key={`state_${index}`}
                                            value={state.stateCode}
                                        >
                                            {state.stateCode} - {state.fullName}
                                        </option>
                                    )
                                })
                            }
                        </Form.Control>
                    </Form.Group>

                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                        <HiOutlineLockClosed className={Styles.input_icon} />
                        <Form.Control
                            type="text"
                            name="country"
                            placeholder="Country"
                            defaultValue={JSON.stringify(formDataStep2) !== "{}" ? formDataStep2.country : null}
                        // className={errors['state'] ? Styles.error : ''}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <Form.Group controlId="formBasicPassword" className={Styles.input_group}>
                        <HiOutlineLockClosed className={Styles.input_icon} />
                        <Form.Control
                            type="text"
                            name="zip"
                            placeholder="Zip"
                            defaultValue={JSON.stringify(formDataStep2) !== "{}" ? formDataStep2.zip : null}
                        // className={errors['state'] ? Styles.error : ''}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    )
});

export default Registration
