
import { handleResponse, axiosCustom, formatBytes } from "../helpers/util"

const getMyDocumentFolders = async ({
    pageSize,
    pageNumber,
    folderName,
    modifiedDateFrom,
    modifiedDateTo,
    sortOrder,
    sortParam,
    docTypeCode,
    documentName,
    originalAccountNumber,
    clientAccountNumber,
    equabliAccountNumber
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/folders`,
            {
                pageSize,
                pageNumber: pageNumber - 1,
                folderName: folderName || null,
                modifiedDateFrom,
                modifiedDateTo,
                sortOrder,
                sortParam,
                docTypeCode,
                documentName,
                originalAccountNumber,
                clientAccountNumber,
                equabliAccountNumber
            }
        )
        const data = handleResponse(response)
        let folders = data.response.datas
        const responseModified: any = {}
        responseModified.folders = folders.map((folder) => {
            folder.selected = false
            folder.fileSize = formatBytes(folder.fileSize)
            return folder
        })
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.columns = data.response.metadata.columns
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const getMyDocumentList = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
    accountNumber,
    docTypeCode,
    documentName,
    generationDateFrom,
    generationDateTo,
    uploadDateFrom,
    uploadDateTo,
    shareDateFrom,
    shareDateTo,
    receiveDateFrom,
    receiveDateTo
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/all`,
            {
                pageSize,
                pageNumber: pageNumber - 1,
                sortOrder,
                sortParam,
                accountNumber,
                documentType: docTypeCode,
                documentName,
                generationDateFrom,
                generationDateTo,
                uploadDateFrom,
                uploadDateTo,
                shareDateFrom,
                shareDateTo,
                receiveDateFrom,
                receiveDateTo
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
        responseModified.columns = data.response.metadata.columns
        return responseModified
    } catch (error: any) {
        throw error
    }
}

export const myDocumentsService = {
    getMyDocumentFolders,
    getMyDocumentList
}