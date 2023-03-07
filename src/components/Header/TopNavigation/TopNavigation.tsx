import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { Dropdown, Modal, Button } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { RiLogoutCircleRLine, RiUser3Fill } from "react-icons/ri"

import Styles from "./TopNavigation.module.sass"
import Logo from '../../../assets/img/logo.png'
import { userService } from "../../../services/user.service";
import { LoginActionCreator } from "../../../store/actions/auth.actions";


const TopNavigation = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState<any>()
    const [showConfirmLogout, setShowConfirmLogout] = useState<Boolean>(false)

    useEffect(() => {
        const user: any = userService.getUser();
        setCurrentUser(user)
    }, [])

    const logoutUser = () => {
        setShowConfirmLogout(true)
    }

    const approveHandler = () => {
        dispatch(LoginActionCreator.logout())
    }

    const goToAccSearch = () => {
        history.push({
            pathname: "/documents/my_documents",
        })
    }

    return (
        <header className={Styles.header}>
            <div className={Styles.logo}>
                <img src={Logo} alt="Equabli" onClick={goToAccSearch} height="100%" width="150px" style={{ cursor: 'pointer' }} />
            </div>
            <div className={Styles.headerActions}>
                {/* <div className={Styles.notification} onClick={toggleNotificationsHandler}>
                    <span className={`${Styles.notification_count} ${totalNotifications.length > 0 ? Styles.has_notification : Styles.no_notification}`}>
                        <p>{totalNotifications.length}</p>
                    </span>
                    {setNotification()}
                </div> */}
                <div className={Styles.user_container}>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            <RiUser3Fill size={20} className={Styles.userIcon} />
                            {currentUser && (currentUser.firstName).replace(/\b(\w)/g, (char: string) => char.toUpperCase())}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/profile/user_account">User Details</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/profile/document_general_configuration">Document General Configuration</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/profile/document_cost_configuration">Document Cost Configuration for Debt Buyer</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/profile/required_documents">Required Documents</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className={Styles.logout}>
                    <RiLogoutCircleRLine size={25} onClick={() => logoutUser()} />
                </div>
            </div>
            <ConfirmLogout
                show={showConfirmLogout}
                onHide={() => setShowConfirmLogout(false)}
                approveHandler={() => approveHandler()} />

            {/* <Notification show={showNotification} onHide={() => toggleNotificationsHandler()} data={totalNotifications} /> */}
        </header>
    )
}

const ConfirmLogout = ({ onHide, show, approveHandler }: any) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="sm"
            animation={true}
        >
            {/* <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Alert
                </Modal.Title>
            </Modal.Header> */}
            <Modal.Body style={{ textAlign: 'center' }}>
                Are you sure you want to logout?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" className={Styles.logout_no} onClick={() => onHide()}>No</Button>
                <Button variant="dark" className={Styles.logout_yes} onClick={() => approveHandler()}>Yes</Button>
            </Modal.Footer>
        </Modal>
    )
}


export default TopNavigation