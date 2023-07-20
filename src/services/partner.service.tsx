
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllPartners = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/partner/all`, {
            skip: pageNumber,
            limit: pageSize
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
    shortName,
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
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/partner/add`, {
            shortName,
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
    shortName,
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
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/partner/update`, {
            partnerId,
            shortName,
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
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/partner/${partnerId}`)
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