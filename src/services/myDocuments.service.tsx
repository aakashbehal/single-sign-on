
import { handleResponse, axiosCustom, formatBytes } from "../helpers/util"

const getMyDocumentFolders = async ({
    pageSize,
    pageNumber,
    orgType
}) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/folders`,
            {
                params: {
                    pageSize,
                    pageNumber: pageNumber - 1,
                    orgType
                }
            })
        const data = handleResponse(response)
        let folders = data.response.datas
        const responseModified: any = {}
        responseModified.folders = folders.map((folder) => {
            folder.selected = false
            folder.fileSize = formatBytes(folder.fileSize)
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
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/all`,
            {
                accountNumber,
                orgTypeCode: orgType,
                pageSize,
                pageNumber: pageNumber - 1
            }
        )
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document) => {
            let splitFileName = document.filePath.split('/')
            document.selected = false
            document.fileSize = formatBytes(document.fileSize)
            if (splitFileName) {
                document.fileName = splitFileName[splitFileName.length - 1]
            }
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