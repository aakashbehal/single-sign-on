import {
    GetSubscriptions,
    SelectSubscriptions,
    GetUserSubscriptions
} from "../types.d";

const initialState: any = {
    subscriptions: {
        data: [],
        loading: false,
        error: false
    },
    userSubscription: {
        data: [],
        loading: false,
        error: false
    },
    addSubscription: {
        loading: false,
        error: false,
        success: false
    }
}

const subscriptionReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetSubscriptions.GET_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    loading: true,
                    error: false
                }
            }
        case GetSubscriptions.GET_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    loading: false,
                    data: action.payload
                }
            }
        case GetSubscriptions.GET_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    loading: false,
                    error: true
                }
            }
        case GetSubscriptions.GET_SUBSCRIPTION_RESET:
            return {
                ...state,
                subscriptions: {
                    data: [],
                    loading: false,
                    error: false
                }
            }
        case GetUserSubscriptions.GET_USER_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                userSubscription: {
                    ...state.userSubscription,
                    loading: true,
                    error: false
                }
            }
        case GetUserSubscriptions.GET_USER_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                userSubscription: {
                    ...state.userSubscription,
                    loading: false,
                    data: action.payload
                }
            }
        case GetUserSubscriptions.GET_USER_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                userSubscription: {
                    ...state.userSubscription,
                    loading: false,
                    error: true
                }
            }
        case GetUserSubscriptions.GET_USER_SUBSCRIPTION_RESET:
            return {
                ...state,
                userSubscription: {
                    data: [],
                    loading: false,
                    error: false
                }
            }
        case SelectSubscriptions.SELECT_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                addSubscription: {
                    ...state.addSubscription,
                    loading: true,
                    error: false,
                }
            }
        case SelectSubscriptions.SELECT_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                addSubscription: {
                    ...state.addSubscription,
                    loading: false,
                    success: true
                }
            }
        case SelectSubscriptions.SELECT_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                addSubscription: {
                    ...state.addSubscription,
                    loading: false,
                    error: true
                }
            }
        case SelectSubscriptions.SELECT_SUBSCRIPTION_RESET:
            return {
                ...state,
                addSubscription: {
                    success: false,
                    loading: false,
                    error: false
                }
            }
        default:
            return state
    }
}

export default subscriptionReducer;