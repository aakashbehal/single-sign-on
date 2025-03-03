
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllPartners = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/partners/search`, {
            pageNumber: pageNumber - 1,
            pageSize
        })
        const data = handleResponse(response)
        let partners = data.response.datas
        const responseModified: any = {}
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.partners = partners
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}


const addPartner = async ({
    shortCode,
    fullName,
    address1,
    address2,
    city,
    zip,
    emailAddress,
    phone1,
    phone2,
    pocName,
    amtMinCollLimit,
    amtMaxCollLimit,
    servicetypeId,
    stateCode,
    website,
    quicksightId,
    namePronunciation,
    emailPronunciation,
    phonePronunciation,
    addressPronunciation,
    isEqassociate
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/partners`, {
            shortCode,
            fullName,
            address1,
            address2,
            city,
            zip,
            emailAddress,
            phone1,
            phone2,
            pocName,
            amtMinCollLimit,
            amtMaxCollLimit,
            servicetypeId,
            stateCode,
            website,
            quicksightId,
            namePronunciation,
            emailPronunciation,
            phonePronunciation,
            addressPronunciation,
            isEqassociate
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const editPartner = async ({
    partnerId,
    shortCode,
    fullName,
    address1,
    address2,
    city,
    zip,
    emailAddress,
    phone1,
    phone2,
    pocName,
    amtMinCollLimit,
    amtMaxCollLimit,
    servicetypeId,
    stateCode,
    website,
    quicksightId,
    namePronunciation,
    emailPronunciation,
    phonePronunciation,
    addressPronunciation,
    isEqassociate
}: any) => {
    try {
        const response = await axiosCustom.put(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/partners/${partnerId}`, {
            shortCode,
            fullName,
            address1,
            address2,
            city,
            zip,
            emailAddress,
            phone1,
            phone2,
            pocName,
            amtMinCollLimit,
            amtMaxCollLimit,
            servicetypeId,
            stateCode,
            website,
            quicksightId,
            namePronunciation,
            emailPronunciation,
            phonePronunciation,
            addressPronunciation,
            isEqassociate
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deactivatePartner = async (partnerId: string | number) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/partners/${partnerId}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const partnerServices = {
    getAllPartners,
    addPartner,
    editPartner,
    deactivatePartner
}

// {
//     "amtMinCollLimit":0.0,
//     "amtMaxCollLimit":0.0,
//     "stateCode":"CA",
//     "namePronunciation":"name pronunciation",
//     "emailPronunciation":"email pronunciation",
//     "phonePronunciation":"phone pronunciation",
//     "addressPronunciation":"addres pronunciation",
//     }