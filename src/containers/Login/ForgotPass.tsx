import React, { FormEvent, useEffect, useState, useRef } from 'react'
import { Row, Col, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { CgSpinnerAlt } from "react-icons/cg"
import { useToasts } from 'react-toast-notifications';
import { BiShow, BiHide } from 'react-icons/bi'

import { history } from "../../helpers";
import Styles from './Login.module.sass';
import Logo from "../../assets/img/logo.png"
import { encryptPassword, axiosCustom, passwordRegexCheck, handleResponse } from '../../helpers/util';

const ForgotPassword = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const { addToast } = useToasts();
    const setFPasswordRef = useRef<any>();
    const [newPasswordType, setNewPasswordType] = useState('password')
    const [confirmPasswordType, setConfirmPasswordType] = useState('password')
    const [selectedQuestion1, setSelectedQuestion1] = useState<any>("")
    const [selectedQuestion2, setSelectedQuestion2] = useState<any>("")
    const [secretQuestions, setSecretQuestions] = useState<any>([])
    const [secretQuestions1, setSecretQuestions1] = useState<any>([])
    const [secretQuestions2, setSecretQuestions2] = useState<any>([])
    const [orgTypes, setOrgTypes] = useState<any>([])
    const [selectedOrgType, setSelectedOrgType] = useState<any>('')
    const [step, setStep] = useState<any>(1)
    const [error, setError] = useState<any>({
        email: false,
        validEmail: false,
        orgType: false,
        partnerName: false,
        clientName: false,
        password: false,
        rePassword: false,
        noMatch: false,
        isPasswordValid: false
    })

    useEffect(() => {
        getSecretQuestions()
        getOrganizationTypes();
    }, [])

    const getSecretQuestions = async () => {
        try {
            const response: any = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getLookUpListByGroupKeyVal/secret_question`)
            const data = handleResponse(response)
            setSecretQuestions(data.response)
            setSecretQuestions1(data.response)
            setSecretQuestions2(data.response)
        } catch (error: any) {
            setSecretQuestions([])
        }
    }

    const getOrganizationTypes = async () => {
        try {
            const response: any = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getLookUpListByGroupKeyVal/record_source`)
            const data = handleResponse(response)
            setOrgTypes(data.response)
        } catch (error: any) {
            setOrgTypes([])
        }
    }

    const [step1, setStep1] = useState<any>(null)
    const [sq, setSq] = useState<any>(null)
    const getSecurityQuestionBuUser = async (step: number) => {
        const {
            email,
            partnerName,
            clientName
        } = setFPasswordRef.current
        const step1Error: any = {
            email: false,
            validEmail: false,
            orgType: false,
            partnerName: false,
            clientName: false,
        }

        if (!email.value || email.value === '') {
            step1Error.email = true
        } else {
            step1Error.email = false
        }
        if (email.value && !isEmail(email.value)) {
            step1Error.validEmail = true
        } else {
            step1Error.validEmail = false
        }
        if (selectedOrgType === '') {
            step1Error.orgType = true
        } else {
            step1Error.orgType = false
        }

        const reqObj: any = {
            "loginKey": email.value,
            "orgType": selectedOrgType,
        }
        if (selectedOrgType === 'CL') {
            if (!clientName.value || clientName.value === '') {
                step1Error.clientName = true
            } else {
                step1Error.clientName = false
                reqObj.clientName = clientName.value
            }
        } else if (selectedOrgType === 'PT') {
            if (!partnerName.value || partnerName.value === '') {
                step1Error.partnerName = true
            } else {
                step1Error.partnerName = false
                reqObj.partnerName = partnerName.value
            }
        }
        setError((error: any) => {
            return { ...error, ...step1Error }
        })
        for (let key in step1Error) {
            if (step1Error[key]) {
                return
            }
        }
        try {
            const response: any = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMPLIANCE_SEARCH_URL}/getSecurityQuesByUserDetails`, reqObj)
            const data = handleResponse(response)
            setSq(data.response)
            // addToast('Your password was successfully changed!', { appearance: 'success', autoDismiss: true })
            setStep1(reqObj)
            setStep(step)
        } catch (error: any) {
            addToast(error, { appearance: 'error', autoDismiss: false })
        }
    }


    const validateQuestions = async (step: number) => {
        const {
            answer1,
            answer2
        } = setFPasswordRef.current
        const reqObj: any = {
            "secretAnswers": [
                {
                    "secretAnswerId": sq.secretAnswers[0].secretAnswerId,
                    "principleId": sq.secretAnswers[0].principleId,
                    "question": sq.secretAnswers[0].question,
                    "answer": answer1.value
                },
                {
                    "secretAnswerId": sq.secretAnswers[1].secretAnswerId,
                    "principleId": sq.secretAnswers[1].principleId,
                    "question": sq.secretAnswers[1].question,
                    "answer": answer2.value
                }
            ]
        }
        try {
            const response: any = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMPLIANCE_SEARCH_URL}/validateSecurityQuesByUserDetails`, reqObj)
            const data = handleResponse(response)
            addToast("Security Questions verified successfully", { appearance: 'success', autoDismiss: true })
            setStep(step)
        } catch (error: any) {
            addToast("The answer provided to the secret question is incorrect. Please try again. Or to reset your password, select Forgot Password or contact the Equabli administrator at support@equabli.com", { appearance: 'error', autoDismiss: false })
        }
    }

    const handleSubmit = async (e: FormEvent, step: number) => {
        e.preventDefault()
        if (step === 2) {
            getSecurityQuestionBuUser(step)
        } if (step === 3) {
            validateQuestions(step)
        }
    }

    const isEmail = (email: any) => {
        return /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);
    }

    const handleFinalSubmit = async (e: any) => {
        e.preventDefault()
        const {
            password,
            rePassword
        } = setFPasswordRef.current
        const step3Error: any = {
            password: false,
            rePassword: false,
            noMatch: false,
            isPasswordValid: false
        }
        if (!password.value || password.value === '') {
            step3Error.password = true
        } else {
            step3Error.password = false
        }
        if (!rePassword.value || rePassword.value === '') {
            step3Error.rePassword = true
        } else {
            step3Error.rePassword = false
        }
        if (password.value !== rePassword.value) {
            step3Error.noMatch = true
        } else {
            step3Error.noMatch = false
        }
        if (password.value && rePassword.value && !(password.value !== rePassword.value) && !passwordRegexCheck(password.value)) {
            step3Error.isPasswordValid = true
        } else {
            step3Error.isPasswordValid = false
        }
        setError((error: any) => {
            return { ...error, ...step3Error }
        })
        for (let key in step3Error) {
            if (step3Error[key]) {
                return
            }
        }
        const reqObj: any = {
            "loginKey": sq.loginKey,
            "loginSecret": encryptPassword(password.value),
            "orgType": selectedOrgType,
        }
        if (selectedOrgType === 'CL') {
            reqObj.clientName = step1.clientName
        } else {
            reqObj.partnerName = step1.partnerName
        }
        try {
            const response: any = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMPLIANCE_SEARCH_URL}/resetPasswordByUserDetails`, reqObj)
            const data = handleResponse(response)
            addToast("Password reset successfully", { appearance: 'success', autoDismiss: true })
            history.push('/login')
        } catch (error: any) {
            addToast(error, { appearance: 'error', autoDismiss: false })
        }
    }

    const spinner = () => {
        return <CgSpinnerAlt className="spinner" />
    }

    const loading = false


    return (
        <div className={Styles.login}>
            <div className={`${Styles.login_container} ${Styles.password_set}`}>
                <h2>Forgot Password - ({
                    step === 1 ? 'User details' : step === 2 ? 'Security Question' : 'Enter New Password'
                })</h2>
                <div className={`${Styles.inner_login_container} ${Styles.inner_password_set}`}>
                    <br />
                    <Form className={Styles.login_form} ref={setFPasswordRef}>
                        {
                            step === 1
                            && <><Form.Group as={Row} >
                                <Form.Label column md={4} sm={12}>User Email ID</Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter User Email ID"
                                    />
                                    <span className={Styles.form_error}><small>{error["email"] ? 'Email ID is required' : ''}</small></span>
                                    <span className={Styles.form_error}><small>{error["validEmail"] ? 'Please enter a valid email' : ''}</small></span>
                                </Col>
                            </Form.Group>
                                <Form.Group as={Row} >
                                    <Form.Label column md={4} sm={12}>Organization Type </Form.Label>
                                    <Col sm={8}>
                                        <Form.Control
                                            as="select"
                                            name="selectedOrgType"
                                            value={selectedOrgType}
                                            onChange={(e) => { setSelectedOrgType(e.target.value) }}
                                        >
                                            <option></option>
                                            {
                                                orgTypes && orgTypes.map((oT: any, index: number) => {
                                                    return (
                                                        <option
                                                            key={`orgTypes_${index}`}
                                                            value={oT.keycode}
                                                        >
                                                            {oT.keyvalue}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Form.Control>
                                        <span className={Styles.form_error}><small>{error["orgType"] ? 'Organization is required' : ''}</small></span>
                                    </Col>
                                </Form.Group>
                                {
                                    selectedOrgType
                                    && selectedOrgType !== ''
                                    && selectedOrgType === 'PT'
                                    && <Form.Group as={Row} >
                                        <Form.Label column md={4} sm={12}>Partner</Form.Label>
                                        <Col md={8} sm={12}>
                                            <Form.Control
                                                type="text"
                                                name="partnerName"
                                                placeholder="Please enter partner ID"
                                            />
                                            <span className={Styles.form_error}><small>{error["partnerName"] ? 'Partner code is required' : ''}</small></span>
                                        </Col>
                                    </Form.Group>
                                }
                                {
                                    selectedOrgType
                                    && selectedOrgType !== ''
                                    && selectedOrgType === 'CL'
                                    && <><Form.Group as={Row} >
                                        <Form.Label column md={4} sm={12}>Client</Form.Label>
                                        <Col md={8} sm={12}>
                                            <Form.Control
                                                type="text"
                                                name="clientName"
                                                placeholder="Please enter client ID"
                                            />
                                            <span className={Styles.form_error}><small>{error["clientName"] ? 'Client code is required' : ''}</small></span>
                                        </Col>
                                    </Form.Group>
                                    </>
                                }
                                <Form.Group style={{ textAlign: 'center' }} >
                                    <Button style={{ width: '100px' }} variant="primary" type="submit" onClick={(e) => handleSubmit(e, 2)}>
                                        {loading ? spinner() : "Next"}
                                    </Button>
                                    <br />
                                    <br />
                                    <p className={Styles.forgot_password} onClick={
                                        () => {
                                            history.push('/login')
                                        }
                                    }>Go back To login</p>
                                </Form.Group>
                            </>
                        }
                        {
                            step === 2
                            && sq
                            && <>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={4} sm={12} >
                                        Email User ID :
                                    </Form.Label>
                                    <Col sm={8} style={{ padding: '7px 5px' }}><b>&nbsp; &nbsp;{sq.loginKey}</b></Col>
                                </Form.Group>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={4} sm={12} >Organization Type :
                                    </Form.Label>
                                    <Col sm={8} style={{ padding: '7px 5px' }}><b>&nbsp; &nbsp;{
                                        sq.orgType === 'CL' ? 'Client' : sq.orgType === 'PT' ? 'Partner' : 'Equabli'
                                    }</b></Col>
                                </Form.Group>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={4} sm={12} >
                                        {
                                            sq.orgType === 'CL' ? 'Client Name' : sq.orgType === 'PT' ? 'Partner Name' : 'Equabli'
                                        }
                                    </Form.Label>
                                    <Col sm={8} style={{ padding: '7px 5px' }}><b>&nbsp; &nbsp;{
                                        sq.orgType === 'CL' ? sq.clientName : sq.orgType === 'PT' ? sq.partnerName : 'Equabli'
                                    }</b></Col>
                                </Form.Group>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={12} sm={12} style={{ textAlign: 'left' }}>{sq.secretAnswers[0].questionDesc}</Form.Label>
                                    <Col sm={12}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Answer 1"
                                            name="answer1"
                                        />
                                        <span className={Styles.form_error}><small>{error["answer1"] ? 'Answer is Required' : ''}</small></span>

                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={12} sm={12} style={{ textAlign: 'left' }}>{sq.secretAnswers[1].questionDesc}</Form.Label>
                                    <Col sm={12}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Answer 2"
                                            name="answer2"
                                        />
                                        <span className={Styles.form_error}><small>{error["answer2"] ? 'Answer is Required' : ''}</small></span>

                                    </Col>
                                </Form.Group>
                                <Form.Group style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <Button style={{ width: '100px' }} variant="primary" type="submit" onClick={(e) => handleSubmit(e, 3)}>
                                        {loading ? spinner() : "Next"}
                                    </Button>
                                    <br />
                                    <br />
                                    <p className={Styles.forgot_password} onClick={
                                        () => {
                                            history.push('/login')
                                        }
                                    }>Go back To login</p>
                                </Form.Group>
                            </>
                        }
                        {
                            step === 3
                            && <>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={4} sm={12} >
                                        Email User ID :
                                    </Form.Label>
                                    <Col sm={8} style={{ padding: '7px 5px' }}><b>&nbsp; &nbsp;{sq.loginKey}</b></Col>
                                </Form.Group>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={4} sm={12} >Organization Type :
                                    </Form.Label>
                                    <Col sm={8} style={{ padding: '7px 5px' }}><b>&nbsp; &nbsp;{
                                        sq.orgType === 'CL' ? 'Client' : sq.orgType === 'PT' ? 'Partner' : 'Equabli'
                                    }</b></Col>
                                </Form.Group>
                                <Form.Group as={Row} className={Styles.no_margin}>
                                    <Form.Label column md={4} sm={12} >
                                        {
                                            sq.orgType === 'CL' ? 'Client Name' : sq.orgType === 'PT' ? 'Partner Name' : 'Equabli'
                                        }
                                    </Form.Label>
                                    <Col sm={8} style={{ padding: '7px 5px' }}><b>&nbsp; &nbsp;{
                                        sq.orgType === 'CL' ? sq.clientName : sq.orgType === 'PT' ? sq.partnerName : 'Equabli'
                                    }</b></Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Enter Your Password</Form.Label>
                                    <Col sm={8}>
                                        <Col sm={12} style={{ padding: 0, position: 'relative' }}>
                                            <Form.Control
                                                type={newPasswordType}
                                                name="password"
                                                placeholder="Enter Your Password"
                                            />
                                            <div style={{ position: 'absolute', right: '1rem', top: '.7rem' }}>
                                                {newPasswordType === 'password' ? <BiShow size={20} style={{ cursor: 'pointer' }} onClick={() => setNewPasswordType('text')} /> : <BiHide style={{ cursor: 'pointer' }} size={20} onClick={() => setNewPasswordType('password')} />}
                                            </div>
                                        </Col>
                                        <span className={Styles.form_error}><small>{error["password"] ? 'Password is Required' : ''}</small></span>

                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column md={4} sm={12}>Re-enter Your Password </Form.Label>
                                    <Col sm={8}>
                                        <Col sm={12} style={{ padding: 0, position: 'relative' }}>
                                            <Form.Control
                                                type={confirmPasswordType}
                                                name="rePassword"
                                                placeholder="Re-enter Your Password"
                                            />
                                            <div style={{ position: 'absolute', right: '1rem', top: '.7rem' }}>
                                                {confirmPasswordType === 'password' ? <BiShow size={20} style={{ cursor: 'pointer' }} onClick={() => setConfirmPasswordType('text')} /> : <BiHide style={{ cursor: 'pointer' }} size={20} onClick={() => setConfirmPasswordType('password')} />}
                                            </div>
                                        </Col>
                                        {error["rePassword"] && <span className={Styles.form_error}><small>Re-Enter new password is Required</small><br /></span>}
                                        {error["noMatch"] && <span className={Styles.form_error}><small>Passwords do not match</small><br /></span>}
                                        {error["isPasswordValid"] && <span className={Styles.form_error}><small> Password should meet 3 of 4 of the following requirements <br /> - At least 1 upper case letter (A – Z) <br /> - At least 1 lower case letter (a-z),  <br /> - At least 1 digit (0 – 9),  <br /> - At least 1 special Characters (!@#$%&*()) <br /> and should be 14 characters long</small></span>}

                                    </Col>
                                </Form.Group>
                                <Form.Group style={{ textAlign: 'center' }}>
                                    <Button style={{ width: '100px' }} variant="primary" type="submit" onClick={(e) => handleFinalSubmit(e)}>
                                        {loading ? spinner() : "Submit"}
                                    </Button>
                                    <br />
                                    <br />
                                    <p className={Styles.forgot_password} onClick={
                                        () => {
                                            history.push('/login')
                                        }
                                    }>Go back To login</p>
                                </Form.Group>
                            </>
                        }
                    </Form>
                </div>
                <br />
                <img src={Logo} alt="Equabli" width="150px" />
            </div>
        </div >
    )
}

export default ForgotPassword;