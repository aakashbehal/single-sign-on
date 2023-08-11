
import { handleResponse, axiosCustom } from "../helpers/util"

const getDocumentCost = async (userType: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/cost/all`)
        const data = handleResponse(response)
        return data.response.datas
    } catch (error: any) {
        throw error.message
    }
}

const saveDocumentCost = async (payload: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/cost`, payload)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const editDocumentCost = async (payload: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/cost`, payload)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentCost = async (docTypeCode: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/cost/${docTypeCode}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}


export const documentCostConfigurationService = {
    getDocumentCost,
    saveDocumentCost,
    editDocumentCost,
    deleteDocumentCost
}