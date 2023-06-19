
import { handleResponse, axiosCustom } from "../helpers/util"

const getNotifications = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/notification/all`, {
            pageSize,
            pageNumber,
            sortOrder,
            sortParam
        })
        const data = handleResponse(response)
        let notifications = data.response.notifications
        const responseModified: any = {}
        responseModified.notifications = notifications
        responseModified.totalCount = data.response.metadata.totalCount
        responseModified.pageNumber = data.response.metadata.pageNumber
        responseModified.unread = data.response.metadata.unread
        responseModified.columns = data.response.metadata.columns
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const readNotifications = async () => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/notification/read`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const notificationService = {
    getNotifications,
    readNotifications
}