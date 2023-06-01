
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
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/folders`,
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
    receiveDateTo,
    textSearch
}: any) => {
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
            // if (doc) {
            //     document.documentName = doc[doc.length - 1]
            // }
            return document
        })
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.columns = data.response.metadata.columns
        return responseModified
    } catch (error: any) {
        console.log(error)
        throw error
    }
}

const deleteDocument = async (documentId: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/${documentId}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const deleteFolder = async (clientAccountNo: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/folder/${clientAccountNo}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const myDocumentsService = {
    getMyDocumentFolders,
    getMyDocumentList,
    deleteDocument,
    deleteFolder
}