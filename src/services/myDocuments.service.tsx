
import { handleResponse, axiosCustom } from "../helpers/util"

const getMyDocumentFolders = async ({
    pageSize,
    pageNumber,
    orgType
}) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/folders`,
            {
                params: {
                    pageSize,
                    pageNumber: 0,
                    orgType
                }
            })
        const data = handleResponse(response)
        let folders = data.response.datas
        const responseModified: any = {}
        responseModified.folders = folders.map((folder) => {
            folder.selected = false
            return folder
        })
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}

const getMyDocumentList = async ({
    pageSize,
    pageNumber,
    accountNumber,
    orgType
}) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document`,
            { params: { accountNumber, orgType, pageSize, pageNumber: 0 } }
        )
        const data = handleResponse(response)
        let documents = data.response.datas
        const responseModified: any = {}
        responseModified.documents = documents.map((document) => {
            document.selected = false
            return document
        })
        responseModified.totalCount = data.response.metadata.recordCount
        return responseModified
    } catch (error: any) {
        throw error
    }
}

export const myDocumentsService = {
    getMyDocumentFolders,
    getMyDocumentList
}