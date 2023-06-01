import React, { useEffect, useRef, useState } from 'react'
import { Modal, Container, Row, Col, Button } from "react-bootstrap"
import Styles from "./Modal.module.sass";
import { useDispatch, useSelector } from 'react-redux';
import { NotificationActionCreator } from '../../store/actions/notification.actions';
import { CgSpinnerAlt } from 'react-icons/cg';

interface INotification {
    "type": string
    "requestedBy"?: string
    "fulfilledBy"?: string
    "orgType": string
    "account": string
}

const NotificationSidebar = ({ showNotifications }: { showNotifications: any }) => {
    const dispatch = useDispatch()
    const observerTarget = useRef(null);
    const [currentPage, setCurrentPage] = useState<any>(0)
    const [pageSize, setPageSize] = useState<any>(2)
    const [notificationList, setNotificationList] = useState<any>([])
    const {
        notifications,
        loadingNotifications,
        errorNotification,
        loadingReadNotification,
        successReadNotification,
        errorReadNotification
    } = useSelector((state: any) => ({
        notifications: state.notification.data,
        loadingNotifications: state.notification.loading,
        errorNotification: state.notification.error,
        loadingReadNotification: state.notification.readLoading,
        successReadNotification: state.notification.readSuccess,
        errorReadNotification: state.notification.readFailure
    }))

    useEffect(() => {
        getNotifications(pageSize, currentPage)
    }, [currentPage, pageSize])

    useEffect(() => {
        setNotificationList((state: any) => {
            return [...state, ...notifications]
        })
    }, [notifications])

    const getNotifications = (pageSize: number, pageNumber: number) => {
        dispatch(NotificationActionCreator.getNotifications({
            pageSize,
            pageNumber
        }))
    }

    return (
        <>
            <div className={`${Styles.side_notification} ${showNotifications ? Styles.show_notification : ''}`}>
                <div className={Styles.notification_header}>
                    <h4>Notifications</h4>
                </div>
                <div className={Styles.notification_body}>
                    {
                        notificationList && notificationList.map((notification: INotification, index: number) => {
                            return <NotificationCard key={`notification_${index}`} setCurrentPage={setCurrentPage} setPageSize={setPageSize} notification={notification} observerTarget={observerTarget} />
                        })
                    }
                    <div ref={observerTarget}></div>
                </div>
                {
                    loadingNotifications && <CgSpinnerAlt size={20} style={{ width: '100%' }} className={`spinner ${Styles.details_warning}`} />
                }
            </div >
        </>
    )
}

const NotificationCard = ({ rootElement, setCurrentPage, setPageSize, notification, observerTarget }: any) => {


    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    observer.unobserve(observerTarget.current);
                    setCurrentPage((state: any) => { return state + 1 })
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget])

    return (
        <div className={Styles.notificationCard}>
            <div className={Styles.notification_image}>
                {notification.requestedBy && <span>{notification.requestedBy.charAt(0)}</span>}
                {notification.fulfilledBy && <span>{notification.fulfilledBy.charAt(0)}</span>}
            </div>
            <div className={Styles.notification_text}>
                <p><b>{notification.body}</b></p>
                <p>Account: <b>{notification.account}</b></p>
                <p>Document Type: <b>Bill of sales</b></p>
            </div>
        </div>

    )
}

export default NotificationSidebar
