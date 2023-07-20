
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllClients = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/client/all`, {
            pageSize,
            pageNumber
        })
        const data = handleResponse(response)
        let clients = data.response.datas
        const responseModified: any = {}
        // responseModified.totalCount = data.response.metadata.recordCount
        responseModified.totalCount = 10
        responseModified.clients = clients
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}


const addClient = async ({
    shortName,
    fullName,
    clientType,
    pocName,
    address1,
    address2,
    city,
    zip,
    phone1,
    phone2,
    emailAddress,
    recordSourceId,
    stateCode,
    website,
    isMasterServiced
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/client`, {
            shortName,
            fullName,
            clientType,
            pocName,
            address1,
            address2,
            city,
            zip,
            phone1,
            phone2,
            emailAddress,
            recordSourceId,
            stateCode,
            website,
            isMasterServiced
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const editClient = async ({
    clientId,
    shortName,
    fullName,
    clientType,
    pocName,
    address1,
    address2,
    city,
    zip,
    phone1,
    phone2,
    emailAddress,
    recordSourceId,
    stateCode,
    website,
    isMasterserviced
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/client/edit`, {
            clientId,
            shortName,
            fullName,
            clientType,
            pocName,
            address1,
            address2,
            city,
            zip,
            phone1,
            phone2,
            emailAddress,
            recordSourceId,
            stateCode,
            website,
            isMasterServiced: isMasterserviced
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deactivateClient = async (clientId: string | number) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE}/v1/client/${clientId}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const clientServices = {
    getAllClients,
    addClient,
    editClient,
    deactivateClient
}