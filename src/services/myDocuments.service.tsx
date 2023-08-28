
import { AxiosResponse } from "axios"
import { handleResponse, axiosCustom, formatBytes } from "../helpers/util"

const getMyDocumentFolders = async ({
    pageSize,
    pageNumber,
    modifiedDateFrom,
    modifiedDateTo,
    sortOrder,
    sortParam,
    docTypeCode,
    documentName,
    folderName,
    originalAccountNumber,
    clientAccountNumber,
    equabliAccountNumber,
    textSearch
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/folders/search`,
            {
                pageSize,
                pageNumber: pageNumber - 1,
                textSearch,
                folderName: documentName ? documentName : folderName ? folderName : null,
                modifiedDateFrom,
                modifiedDateTo,
                sortOrder,
                sortParam,
                docTypeCode,
                originalAccountNumber,
                clientAccountNumber,
                equabliAccountNumber
            }
        )
        const data = handleResponse(response)
        let folders = data.response.datas
        const responseModified: any = {}
        responseModified.folders = folders.map((folder: any) => {
            folder.selected = false
            folder.fileSizeOriginal = folder.fileSize
            folder.fileSize = formatBytes(folder.fileSize)
            return folder
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
    receiveDateTo,
    textSearch
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/search`,
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
                receiveDateTo,
                textSearch
            }
        )
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document: any) => {
            let doc = document?.objectKey?.split("/")
            document.selected = false
            document.fileSizeOriginal = document.fileSize
            document.fileSize = formatBytes(document.fileSize)
            document.name = document.documentName
            // if (doc) {
            //     document.documentName = doc[doc.length - 1]
            // }
            return document
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

const deleteDocument = async (documentId: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/${documentId}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteFolder = async (clientAccountNo: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/folder/${clientAccountNo}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const downloadFolder = async (accountNumbers: string[]) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/download/folder`, {
            accountNumbers
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const downloadDocument = async (documentIds: string[]) => {
    try {
        const response: AxiosResponse = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/download/file`, {
            documentIds
        })
        const data = handleResponse(response)
        if (typeof data.response === 'object') return data.response[0]
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const myDocumentsService = {
    getMyDocumentFolders,
    getMyDocumentList,
    deleteDocument,
    deleteFolder,
    downloadDocument,
    downloadFolder
}