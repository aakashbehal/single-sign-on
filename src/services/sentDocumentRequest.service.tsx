
import { handleResponse, axiosCustom } from "../helpers/util"

const getSentDocumentRequest = async (userType) => {
    try {
        const response = await axiosCustom.get(`/requestReceive/sentDocuments`, { params: { userType } })
        const data = handleResponse(response)
        let sentRequests = data.response.datas
        const responseModified: any = {}
        responseModified.sentRequests = sentRequests
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}


export const sentDocumentRequestService = {
    getSentDocumentRequest
}