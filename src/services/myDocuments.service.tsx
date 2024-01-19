
import { AxiosResponse } from "axios"
import { handleResponse, axiosCustom, formatBytes } from "../helpers/util"
import _ from 'lodash'

const getMyDocumentFolders = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
    documentName,
    folderName,
    recordGroupIdentifier
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/folder`,
            {
                pageSize,
                pageNumber: pageNumber - 1,
                sortOrder,
                sortParam,
                recordGroupIdentifier: recordGroupIdentifier,
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

const getMyDocumentFoldersTextSearch = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
    textSearch,
    recordGroupIdentifier
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/folder/textSearch`,
            {
                pageSize,
                pageNumber: pageNumber - 1,
                textSearch,
                sortOrder,
                recordGroupIdentifier,
                sortParam,
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

const getMyDocumentFoldersAdvanceSearch = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
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
    modifiedDateFrom,
    modifiedDateTo,
    originalAccountNumber,
    clientAccountNumber,
    equabliAccountNumber,
    sharedBy,
    sharedWith,
    recordGroupIdentifier,
    docGroupCode,
    portfolioId
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/folder/advanceSearch`,
            {
                pageSize,
                pageNumber: pageNumber - 1,
                sortOrder,
                sortParam,
                recordGroupIdentifier: recordGroupIdentifier,
                folderName: documentName,
                equabliAccountNumber,
                docTypeCode,
                // notHavingDocTypeCode,
                shareBy: sharedBy,
                shareWith: sharedWith,
                docGroupCode,
                modifiedDateFrom,
                modifiedDateTo,
                receiveDateFrom,
                receiveDateTo,
                shareDateFrom,
                shareDateTo,
                portfolioId
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
    docGroupCode,
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
                docGroupCode,
                textSearch
            }
        )
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document: any) => {
            // let doc = document?.objectKey?.split("/")
            document.selected = false
            document.fileSizeOriginal = document.fileSize
            document.fileSize = formatBytes(document.fileSize)
            let split = document.filePath.split('/')
            let UniqueIdentifier = document.documentUniqueIdentifierValue
            let orgCode = split[1]
            let docType = document.documentType
            let generationDate = document.generateDate
            if (accountNumber !== 'Other') {

                let name = document.documentName.replace(UniqueIdentifier, '').replace(orgCode, '').replace(docType, '').replace(generationDate, '').replace('-', '').replace('_', '').replace(/s/g, '')
                let formattedName = `${orgCode}-${docType}-`
                if (generationDate) {
                    let date = (new Date(generationDate)).getDate()
                    let month = (new Date(generationDate)).getMonth()
                    let year = (new Date(generationDate)).getFullYear()

                    formattedName += `${year}${date <= 9 ? `0${date}` : date}${month <= 9 ? `0${month}` : month}-`
                }
                formattedName += `${UniqueIdentifier}-${name.trim()}`
                // document.name = document.documentName
                document.name = formattedName
            } else {
                document.name = document.documentName
            }
            // if (doc) {
            //     document.documentName = doc[doc.length - 1]
            // }
            return { ...document.attributes, ...document }
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
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/download/folder`, {
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
        const response: AxiosResponse = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/download/file`, {
            documentIds
        })
        const data = handleResponse(response)
        if (typeof data.response === 'object') return data.response[0]
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const moveDocument = async (payload: any) => {
    try {
        const response: AxiosResponse = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/move`,
            payload
        )
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const myDocumentsService = {
    getMyDocumentFolders,
    getMyDocumentFoldersTextSearch,
    getMyDocumentFoldersAdvanceSearch,
    getMyDocumentList,
    deleteDocument,
    deleteFolder,
    downloadDocument,
    downloadFolder,
    moveDocument
}