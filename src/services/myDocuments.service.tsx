
import { handleResponse, axiosCustom, formatBytes } from "../helpers/util"

const getMyDocumentFolders = async ({
    pageSize,
    pageNumber,
    folderName,
    modifiedDateFrom,
    modifiedDateTo
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/folders`,
            {
                pageSize,
                pageNumber: pageNumber - 1,
                folderName,
                modifiedDateFrom,
                modifiedDateTo
            }
        )
        const data = handleResponse(response)
        let folders = data.response.datas
        const responseModified: any = {}
        responseModified.folders = folders.map((folder) => {
            folder.selected = false
            folder.fileSize = formatBytes(folder.fileSize)
            folder.folderName = `Account-${folder.folderName}`
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
                accountNumber: accountNumber.replace("Account-", ""),
                orgTypeCode: orgType,
                pageSize,
                pageNumber: pageNumber - 1
            }
        )
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document) => {
            document.selected = false
            document.fileSize = formatBytes(document.fileSize)
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