
import { handleResponse, axiosCustom } from "../helpers/util"
import { userService } from "./user.service"

const getAllDocumentGroup = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const user = userService.getUser()
        let userType = user.recordSource
        if (userType !== 'Equabli') {
            const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docGroup`)
            const data = handleResponse(response)
            return { domains: data.response }
        } else {
            const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group/search`, {
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
        }

    } catch (error: any) {
        throw error.message
    }
}

const addDocumentGroup = async ({
    name,
    description,
    domainCode,
    code,
    docGroupConfigCode,
    orgType
}: any) => {
    try {
        let url = ''
        if (orgType === 'Equabli') {
            url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group`
        } else {
            url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docGroup`
        }
        const response = await axiosCustom.post(url, {
            name,
            description,
            domainCode,
            code,
            docGroupConfigCode
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
    docGroupId,
    code
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group`, {
            name,
            domainCode,
            description,
            docGroupId,
            code
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentGroup = async (id: number, orgType: string) => {
    try {
        let url = ''
        if (orgType === 'Equabli') {
            url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/document/group/${id}`
        } else {
            url = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docGroup/${id}`
        }
        const response = await axiosCustom.patch(url, {
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

const getUniqueDocumentGroup = async (shortCode: string) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pre/docGroup/unique`)
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
    getDocumentGroupByCode,
    getUniqueDocumentGroup
}