
import { handleResponse, axiosCustom } from "../helpers/util"

const getReceiveDocumentRequest = async ({
    pageSize,
    pageNumber,
    docTypeCode,
    sortOrder,
    sortParam,
    documentName,
    originalAccountNumber,
    equabliAccountNumber,
    clientAccountNumber,
    textSearch,
    requestedDate,
    dueDate,
    fullfillmentDate,
    requestedBy,
    requestStatus
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/fullfill/search`, {
            pageSize,
            pageNumber: pageNumber - 1,
            documentType: docTypeCode,
            sortOrder,
            sortParam,
            documentName,
            originalAccountNumber,
            equabliAccountNumber,
            clientAccountNumber,
            textSearch,
            requestedDate,
            dueDate,
            fullfillmentDate,
            requestedBy,
            requestStatus
        })
        const data = handleResponse(response)
        let sentRequests = data.response.datas
        const responseModified: any = {}
        responseModified.sentRequests = sentRequests.map((sR: any) => {
            sR.documentName = sR.documentName === 'pending' ? null : sR.documentName
            sR.requestStatus = !sR.documentName || sR.documentName === 'pending' ? 'Open' : 'Fulfilled'
            sR.fileSizeOriginal = sR.fileSize
            return sR
        })
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.columns = data.response.metadata.columnPreferences.map((column:
            {
                sequence: number,
                displayName: string,
                attributeNodeKey: string,
                attributeCode: string
            }
        ) => {
            return column.attributeNodeKey
        })
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const downloadDocumentRequest = async (
    documentId: any
) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/fullfill`, {
            documentId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteReceiveDocumentRequest = async (id: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/fullfill/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}


export const receiveDocumentRequest = {
    getReceiveDocumentRequest,
    downloadDocumentRequest,
    deleteReceiveDocumentRequest
}