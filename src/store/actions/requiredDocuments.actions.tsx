import { RequiredDocuments, SaveRequiredDocuments, DeleteRequiredDocuments } from "../types.d";
import { requiredDocumentService } from "../../services"

export const RequiredDocumentActionCreator = {
    getRequiredDocuments: () => (dispatch: any) => {
        const request = () => ({ type: RequiredDocuments.REQUIRED_DOCUMENTS_REQUEST })
        const success = (costs: any) => ({ type: RequiredDocuments.REQUIRED_DOCUMENTS_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: RequiredDocuments.REQUIRED_DOCUMENTS_FAILURE, payload: error })

        dispatch(request())

        requiredDocumentService.getRequiredDocuments()
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    saveRequiredDocuments: (requestData: any) => (dispatch: any) => {
        const request = () => ({ type: SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_REQUEST })
        const success = (costs: any) => ({ type: SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_FAILURE, payload: error })

        dispatch(request())

        requiredDocumentService.saveRequiredDocuments(requestData)
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_RESET }))
    },
    deleteRequiredDocuments: (id: any) => (dispatch: any) => {
        const request = () => ({ type: DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_REQUEST })
        const success = (costs: any) => ({ type: DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_FAILURE, payload: error })

        dispatch(request())

        requiredDocumentService.deleteRequiredDocuments(id)
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_RESET }))
    }
}