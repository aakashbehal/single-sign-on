
import { handleResponse, axiosCustom } from "../helpers/util"

const nameHandler = (data: any) => {
    return `${data.firstName} ${data.middleName} ${data.lastName}`
}

const chooseOrgType = (data: any) => {
    let orgName
    if (data.orgType === 'CL') orgName = data.clientName
    if (data.orgType === 'PT') orgName = data.partnerName
    return orgName
}

const ORG_TYPE_MAPPER: any = {
    CL: "Client",
    PT: "Partner",
    EQ: "Equabli"
}


const getAllUsers = async (requestPayload: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_USER_SERVICE}/users/all`, { params: requestPayload })
        const data = handleResponse(response)
        let users = data.response.datas
        const responseModified: any = {}
        responseModified.users = users.map((user: any) => {
            user.orgTypeFormatted = ORG_TYPE_MAPPER[user.orgType]
            user.orgName = chooseOrgType(user)
            user.userName = nameHandler(user)
            return user
        })
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
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