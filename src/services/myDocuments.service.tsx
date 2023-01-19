
import { handleResponse, axiosCustom } from "../helpers/util"

const getMyDocumentFolders = async ({
    pageSize,
    pageNumber,
    orgType
}) => {
    try {
        const response = await axiosCustom.get(`/document/folders`, { params: { pageSize, pageNumber, orgType } })
        const data = handleResponse(response)
        let folders = data.response.datas
        const responseModified: any = {}
        responseModified.folders = folders.map((folder) => {
            folder.selected = false
            return folder
        })
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const getMyDocumentList = async ({
    pageSize,
    pageNumber,
    accountNumber,
    orgType
}) => {
    try {
        const response = await axiosCustom.get(`/document/documents`, { params: { accountNumber, orgType, pageSize, pageNumber } })
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document) => {
            document.selected = false
            return document
        })
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}

export const myDocumentsService = {
    getMyDocumentFolders,
    getMyDocumentList
}