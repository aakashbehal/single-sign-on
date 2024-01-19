
import { handleResponse, axiosCustom } from "../helpers/util"

const getNotifications = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_NOTIFICATION_SERVICE}/webnotification/all`, {
            pageSize,
            pageNumber,
            sortOrder,
            sortParam
        })
        const data = handleResponse(response)
        let notifications = data.response.datas
        const responseModified: any = {}
        responseModified.notifications = notifications
        responseModified.totalCount = data.response.metadata.totalNotification
        responseModified.pageNumber = data.response.metadata.pageNumber
        responseModified.unread = data.response.metadata.unreadNotification
        responseModified.columns = data.response.metadata.columnPreferences
        // .map((column:
        //     {
        //         sequence: number,
        //         displayName: string,
        //         attributeNodeKey: string,
        //         attributeCode: string
        //     }
        // ) => {
        //     return column.attributeNodeKey
        // })
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const readNotifications = async () => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_NOTIFICATION_SERVICE}/webnotification/read`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const notificationService = {
    getNotifications,
    readNotifications
}