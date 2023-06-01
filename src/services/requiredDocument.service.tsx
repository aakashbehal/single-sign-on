import { handleResponse, axiosCustom } from "../helpers/util"

const getRequiredDocuments = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/require/all`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const saveRequiredDocuments = async (requestData: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/require`, requestData)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const deleteRequiredDocuments = async (id: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/require/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const requiredDocumentService = {
    getRequiredDocuments,
    saveRequiredDocuments,
    deleteRequiredDocuments
}