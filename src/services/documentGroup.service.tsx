
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllDocumentGroup = async ({ pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group/all`, {
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

const addDocumentGroup = async ({
    name,
    domainCode,
    description
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group`, {
            name,
            domainCode,
            description
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const updateDocumentGroup = async ({
    name,
    domainCode,
    description,
    docGroupId
}: any) => {
    try {
        const response = await axiosCustom.put(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group`, {
            name,
            domainCode,
            description,
            docGroupId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentGroup = async (id: number) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group/${id}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getDocumentGroupByCode = async (shortCode: string) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group/byShortCode`, {
            params: {
                shortCode
            }
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const documentGroupService = {
    getAllDocumentGroup,
    addDocumentGroup,
    deleteDocumentGroup,
    updateDocumentGroup,
    getDocumentGroupByCode
}