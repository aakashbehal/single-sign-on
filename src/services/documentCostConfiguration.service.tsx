
import { handleResponse, axiosCustom } from "../helpers/util"

const getDocumentCost = async (userType) => {
    try {
        const response = await axiosCustom.get(`/document/costs`, { params: { userType } })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}


export const documentCostConfigurationService = {
    getDocumentCost
}