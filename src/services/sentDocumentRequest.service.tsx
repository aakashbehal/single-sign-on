
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
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/send/search`, {
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
        responseModified.sentRequests = sentRequests.map((sR: any) => {
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

const sentDocumentRequest = async (requestBody: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/send`, requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentRequest = async (id: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/send/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const sentDocumentRequestService = {
    getSentDocumentRequest,
    sentDocumentRequest,
    deleteDocumentRequest
}