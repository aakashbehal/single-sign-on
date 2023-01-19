import { handleResponse, axiosCustom } from "../helpers/util"

const getRequiredDocuments = async (requestData) => {
    try {
        const response = await axiosCustom.get(`/document/requiredDocuments`, { params: requestData })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const requiredDocumentService = {
    getRequiredDocuments
}