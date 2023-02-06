
import { handleResponse, axiosCustom } from "../helpers/util"

const getSentDocumentRequest = async ({
    pageSize,
    pageNumber,
    documentType,
    documentName,
    originalAccountNumber,
    equabliAccountNumber,
    clientAccountNumber
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request/all`, {
            pageSize,
            pageNumber: pageNumber - 1,
            documentType,
            documentName,
            originalAccountNumber,
            equabliAccountNumber,
            clientAccountNumber
        })
        const data = handleResponse(response)
        let sentRequests = data.response.datas
        const responseModified: any = {}
        responseModified.sentRequests = sentRequests
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const sentDocumentRequest = async (requestBody) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request`, requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const deleteDocumentRequest = async (id) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}


export const sentDocumentRequestService = {
    getSentDocumentRequest,
    sentDocumentRequest,
    deleteDocumentRequest
}