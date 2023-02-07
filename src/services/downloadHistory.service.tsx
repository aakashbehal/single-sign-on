
import { handleResponse, axiosCustom, formatBytes, dateTimeFormat } from "../helpers/util"

const getDownloadHistory = async ({
    pageSize,
    pageNumber
}) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/download`, {
            params: {
                pageSize,
                pageNumber: pageNumber - 1
            }
        })
        const data = handleResponse(response)
        let downloadHistory = data.response.datas
        const responseModified: any = {}
        responseModified.sentRequests = downloadHistory.map((dH) => {
            dH.documentsize = formatBytes(dH.documentsize)
            dH.downloadDate = `${dH.downloadDate[1] > 9 ? dH.downloadDate[1] : `0${dH.downloadDate[1]}`}/${dH.downloadDate[2] > 9 ? dH.downloadDate[2] : `0${dH.downloadDate[2]}`}/${dH.downloadDate[0]}`
            return dH
        })
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const saveDownloadHistory = async (
    documentId
) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/download`, {
            documentId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const deleteDownloadHistory = async (id) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/download/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}


export const downloadHistory = {
    getDownloadHistory,
    saveDownloadHistory,
    deleteDownloadHistory
}