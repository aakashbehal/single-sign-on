import React, { FormEvent, useEffect, useState, useRef } from 'react'
import { Row, Col, Form, Button } from "react-bootstrap"
import { useDispatch } from 'react-redux';
import { CgSpinnerAlt } from "react-icons/cg"
import { BiShow, BiHide } from 'react-icons/bi'
import { useToasts } from 'react-toast-notifications';

import { history } from "../../helpers";
import Styles from './Login.module.sass';
import Logo from "../../assets/img/logo.png"
import { userService } from '../../services';
import { LoginActionCreator } from '../../store/actions/auth.actions';
import { axiosCustom, handleResponse, passwordRegexCheck } from "../../helpers/util"

const ChangePassword = () => {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changePasswordRef = useRef<any>()
    const loading = false;
    const [oldPasswordType, setOldPasswordType] = useState('password')
    const [newPasswordType, setNewPasswordType] = useState('password')
    const [confirmPasswordType, setConfirmPasswordType] = useState('password')
    const [error, setError] = useState<any>({
        oldPassword: false,
        password: false,
        rePassword: false,
        noMatch: false,
        isPasswordValid: false
    });

    useEffect(() => {
        // remove user from redux
        dispatch(LoginActionCreator.resetUser())
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let formError: any = {
            password: false,
            rePassword: false,
            oldPassword: false,
            noMatch: false,
            isPasswordValid: false
        }
        const {
            oldPassword,
            password,
            rePassword
        } = changePasswordRef.current
        if (!password.value || password.value === '') {
            formError.password = true
        } else {
            formError.password = false
        }
        if (!oldPassword.value || oldPassword.value === '') {
            formError.oldPassword = true
        } else {
            formError.oldPassword = false
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
        setError(formError)
        for (let key in formError) {
            if (formError[key]) {
                return
            }
        }
        const tempUser = userService.getTempUser()
        const req: any = {
            "loginKey": tempUser.loginKey,
            "loginSecret": oldPassword.value,
            "newLoginSecret": password.value,
            "orgType": tempUser.recordSource === 'Partner' ? "PT" : tempUser.recordSource === 'Equabli' ? "EQ" : "CL"
        }
        if (tempUser.recordSource === 'Partner') {
            req.partnerId = tempUser.partnerId
        } else {
            req.clientId = tempUser.clientId
        }
        try {
            const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMPLIANCE_SEARCH_URL}/changePasswordByUserDetails`, req)
            const data = handleResponse(response)
            addToast("Password Changed Successfully, Please login with new Credentials", { appearance: 'success', autoDismiss: true })
            localStorage.removeItem('tempUser')
            history.push('/login')
        } catch (error: any) {
            addToast(error?.data?.message || error || 'Issue while resetting user password', { appearance: 'error', autoDismiss: false })
            throw error
        }
    }

    const spinner = () => {
        return <CgSpinnerAlt className="spinner" />
    }

    return (
        <div className={Styles.login}>
            <div className={`${Styles.login_container} ${Styles.password_set}`}>
                <h2>Change Password</h2>
                <div className={`${Styles.inner_login_container} ${Styles.inner_password_set}`}>
                    <br />
                    <Form className={Styles.login_form} ref={changePasswordRef}>
                        <Form.Group as={Row} className={Styles.no_margin}>
                            <Form.Label column md={4} sm={12}>Enter Old Password</Form.Label>
                            <Col sm={8}>
                                <Col sm={12} style={{ padding: 0, position: 'relative' }}>
                                    <Form.Control
                                        type={oldPasswordType}
                                        name="oldPassword"
                                        placeholder="Enter Old Password"
                                    />
                                    <div style={{ position: 'absolute', right: '1rem', top: '.7rem' }}>
                                        {oldPasswordType === 'password' ? <BiShow size={20} style={{ cursor: 'pointer' }} onClick={() => setOldPasswordType('text')} /> : <BiHide style={{ cursor: 'pointer' }} size={20} onClick={() => setOldPasswordType('password')} />}
                                    </div>
                                </Col>
                                {error["oldPassword"] && <span className={Styles.form_error}><small>Old Password is Required</small></span>}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={Styles.no_margin}>
                            <Form.Label column md={4} sm={12}>Enter New Password</Form.Label>
                            <Col sm={8}>
                                <Col sm={12} style={{ padding: 0, position: 'relative' }}>
                                    <Form.Control
                                        type={newPasswordType}
                                        name="password"
                                        placeholder="Enter new Password"
                                    />
                                    <div style={{ position: 'absolute', right: '1rem', top: '.7rem' }}>
                                        {newPasswordType === 'password' ? <BiShow size={20} style={{ cursor: 'pointer' }} onClick={() => setNewPasswordType('text')} /> : <BiHide style={{ cursor: 'pointer' }} size={20} onClick={() => setNewPasswordType('password')} />}
                                    </div>
                                </Col>

                                {error["password"] && <span className={Styles.form_error}><small>New Password is Required</small></span>}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={Styles.no_margin}>
                            <Form.Label column md={4} sm={12}>Re-enter New Password </Form.Label>
                            <Col sm={8}>
                                <Col sm={12} style={{ padding: 0, position: 'relative' }}>
                                    <Form.Control
                                        type={confirmPasswordType}
                                        name="rePassword"
                                        placeholder="Re-enter new Password"
                                    />
                                    <div style={{ position: 'absolute', right: '1rem', top: '.7rem' }}>
                                        {confirmPasswordType === 'password' ? <BiShow size={20} style={{ cursor: 'pointer' }} onClick={() => setConfirmPasswordType('text')} /> : <BiHide style={{ cursor: 'pointer' }} size={20} onClick={() => setConfirmPasswordType('password')} />}
                                    </div>
                                </Col>
                                {error["rePassword"] && <span className={Styles.form_error}><small>Re-Enter new password is Required</small><br /></span>}
                                {error["noMatch"] && <span className={Styles.form_error}><small>Passwords do not match</small><br /></span>}
                                {error["isPasswordValid"] && <span className={Styles.form_error}><small> Password should meet 3 of 4 of the following requirements <br /> At least 1 upper case letter (A – Z) <br /> At least 1 lower case letter (a-z),  <br /> At least 1 digit (0 – 9),  <br /> At least 1 special Characters (!@#$%&*()) and should be 14 characters long</small></span>}

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

export default ChangePassword;