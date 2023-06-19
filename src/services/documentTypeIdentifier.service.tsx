import { axiosCustom, handleResponse } from "../helpers/util"
import { IIdentifier } from "../interfaces/documentTypeIdentifier.interface"

const getAllIdentifiers = async ({
    pageSize,
    pageNumber
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/identification/all`, {
            pageSize,
            pageNumber: pageNumber
        })
        const data = handleResponse(response)
        let identifiers = data.response.datas
        const responseModified: any = {}
        responseModified.identifiers = identifiers
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const addDocumentCostIdentifier = async (requestBody: IIdentifier) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/identification`, requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const deleteDocumentCostIdentifier = async (docTypeCode: string) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/identification/${docTypeCode}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}


export const documentTypeIdentifierService = {
    getAllIdentifiers,
    addDocumentCostIdentifier,
    deleteDocumentCostIdentifier
}