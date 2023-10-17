
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllDocumentAttributes = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docAttribute`,)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const addUpdateDocumentAttribute = async ({
    prefDocAttribute
}: { prefDocAttribute: { docGroupConfigCode: string, attributeCode: string }[] }) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docAttribute`, {
            prefDocAttribute
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const addNewDocumentAttribute = async ({
    shortCode,
    name,
    docGroupConfigCode,
    type
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docAttribute/add`, {
            shortCode,
            name,
            docGroupConfigCode,
            type
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentAttribute = async (id: number) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docAttribute`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const documentAttributeService = {
    getAllDocumentAttributes,
    addUpdateDocumentAttribute,
    deleteDocumentAttribute,
    addNewDocumentAttribute,
}