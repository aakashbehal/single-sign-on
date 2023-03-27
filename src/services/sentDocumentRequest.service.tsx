
import { handleResponse, axiosCustom } from "../helpers/util"

const getSentDocumentRequest = async ({
    pageSize,
    pageNumber,
    docTypeCode,
    documentName,
    originalAccountNumber,
    equabliAccountNumber,
    clientAccountNumber,
    sortOrder,
    sortParam,
    textSearch
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request/all`, {
            pageSize,
            pageNumber: pageNumber - 1,
            documentType: docTypeCode,
            documentName,
            originalAccountNumber,
            equabliAccountNumber,
            clientAccountNumber,
            sortOrder,
            sortParam,
            textSearch
        })
        const data = handleResponse(response)
        let sentRequests = data.response.datas
        const responseModified: any = {}
        responseModified.sentRequests = sentRequests
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.columns = data.response.metadata.columns
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const sentDocumentRequest = async (requestBody) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request`, requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const deleteDocumentRequest = async (id) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request/${id}`)
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