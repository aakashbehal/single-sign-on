import {
    GetAllDocumentTypePreference,
    AddDocumentTypePreference,
    DeleteDocumentTypePreference
} from "../types.d"
import { documentTypePreference } from "../../services"

export const DocumentTypePreferenceActionCreator = {
    getAllDocumentTypePreference: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: GetAllDocumentTypePreference.GET_ALL_DOCUMENT_TYPE_PREFERENCE_REQUEST })
        const success = (domains: any) => ({ type: GetAllDocumentTypePreference.GET_ALL_DOCUMENT_TYPE_PREFERENCE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: GetAllDocumentTypePreference.GET_ALL_DOCUMENT_TYPE_PREFERENCE_FAILURE, payload: error })

        dispatch(request())

        documentTypePreference.getAllDocumentTypePreference(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    addDocumentTypePreference: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_REQUEST })
        const success = (domains: any) => ({ type: AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_FAILURE, payload: error })

        dispatch(request())

        documentTypePreference.addDocumentTypePreference(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_RESET })
                }, 0)
            )
    },
    deleteDocumentTypePreference: (id: number) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_REQUEST })
        const success = (domains: any) => ({ type: DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_FAILURE, payload: error })

        dispatch(request())

        documentTypePreference.deleteDocumentTypePreference(id)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_RESET })
                }, 0)
            })
    }
}