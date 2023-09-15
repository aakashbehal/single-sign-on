import React, { useEffect, useRef, useState } from 'react'
import { Modal, Container, Row, Col, Button } from "react-bootstrap"
import Styles from "./Modal.module.sass";
import { useDispatch, useSelector } from 'react-redux';
import { NotificationActionCreator } from '../../store/actions/notification.actions';
import { CgSpinnerAlt } from 'react-icons/cg';
import { VscNewFile } from 'react-icons/vsc';
import { FiShare2 } from 'react-icons/fi';
import { HiOutlineDocumentDuplicate, HiOutlineDownload } from 'react-icons/hi';

interface INotification {
    "type": string
    "requestedBy"?: string
    "fulfilledBy"?: string
    "orgType": string
    "account": string
}

const pageSize = 10

const NotificationSidebar = ({ showNotifications }: { showNotifications: any }) => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState<any>(1)
    const {
        notifications,
        loadingNotifications,
        unreadNotifications,
        totalCount,
        pageNumberDb,
        errorNotification,
        loadingReadNotification,
        successReadNotification,
        errorReadNotification
    } = useSelector((state: any) => ({
        notifications: state.notification.data,
        loadingNotifications: state.notification.loading,
        unreadNotifications: state.notification.unread,
        totalCount: state.notification.totalCount,
        pageNumberDb: state.notification.pageNumber,
        errorNotification: state.notification.error,
        loadingReadNotification: state.notification.readLoading,
        successReadNotification: state.notification.readSuccess,
        errorReadNotification: state.notification.readFailure
    }))

    const [containerRef, isVisible]: any = useElementOnScreen({
        root: null,
        rootMargin: "0px",
        threshold: 1.0
    })

    useEffect(() => {
        const pages = Math.floor(totalCount / pageSize)
        if (isVisible && (pages > currentPage)) {
            let tempCurrentPage = currentPage + 1
            setCurrentPage(tempCurrentPage)
            getNotifications(pageSize, tempCurrentPage)
        } else {
            dispatch(NotificationActionCreator.readNotifications())
        }
    }, [isVisible])

    const getNotifications = (pageSize: number, pageNumber: number) => {
        dispatch(NotificationActionCreator.getNotificationsSubsequent({
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
                        notifications && notifications.length === 0 && <p style={{ marginTop: '1rem', textAlign: 'center' }}>No Notifications</p>
                    }
                    {
                        notifications && notifications.map((notification: INotification, index: number) => {
                            if (JSON.stringify(notification) !== "{}") {
                                return <NotificationCard key={`notification_${index}`} notification={notification} />
                            }
                        })
                    }
                    <div ref={containerRef}></div>
                </div>
                {
                    loadingNotifications && <CgSpinnerAlt size={20} style={{ width: '100%' }} className={`spinner ${Styles.details_warning}`} />
                }
            </div >
        </>
    )
}

const NotificationCard = ({ notification }: any) => {
    return (
        <div className={Styles.notificationCard}>
            <div className={Styles.notification_image}>
                {(notification.type === 'fullfillment' || notification.type === 'fulfillment') && <VscNewFile size={25} />}
                {(notification.type === 'share') && <FiShare2 />}
                {(notification.type === 'request') && <HiOutlineDocumentDuplicate size={25} />}
                {(notification.type === 'download') && <HiOutlineDownload size={25} />}

            </div>
            <div className={Styles.notification_text}>
                <p><b>{notification.body}</b></p>
                {/* <p>Account: <b>{notification.account}</b></p>
                <p>Document Type: <b>{notification.documentType}</b></p> */}
            </div>
        </div>
    )
}

const useElementOnScreen = (options: { root: HTMLElement | null, rootMargin: string, threshold: number }) => {
    const containerRef = useRef<any>(null);
    const [isVisible, SetIsVisible] = useState(false)

    const callBackFunction = (entries: any) => {
        const [entry] = entries
        SetIsVisible(entry.isIntersecting)
    }
    useEffect(() => {
        const observer = new IntersectionObserver(callBackFunction, options);
        if (containerRef.current) observer.observe(containerRef.current)
        return (() => {
            if (containerRef.current) observer.unobserve(containerRef.current)
        })
    }, [containerRef, options])

    return [containerRef, isVisible]
}

export default NotificationSidebar
