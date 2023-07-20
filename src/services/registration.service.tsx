import { handleResponse, axiosCustom } from "../helpers/util"

const registration = async (requestData: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMPLIANCE_SEARCH_URL}/registration`, requestData)
        const data = handleResponse(response)
        return data
    } catch (error: any) {
        throw error.message
    }
}

const validateOrgName = async (orgName: any, orgType: any) => {
    let requestBody: any = {
        orgType
    }
    if (orgType === 'CL') {
        requestBody.clientName = orgName
    } else if (orgType === 'PT') {
        requestBody.partnerName = orgName
    }
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getClientOrPartnerIdByCode`, requestBody)
        const data = handleResponse(response)
        return data
    } catch (error: any) {
        throw error.message
    }
}

export const registrationService = {
    registration,
    validateOrgName
}