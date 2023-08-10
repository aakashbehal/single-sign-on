
import { handleResponse, axiosCustom, formatBytes, dateFormatterForRequest } from "../helpers/util"

const getDownloadHistory = async ({
    pageSize,
    pageNumber
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/download/all`, {
            pageSize,
            pageNumber: pageNumber - 1
        })
        const data = handleResponse(response)
        let downloadHistory = data.response.datas
        const responseModified: any = {}
        responseModified.sentRequests = downloadHistory.map((dH: any) => {
            dH.fileSizeOriginal = dH.documentsize
            dH.documentsize = formatBytes(dH.documentsize)
            dH.downloadDate = dateFormatterForRequest(dH.downloadAt)
            dH.downloadStatus = "Completed"
            return dH
        })
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const saveDownloadHistory = async (
    documentId: any
) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/download`, {
            documentId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDownloadHistory = async (id: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/download/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}


export const downloadHistory = {
    getDownloadHistory,
    saveDownloadHistory,
    deleteDownloadHistory
}