import {
    GetAllDocumentAttribute,
    AddDocumentAttribute,
    AddNewDocumentAttribute,
    UpdateDocumentAttribute,
    DeleteDocumentAttribute
} from "../types.d"
import { documentAttributeService } from "../../services"

export const DocumentAttributeActionCreator = {
    getAllDocumentAttribute: () => (dispatch: any) => {
        const request = () => ({ type: GetAllDocumentAttribute.GET_ALL_DOCUMENT_ATTRIBUTE_REQUEST })
        const success = (domains: any) => ({ type: GetAllDocumentAttribute.GET_ALL_DOCUMENT_ATTRIBUTE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: GetAllDocumentAttribute.GET_ALL_DOCUMENT_ATTRIBUTE_FAILURE, payload: error })

        dispatch(request())

        documentAttributeService.getAllDocumentAttributes()
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    addDocumentAttribute: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_REQUEST })
        const success = (domains: any) => ({ type: AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_FAILURE, payload: error })

        dispatch(request())

        documentAttributeService.addUpdateDocumentAttribute(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_RESET })
                }, 0)
            )
    },
    updateDocumentAttribute: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_REQUEST })
        const success = (domains: any) => ({ type: UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_FAILURE, payload: error })

        dispatch(request())

        documentAttributeService.addUpdateDocumentAttribute(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_RESET })
                }, 0)
            )
    },
    deleteDocumentAttribute: (id: number) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_REQUEST })
        const success = (domains: any) => ({ type: DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_FAILURE, payload: error })

        dispatch(request())

        documentAttributeService.deleteDocumentAttribute(id)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_RESET })
                }, 0)
            })
    },
    addNewDocumentAttribute: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_REQUEST })
        const success = (domains: any) => ({ type: AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_FAILURE, payload: error })

        dispatch(request())

        documentAttributeService.addNewDocumentAttribute(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_RESET })
                }, 0)
            )
    },
}