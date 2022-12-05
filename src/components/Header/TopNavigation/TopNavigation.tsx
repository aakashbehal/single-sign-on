import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Dropdown, Modal, Button } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { RiLogoutCircleRLine, RiNotification4Fill, RiNotification4Line, RiUser3Fill } from "react-icons/ri"

import Styles from "./TopNavigation.module.sass"
import Logo from '../../../assets/img/logo.png'
import { userService } from "../../../services/user.service";
import Notification from "../../modal/Notifications"


const TopNavigation = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const [showNotification, setShowNotification] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>()
    const [totalNotifications, setTotalNotifications] = useState<any>([])
    const [showConfirmLogout, setShowConfirmLogout] = useState<Boolean>(false)
    let { myRequests } = useSelector((state: any) => ({
        myRequests: state.actionItems.myRequests
    }))

    const getNotifications = () => {
        // dispatch(NotificationActionCreator.setNotification([]))
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getNotifications();
        const d = myRequests.filter((dd) => {
            if (dd.requestStatus === 'Requested') {
                return dd
            } else {
                return false
            }
        })
        setTotalNotifications(d)
        const user: any = userService.getUser();
        setCurrentUser(user)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myRequests])

    const logoutUser = () => {
        setShowConfirmLogout(true)
    }

    const approveHandler = () => {
    }

    const setNotification = () => {
        if (totalNotifications.length > 0) {
            return <RiNotification4Fill size={25} fill="#ff7765" />
        } else {
            return <RiNotification4Line size={25} />
        }
    }

    const toggleNotificationsHandler = () => {
        setShowNotification((showNotification) => {
            return !showNotification
        })
    }

    const goToAccSearch = () => {
        history.push({
            pathname: "/search/account_search",
        })
    }

    return (
        <header className={Styles.header}>
            <div className={Styles.logo}>
                <img src={Logo} alt="Equabli" onClick={goToAccSearch} height="100%" width="150px" style={{ cursor: 'pointer' }} />
            </div>
            <div className={Styles.headerActions}>
                <div className={Styles.notification} onClick={toggleNotificationsHandler}>
                    <span className={`${Styles.notification_count} ${totalNotifications.length > 0 ? Styles.has_notification : Styles.no_notification}`}>
                        <p>{totalNotifications.length}</p>
                    </span>
                    {setNotification()}
                </div>
                <div className={Styles.user_container}>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            <RiUser3Fill size={20} className={Styles.userIcon} />
                            {currentUser && (currentUser.firstName).replace(/\b(\w)/g, (char: string) => char.toUpperCase())}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/user_account">User Details</Dropdown.Item>
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

            <Notification show={showNotification} onHide={() => toggleNotificationsHandler()} data={totalNotifications} />
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