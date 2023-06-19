import { GetNotifications, ReadNotifications, GetNotificationsSubsequent } from "../types.d"

const initialState = {
    data: [],
    loading: false,
    error: false,
    totalCount: 0,
    pageNumber: 0,
    unread: 0,
    readLoading: false,
    readSuccess: false,
    readFailure: false
}

const notificationReducer = (state = initialState, action: { type: any, payload: any }) => {
    switch (action.type) {
        case GetNotifications.GET_NOTIFICATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case GetNotifications.GET_NOTIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.notifications,
                unread: action.payload.unread,
                totalCount: action.payload.totalCount,
                pageNumber: action.payload.pageNumber
            }
        case GetNotifications.GET_NOTIFICATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case GetNotifications.GET_NOTIFICATION_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: []
            }
        case GetNotificationsSubsequent.GET_NOTIFICATION_SUBSEQUENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case GetNotificationsSubsequent.GET_NOTIFICATION_SUBSEQUENT_SUCCESS:
            return {
                ...state,
                loading: false,
                data: [...state.data, ...action.payload.notifications]
            }
        case GetNotificationsSubsequent.GET_NOTIFICATION_SUBSEQUENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case GetNotificationsSubsequent.GET_NOTIFICATION_SUBSEQUENT_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: []
            }
        case ReadNotifications.READ_NOTIFICATION_REQUEST:
            return {
                ...state,
                readLoading: true,
                readSuccess: false,
                readFailure: false
            }
        case ReadNotifications.READ_NOTIFICATION_SUCCESS:
            return {
                ...state,
                readLoading: false,
                readSuccess: true,
                unread: 0,
                readFailure: false
            }
        case ReadNotifications.READ_NOTIFICATION_FAILURE:
            return {
                ...state,
                readLoading: false,
                readSuccess: false,
                readFailure: true
            }
        default:
            return state
    }
}

export default notificationReducer;