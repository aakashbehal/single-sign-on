
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllDocumentTypePreference = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/docType/preference/search`, {
            pageSize,
            pageNumber: pageNumber - 1,
            sortOrder,
            sortParam
        })
        const data = handleResponse(response)
        let domains = data.response.datas
        const responseModified: any = {}
        responseModified.domains = domains
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.columns = data.response.metadata.columnPreferences
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const addDocumentTypePreference = async ({
    docTypeCode,
    docGroupCode,
    fileExtension,
    externalDocTypeCode,
    externalDocName
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/docType/preference`, {
            docTypeCode,
            docGroupCode,
            fileExtension,
            externalDocTypeCode,
            externalDocName
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentTypePreference = async ({
    orgDocTypePrefId
}: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/docType/preference`, {}, { orgDocTypePrefId })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const documentTypePreference = {
    getAllDocumentTypePreference,
    addDocumentTypePreference,
    deleteDocumentTypePreference
}