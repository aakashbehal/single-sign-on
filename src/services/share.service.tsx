
import { handleResponse, axiosCustom } from "../helpers/util"

const shareFolder = async (payload: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/share/folder`, payload)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const revokeShareFolder = async (payload: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/share/folder`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const shareDocument = async (payload: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/share/file`, payload)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const revokeShareDocument = async (payload: any) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/share/file/${payload.email}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const shareService = {
    shareFolder,
    revokeShareFolder,
    shareDocument,
    revokeShareDocument
}