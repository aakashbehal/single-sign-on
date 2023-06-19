import { GetNotifications, ReadNotifications, GetNotificationsSubsequent } from "../types.d"
import { notificationService } from "../../services"

export const NotificationActionCreator = {
    getNotifications: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: GetNotifications.GET_NOTIFICATION_REQUEST, payload: [] })
        const success = (notifications: any) => ({ type: GetNotifications.GET_NOTIFICATION_SUCCESS, payload: notifications })
        const failure = () => ({ type: GetNotifications.GET_NOTIFICATION_FAILURE, payload: [] })

        dispatch(request())

        notificationService.getNotifications(payload)
            .then(
                notifications => {
                    dispatch(success(notifications))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    getNotificationsSubsequent: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: GetNotificationsSubsequent.GET_NOTIFICATION_SUBSEQUENT_REQUEST, payload: [] })
        const success = (notifications: any) => ({ type: GetNotificationsSubsequent.GET_NOTIFICATION_SUBSEQUENT_SUCCESS, payload: notifications })
        const failure = () => ({ type: GetNotificationsSubsequent.GET_NOTIFICATION_SUBSEQUENT_FAILURE, payload: [] })

        dispatch(request())

        notificationService.getNotifications(payload)
            .then(
                notifications => {
                    dispatch(success(notifications))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    resetNotification: () => (dispatch: any) => {
        dispatch({ type: GetNotifications.GET_NOTIFICATION_RESET })
    },
    readNotifications: () => (dispatch: any) => {
        const request = () => ({ type: ReadNotifications.READ_NOTIFICATION_REQUEST, payload: [] })
        const success = () => ({ type: ReadNotifications.READ_NOTIFICATION_SUCCESS, payload: [] })
        const failure = () => ({ type: ReadNotifications.READ_NOTIFICATION_FAILURE, payload: [] })

        dispatch(request())

        notificationService.readNotifications()
            .then(
                notifications => {
                    dispatch(success())
                },
                error => {
                    dispatch(failure())
                }
            )
    }
}