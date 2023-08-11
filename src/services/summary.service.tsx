
import { handleResponse, axiosCustom, formatBytes } from "../helpers/util"

// const getReceiveSummary = async () => {
//     try {
//         const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/receiveDocumentRequest/summary`)
//         const data = handleResponse(response)
//         return data.response
//     } catch (error: any) {
//         throw error.message
//     }
// }

const getSentSummary = async ({
    duration,
    product,
    portfolio,
    userId
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/send/analytics`, {
            duration,
            product,
            portfolio,
            userId
        })
        const data = handleResponse(response)
        let modifiedData = {
            sent: (data.response.filter((d: any) => {
                if (d.name === 'sentDocumentSummary') {
                    return d
                } else return false
            }))[0].summary,
            received: (data.response.filter((d: any) => {
                if (d.name === 'receiveDocumentSummary') {
                    return d
                } else return false
            }))[0].summary
        }
        return modifiedData
    } catch (error: any) {
        throw error.message
    }
}

const getDocumentCoverage = async ({
    duration,
    product,
    portfolio,
    userId
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/summary/coverage`, {
            duration,
            product,
            portfolio,
            userId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getSummaryDrillDown = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
    docTypeCode,
    specificDocument,
    duration,
    portfolio,
    product,
    userId,
    documentName,
    originalAccountNumber,
    equabliAccountNumber,
    clientAccountNumber,
    textSearch,
    generationDateFrom,
    generationDateTo,
    uploadDateFrom,
    uploadDateTo
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/summary/accounts`, {
            pageSize,
            pageNumber: pageNumber - 1,
            sortOrder,
            sortParam,
            docTypeCode,
            specificDocument,
            tenure: duration === 'null' ? null : duration,
            portfolio: portfolio === 'null' ? null : portfolio,
            productCode: product === 'null' ? null : product,
            userId: userId === 'null' ? null : userId,
            documentName,
            originalAccountNumber,
            equabliAccountNumber,
            clientAccountNumber,
            textSearch,
            generationDateFrom,
            generationDateTo,
            uploadDateFrom,
            uploadDateTo
        })
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document: any) => {
            document.fileSizeOriginal = document.fileSize
            document.fileSize = formatBytes(document.fileSize)
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

const getSummaryDrillDownNot = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
    docTypeCode,
    specificDocument,
    duration,
    portfolio,
    product,
    userId,
    documentName,
    originalAccountNumber,
    equabliAccountNumber,
    clientAccountNumber,
    textSearch,
    generationDateFrom,
    generationDateTo,
    uploadDateFrom,
    uploadDateTo
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/summary/accounts/not`, {
            pageSize,
            pageNumber: pageNumber - 1,
            sortOrder,
            sortParam,
            docTypeCode,
            specificDocument,
            tenure: duration === 'null' ? null : duration,
            portfolio: portfolio === 'null' ? null : portfolio,
            productCode: product === 'null' ? null : product,
            userId: userId === 'null' ? null : userId,
            documentName,
            originalAccountNumber,
            equabliAccountNumber,
            clientAccountNumber,
            textSearch,
            generationDateFrom,
            generationDateTo,
            uploadDateFrom,
            uploadDateTo
        })
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document: any) => {
            const obj = {
                clientAccountNumber: document,
                originalAccountNumber: null,
                equabliAccountNumber: null,
                fileName: null,
                generateDate: null,
                uploadDate: null
            }
            return obj
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



export const summaryService = {
    // getReceiveSummary,
    getSentSummary,
    getDocumentCoverage,
    getSummaryDrillDown,
    getSummaryDrillDownNot
}