import { handleResponse, axiosCustom } from "../helpers/util"

const registration = async (requestData: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_SSO}${process.env.REACT_APP_SSO_USER_SERVICE}/public/user/registration`, requestData)
        const data = handleResponse(response)
        return data
    } catch (error: any) {
        throw error.message
    }
}

const validateOrgName = async (orgName: any, orgType: any) => {
    const requestBody: any = {
        "orgType": orgType,
        "shortName": orgName
    }
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_SSO}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/public/services/validate/clientOrPartnerByCode`, requestBody)
        const data = handleResponse(response)
        return data
    } catch (error: any) {
        throw error
    }
}

export const registrationService = {
    registration,
    validateOrgName
}