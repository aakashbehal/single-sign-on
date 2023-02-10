
import { handleResponse, axiosCustom } from "../helpers/util"

const getReceiveDocumentRequest = async ({
    pageSize,
    pageNumber
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request/all`, {
            pageSize,
            pageNumber: pageNumber - 1
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

const downloadDocumentRequest = async (
    documentId
) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/receiveDocumentRequest`, {
            documentId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const deleteReceiveDocumentRequest = async (id) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/receiveDocumentRequest/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}


export const receiveDocumentRequest = {
    getReceiveDocumentRequest,
    downloadDocumentRequest,
    deleteReceiveDocumentRequest
}