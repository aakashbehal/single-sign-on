
import { handleResponse, axiosCustom } from "../helpers/util"

const getReceiveSummary = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/receiveDocumentRequest/summary`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getSentSummary = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request/summary`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const summaryService = {
    getReceiveSummary,
    getSentSummary
}