
import { handleResponse, axiosCustom } from "../helpers/util"

interface IDocTypePref {
    code: string
    description: string
    externalDocNames: string
    externalDocTypeCodes: string
    fileExtension: string
    name: string
    prefId: string
    id: string
    docGroupConfigCode: string
    docGroupConfigName: string
}

const getAllDocumentTypePreference = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
    docGroupConfigCode
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docType/search`, {
            pageSize,
            pageNumber: pageNumber - 1,
            sortOrder,
            sortParam,
            docGroupConfigCode
        })
        const data = handleResponse(response)
        let docTypePref = data.response.datas
        const responseModified: any = {}
        let modifiedResponse: any = []
        docTypePref.forEach((dT: IDocTypePref) => {
            // dT.docTypes.forEach((dTypes: IDocTypePref) => {
            modifiedResponse.push({
                docGroupConfigCode: dT.docGroupConfigCode,
                docGroupConfigName: dT.docGroupConfigName,
                code: dT.code,
                description: dT.description,
                externalDocNames: dT.externalDocNames ? JSON.parse(dT.externalDocNames) : [],
                externalDocTypeCodes: dT.externalDocTypeCodes ? JSON.parse(dT.externalDocTypeCodes) : [],
                fileExtension: dT.fileExtension,
                name: dT.name,
                prefId: dT.id
            })
            // })
        })
        responseModified.docTypePref = modifiedResponse
        responseModified.totalCount = data.response.metadata.recordCount
        responseModified.columns = data.response.metadata.columnPreferences
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const addDocumentTypePreference = async (payload: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docType`, payload)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const updateDocumentTypePreference = async (docTypePrefId: any, payload: any) => {
    try {
        const response = await axiosCustom.put(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docType/${docTypePrefId}`, payload)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteDocumentTypePreference = async (orgDocTypePrefId: any) => {
    console.log(`---orgDocTypePrefId--`, orgDocTypePrefId)
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/pref/docType/${orgDocTypePrefId}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const documentTypePreference = {
    getAllDocumentTypePreference,
    addDocumentTypePreference,
    deleteDocumentTypePreference,
    updateDocumentTypePreference
}