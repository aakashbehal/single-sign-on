import {
    GetSubscriptions,
    SelectSubscriptions,
    GetUserSubscriptions
} from "../types.d";

import { subscriptionService } from "../../services"

export const SubscriptionActionCreator = {
    GetSubscriptions: () => (dispatch: any) => {
        const request = () => ({ type: GetSubscriptions.GET_SUBSCRIPTION_REQUEST, payload: [] })
        const success = (data: any) => ({ type: GetSubscriptions.GET_SUBSCRIPTION_SUCCESS, payload: data })
        const failure = () => ({ type: GetSubscriptions.GET_SUBSCRIPTION_FAILURE, payload: [] })

        dispatch(request())

        subscriptionService.GetSubscriptions()
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    GetUserSubscriptions: () => (dispatch: any) => {
        const request = () => ({ type: GetUserSubscriptions.GET_USER_SUBSCRIPTION_REQUEST, payload: [] })
        const success = (data: any) => ({ type: GetUserSubscriptions.GET_USER_SUBSCRIPTION_SUCCESS, payload: data })
        const failure = () => ({ type: GetUserSubscriptions.GET_USER_SUBSCRIPTION_FAILURE, payload: [] })

        dispatch(request())

        subscriptionService.GetUserSubscriptions()
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    AddSubscription: (subscriptionCode: any) => (dispatch: any) => {
        const request = () => ({ type: SelectSubscriptions.SELECT_SUBSCRIPTION_REQUEST, payload: [] })
        const success = (data: any) => ({ type: SelectSubscriptions.SELECT_SUBSCRIPTION_SUCCESS, payload: data })
        const failure = () => ({ type: SelectSubscriptions.SELECT_SUBSCRIPTION_FAILURE, payload: [] })

        dispatch(request())

        subscriptionService.AddSubscription(subscriptionCode)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
            .finally(() => {
                setTimeout(() => {
                    dispatch({ type: SelectSubscriptions.SELECT_SUBSCRIPTION_RESET })
                }, 0)
            })
    }
}