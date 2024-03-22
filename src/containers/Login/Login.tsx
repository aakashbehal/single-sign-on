import React, { SyntheticEvent, FC, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap"
import { CgSpinnerAlt } from "react-icons/cg"
import { useToasts } from 'react-toast-notifications';
import ReCAPTCHA from "react-google-recaptcha";

import { history } from "../../helpers";
import Styles from './Login.module.sass';
import Logo from "../../assets/img/logo.png"
import { LoginActionCreator } from "../../store/actions/auth.actions"
import { encryptPassword } from "../../helpers/util"
import { userService } from "../../services";
import useDocumentTitle from "../../components/Common/DocumentTitle";
import { requestForToken } from "../../helpers/firebase"

const Login: FC = () => {

    useDocumentTitle('Equabli - Document Manager', true);
    const { addToast, removeAllToasts } = useToasts();
    const dispatch = useDispatch();
    const usernameRef: any = useRef(null);
    const passwordRef: any = useRef(null);
    const [errors, setErrors] = useState({
        username: false,
        password: false
    })
    const [formIsInvalid, setFormIsInvalid] = useState<any>(false)
    const [disabledSubmit, setDisabledSubmit] = useState(true)

    const { user, error, loading } = useSelector((state: any) => ({
        user: state.auth.user,
        error: state.auth.error,
        loading: state.auth.loading
    }))

    useEffect(() => {
        if (error) {
            addToast(error, { appearance: 'error', autoDismiss: false })
        }
    }, [error])

    useEffect(() => {
        if (user && JSON.stringify(user) !== "{}") {
            requestForToken()
            removeAllToasts()
            if (userService.isPasswordResetRequired()) {
                addToast("Password expired, Please change Password", { appearance: 'error', autoDismiss: false })
                dispatch(LoginActionCreator.resetUser())
                history.push('/change_password')
            } else {
                history.push('/setup/client')
            }
        }
    }, [user])

    useEffect(() => {
        localStorage.clear()
        if (usernameRef !== null) {
            usernameRef.current.focus()
            if (window.location.hash.indexOf('isAutomate') !== -1) {
                setDisabledSubmit(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const validateEmail = (email: any) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleUsernameChange = (e: any) => {
        if (e.target.value === "" || !validateEmail(e.target.value)) {
            usernameRef.current.classList.add(Styles.error)
            setFormIsInvalid(true)
        } else {
            usernameRef.current.classList.remove(Styles.error)
            setFormIsInvalid(false)
        }
    }

    const handlePasswordChange = (e: any) => {
        if (e.target.value === "") {
            passwordRef.current.classList.add(Styles.error)
            setFormIsInvalid(true)
        } else {
            passwordRef.current.classList.remove(Styles.error)
            setFormIsInvalid(false)
        }
    }


    const validateLoginForm = (username: boolean, password: boolean) => {
        let formIsValid = true;
        const error: { username: boolean, password: boolean } = {
            username: false,
            password: false
        }
        if (!username) {
            formIsValid = false
            error['username'] = true
        }
        if (!password) {
            formIsValid = false
            error['password'] = true
        }
        setErrors(error)
        return formIsValid
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const username: any = usernameRef.current && usernameRef.current.value;
        const password: any = passwordRef.current && passwordRef.current.value;
        const enPass = encryptPassword(password)
        if (validateLoginForm(username, enPass)) {
            dispatch(LoginActionCreator.login({ username, password: enPass }))
        }
    }

    const spinner = () => {
        return <CgSpinnerAlt className="spinner" />
    }


    const onChange = () => {
        setDisabledSubmit(false)
    }

    const renderCaptcha = () => {
        return (
            <div className={Styles.reCaptchaId}>
                <ReCAPTCHA
                    sitekey="6LcLlt0cAAAAAGj1c9lewnufAKAjXBrotp1j79IY"
                    onChange={() => onChange()}
                />
            </div>
        )
    }

    return (
        <div className={Styles.login}>
            <div className={Styles.login_container}>
                <h2>EQ Docs</h2>
                <div className={Styles.inner_login_container}>
                    <h5>User Authentication</h5>
                    <br />
                    <Form className={Styles.login_form}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                ref={usernameRef}
                                className={errors['username'] ? Styles.error : ''}
                                onKeyUp={handleUsernameChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                ref={passwordRef}
                                className={errors['password'] ? Styles.error : ''}
                                onKeyUp={handlePasswordChange}
                            />
                        </Form.Group>
                        <p className={Styles.forgot_password} onClick={
                            () => {
                                history.push('/forgot_password')
                            }
                        }>Forgot Password</p>
                        {
                            renderCaptcha()
                        }
                        <Form.Group>
                            <Button variant="primary" type="submit" disabled={disabledSubmit || formIsInvalid} onClick={(e) => handleSubmit(e)}>
                                {loading ? spinner() : "Log In"}
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
                <br />
                <img src={Logo} alt="Equabli" width="150px" />
            </div>
        </div>
    )
};

export default Login