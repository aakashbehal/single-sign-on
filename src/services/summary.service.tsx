
import { handleResponse, axiosCustom, formatBytes } from "../helpers/util"

// const getReceiveSummary = async () => {
//     try {
//         const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/receiveDocumentRequest/summary`)
//         const data = handleResponse(response)
//         return data.response
//     } catch (error: any) {
//         throw error
//     }
// }

const getSentSummary = async ({
    duration,
    product,
    portfolio,
    userId
}) => {
    console.log(`called`)
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/request/summary`, {
            duration,
            product,
            portfolio,
            userId
        })
        const data = handleResponse(response)
        let modifiedData = {
            sent: (data.response.filter((d) => {
                if (d.name === 'sentDocumentSummary') {
                    console.log(d)
                    return d
                } else return false
            }))[0].summary,
            received: (data.response.filter((d) => {
                if (d.name === 'receiveDocumentSummary') {
                    return d
                } else return false
            }))[0].summary
        }
        return modifiedData
    } catch (error: any) {
        console.log(error)
        throw error
    }
}

const getDocumentCoverage = async ({
    duration,
    product,
    portfolio,
    userId
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/summary/coverage`, {
            duration,
            product,
            portfolio,
            userId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
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
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/summary/accounts`, {
            pageSize,
            pageNumber: pageNumber - 1,
            sortOrder,
            sortParam,
            docTypeCode,
            specificDocument,
            tenture: duration === 'null' ? null : duration,
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
        responseModified.documents = documents.map((document) => {
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
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL_DOCUMENT_MANAGER}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/summary/accounts/not`, {
            pageSize,
            pageNumber: pageNumber - 1,
            sortOrder,
            sortParam,
            docTypeCode,
            specificDocument,
            tenture: duration === 'null' ? null : duration,
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
        responseModified.documents = documents.map((document) => {
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
        responseModified.columns = data.response.metadata.columns
        return responseModified
    } catch (error: any) {
        throw error
    }
}



export const summaryService = {
    // getReceiveSummary,
    getSentSummary,
    getDocumentCoverage,
    getSummaryDrillDown,
    getSummaryDrillDownNot
}