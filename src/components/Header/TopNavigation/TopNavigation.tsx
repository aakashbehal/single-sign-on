import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Dropdown, Modal, Button } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { RiLogoutCircleRLine, RiNotification4Fill, RiNotification4Line, RiUser3Fill } from "react-icons/ri"

import Styles from "./TopNavigation.module.sass"
import Logo from '../../../assets/img/logo.png'
import { userService } from "../../../services/user.service";
import { LoginActionCreator } from "../../../store/actions/auth.actions";
import NotificationSidebar from "../../modal/Notifications";
import { onMessageListener } from "../../../helpers/firebase";
import { useToasts } from "react-toast-notifications";
import { NotificationActionCreator } from "../../../store/actions/notification.actions";



const TopNavigation = ({ isSidebar = false }: { isSidebar?: boolean }) => {
    const history = useHistory();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState<any>()
    const [showConfirmLogout, setShowConfirmLogout] = useState<Boolean>(false)
    const [showNotifications, setShowNotification] = useState<Boolean>(false)

    const {
        unread
    } = useSelector((state: any) => ({
        unread: state.notification.unread
    }))

    useEffect(() => {
        const user: any = userService.getUser();
        setCurrentUser(user)
        getNotifications(10, 0)
    }, [])

    onMessageListener()
        .then((payload: any) => {
            getNotifications(10, 0)
            addToast(payload.notification.body, { appearance: 'info', autoDismiss: true });
        })
        .catch((err: any) => console.log('failed: ', err));

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

    const setNotification = (count: number) => {
        if (count) {
            return <RiNotification4Fill size={25} fill="#ff7765" />
        } else {
            return <RiNotification4Line size={25} />
        }
    }

    const getNotifications = (pageSize: number, pageNumber: number) => {
        dispatch(NotificationActionCreator.getNotifications({
            pageSize,
            pageNumber
        }))
    }

    return (
        <>
            <header className={Styles.header}>
                <div className={Styles.logo}>
                    {
                        !isSidebar &&
                        <img src={Logo} alt="Equabli" onClick={goToAccSearch} height="100%" width="150px" style={{ cursor: 'pointer' }} />
                    }
                </div>
                <div className={Styles.headerActions}>
                    <div className={Styles.notification} onClick={() => setShowNotification((state) => !state)}>
                        {
                            !!unread &&
                            <span className={`${Styles.notification_count} ${true ? Styles.has_notification : Styles.no_notification}`} >
                                <p>{unread >= 10 ? '9+' : unread}</p>
                            </span>
                        }
                        {setNotification(unread)}
                    </div>
                    <div className={Styles.user_container}>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                                {!currentUser?.profilePicture && <RiUser3Fill size={20} className={Styles.userIcon} />}
                                {currentUser?.profilePicture && <img src={currentUser?.profilePicture} alt="" className="profile_pic_account" />}
                                {currentUser && (currentUser.firstName).replace(/\b(\w)/g, (char: string) => char.toUpperCase())}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile/user_account">User Details</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/profile/document_general_configuration">Document General Configuration</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/profile/document_cost_configuration">Document Cost Configuration</Dropdown.Item>
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
                {
                    showNotifications && <NotificationSidebar showNotifications={showNotifications} />
                }
            </header>
            {
                showNotifications && <div className={Styles.backdrop_custom} onClick={() => setShowNotification((state) => !state)}></div>
            }
        </>
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