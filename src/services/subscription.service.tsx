
import { handleResponse, axiosCustom } from "../helpers/util"

const GetSubscriptions = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/subscription/all`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const GetUserSubscriptions = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/subscription`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const AddSubscription = async (subscriptionCode: any) => {
    try {
        const response = await axiosCustom.put(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/subscription/${subscriptionCode}`, {})
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const subscriptionService = {
    GetSubscriptions,
    GetUserSubscriptions,
    AddSubscription
}