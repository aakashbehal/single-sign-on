
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllDomains = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain`)
        const data = handleResponse(response)
        return data.response
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

const updateDomain = async ({
    domainName,
    domainShortCode,
    description,
    domainId
}: any) => {
    try {
        const response = await axiosCustom.put(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain`, {
            domainName,
            domainShortCode,
            description,
            domainId
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDomain = async (id: number) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain/${id}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getDomainByCode = async (shortCode: string) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/domain/byDomainCode`, {
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
    getDomainByCode,
    updateDomain
}