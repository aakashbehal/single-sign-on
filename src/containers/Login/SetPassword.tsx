import React, { FormEvent, useEffect, useState, useRef } from 'react'
import { Col, Row } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from "react-bootstrap"
import { CgSpinnerAlt } from "react-icons/cg";
import { BiShow, BiHide } from 'react-icons/bi'
import { useToasts } from 'react-toast-notifications';

import Styles from './Login.module.sass';
import Logo from "../../assets/img/logo.png"
import { encryptPassword, axiosCustom, passwordRegexCheck, handleResponse } from '../../helpers/util';
import { MiscActionCreator } from '../../store/actions/common/misc.actions';
import { createMessage } from '../../helpers/messages';

const SetPassword = ({ location }: any) => {
    const { addToast } = useToasts();
    const dispatch = useDispatch()
    const history = useHistory();
    const setPasswordRef = useRef<any>()
    const [newPasswordType, setNewPasswordType] = useState('password')
    const [confirmPasswordType, setConfirmPasswordType] = useState('password')
    const [selectedQuestion1, setSelectedQuestion1] = useState<any>("")
    const [selectedQuestion2, setSelectedQuestion2] = useState<any>("")
    const [secretQuestions, setSecretQuestions] = useState<any>([])
    const [secretQuestions1, setSecretQuestions1] = useState<any>([])
    const [secretQuestions2, setSecretQuestions2] = useState<any>([])

    useEffect(() => {
        getSecretQuestions()
    }, [])

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

    const spinner = () => {
        return <CgSpinnerAlt className="spinner" />
    }

    const {
        app,
        loadingApp,
        errorApp,
        recordSource,
        loadingRecordSource,
        errorRecordSource,
        recordStatus,
        loadingRecordStatus,
        errorRecordStatus,
    }: any = useSelector((state: any) => ({
        app: state.misc.app.data,
        loadingApp: state.misc.app.loading,
        errorApp: state.misc.app.error,
        recordSource: state.misc.recordSource.data,
        loadingRecordSource: state.misc.recordSource.loading,
        errorRecordSource: state.misc.recordSource.error,
        recordStatus: state.misc.recordStatus.data,
        loadingRecordStatus: state.misc.recordStatus.loading,
        errorRecordStatus: state.misc.recordStatus.error,
    }))

    useEffect(() => {
        dispatch(MiscActionCreator.getAppId('ECP-WEB'))
        dispatch(MiscActionCreator.getRecordStatus('Enabled'))
        dispatch(MiscActionCreator.getRecordSource('ECP-WB'))
    }, [])

    const [error, setError] = useState<any>({
        password: false,
        rePassword: false,
        answer1: false,
        answer2: false,
        question1: false,
        question2: false,
        noMatch: false,
        isPasswordValid: false
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const {
            password,
            rePassword,
            answer1,
            answer2
        } = setPasswordRef.current
        // match password
        let formError: any = {
            password: false,
            rePassword: false,
            answer1: false,
            answer2: false,
            question1: false,
            question2: false,
            noMatch: false,
            isPasswordValid: false
        }
        if (!password.value || password.value === '') {
            formError.password = true
        } else {
            formError.password = false
        }
        if (!rePassword.value || rePassword.value === '') {
            formError.rePassword = true
        } else {
            formError.rePassword = false
        }
        if (password.value !== rePassword.value) {
            formError.noMatch = true
        } else {
            formError.noMatch = false
        }
        if (password.value && rePassword.value && !(password.value !== rePassword.value) && !passwordRegexCheck(password.value)) {
            formError.isPasswordValid = true
        } else {
            formError.isPasswordValid = false
        }
        if (!answer1.value || answer1.value === '') {
            formError.answer1 = true
        } else {
            formError.answer1 = false
        }
        if (!answer2.value || answer2.value === '') {
            formError.answer2 = true
        } else {
            formError.answer2 = false
        }
        if (selectedQuestion1 === '') {
            formError.question1 = true
        } else {
            formError.question1 = false
        }
        if (selectedQuestion2 === '') {
            formError.question2 = true
        } else {
            formError.question2 = false
        }
        setError(formError)
        for (let key in formError) {
            if (formError[key]) {
                return
            }
        }

        const params = new URLSearchParams(location.search);
        const pId = params.get('pId')
        const loginKey = params.get('loginKey')

        const requestObj = {
            "principleId": pId,
            "loginKey": loginKey,
            "loginSecret": encryptPassword(password.value),
            "secretAnswers":
                [
                    {
                        "principleId": pId,
                        "question": selectedQuestion1,
                        "answer": answer1.value,
                        "createdBy": loginKey,
                        "updatedBy": loginKey,
                        "recordStatusId": recordStatus[0].id,
                        "recordSourceId": recordSource.recordSourceId,
                        "appId": app.appId
                    },
                    {
                        "principleId": pId,
                        "question": selectedQuestion2,
                        "answer": answer2.value,
                        "createdBy": loginKey,
                        "updatedBy": loginKey,
                        "recordStatusId": recordStatus[0].id,
                        "recordSourceId": recordSource.recordSourceId,
                        "appId": app.appId
                    }
                ]
        }
        try {
            const response: any = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_SSO}${process.env.REACT_APP_SSO_USER_SERVICE}/public/user/setPasswordAndSecurityQues`, requestObj)
            const data = handleResponse(response)
            addToast(createMessage('success', `set`, `Password`), { appearance: 'success', autoDismiss: true })
            history.push({
                pathname: `/login`
            })
        } catch (err: any) {
            addToast(err.message, { appearance: 'error', autoDismiss: false })
        }

    }

    const loading = false

    return (
        <div className={Styles.login}>
            <div className={`${Styles.login_container} ${Styles.password_set}`}>
                <h2>Security Setup</h2>
                <div className={`${Styles.inner_login_container} ${Styles.inner_password_set}`}>
                    <br />
                    <Form className={Styles.login_form} ref={setPasswordRef}>
                        <Form.Group as={Row} className={Styles.no_margin}>
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
                                {error["password"] && <span className={Styles.form_error}><small>Password is Required</small></span>}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={Styles.no_margin}>
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
                        <Form.Group as={Row} className={Styles.no_margin}>
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
                                {error["question1"] && <span className={Styles.form_error}><small>Please select a Question</small></span>}

                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={Styles.no_margin}>
                            <Form.Label column md={4} sm={12}>Answer 1</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Answer 1"
                                    name="answer1"
                                />
                                {error["answer1"] && <span className={Styles.form_error}><small>Answer is Required</small></span>}

                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={Styles.no_margin}>
                            <Form.Label column md={4} sm={12}>Secret Question 2 </Form.Label>
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
                                {error["question2"] && <span className={Styles.form_error}><small> Please select a Question</small></span>}

                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={Styles.no_margin}>
                            <Form.Label column md={4} sm={12}>Answer 2</Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Answer 2"
                                    name="answer2"
                                />
                                {error["answer2"] && <span className={Styles.form_error}><small>Answer is Required</small></span>}
                            </Col>
                        </Form.Group>
                        <Form.Group style={{ textAlign: 'center' }} className={Styles.no_margin}>
                            <Button style={{ width: '100px' }} variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
                                {loading ? spinner() : "Submit"}
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
                <br />
                <img src={Logo} alt="Equabli" width="150px" />
            </div>
        </div >
    )
}

export default SetPassword