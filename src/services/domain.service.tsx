
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllDomains = async ({ pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain/all`, {
            pageSize,
            pageNumber,
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

const addDomain = async ({
    domainName,
    domainShortCode,
    description
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain`, {
            domainName,
            domainShortCode,
            description
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDomain = async (id: number) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain/${id}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getDomainByCode = async (shortCode: string) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain/byShortCode`, {
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

export const domainService = {
    getAllDomains,
    addDomain,
    deleteDomain,
    getDomainByCode
}