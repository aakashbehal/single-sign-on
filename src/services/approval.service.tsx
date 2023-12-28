
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllUsers = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_USER_SERVICE}/users`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const approveUser = async ({
    uid,
    loginKey
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_USER_SERVICE}/users/activation`, {
            uid,
            loginKey
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const approvalService = {
    getAllUsers,
    approveUser,
}