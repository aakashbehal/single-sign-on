
import { handleResponse, axiosCustom } from "../helpers/util"

const getReceiveDocumentRequest = async ({
    pageSize,
    pageNumber,
    docTypeCode,
    documentName,
    originalAccountNumber,
    equabliAccountNumber,
    clientAccountNumber
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/receiveDocumentRequest/all`, {
            pageSize,
            pageNumber: pageNumber - 1,
            documentType: docTypeCode,
            documentName,
            originalAccountNumber,
            equabliAccountNumber,
            clientAccountNumber
        })
        const data = handleResponse(response)
        let sentRequests = data.response.datas
        const responseModified: any = {}
        responseModified.sentRequests = sentRequests.map((sR) => {
            sR.documentName = sR.documentName === 'pending' ? null : sR.documentName
            sR.requestStatus = !sR.documentName || sR.documentName === 'pending' ? 'Open' : 'Fulfilled'
            sR.dueDate = '03/10/2023'
            return sR
        })
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.columns = data.response.metadata.columns
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