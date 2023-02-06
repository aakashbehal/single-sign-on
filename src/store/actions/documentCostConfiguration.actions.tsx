import { DocumentsCost, SaveDocumentsCost, DeleteDocumentsCost } from "../types.d";
import { documentCostConfigurationService } from "../../services"

export const DocumentCostConfigActionCreator = {
    getDocumentCost: (userType) => (dispatch: any) => {
        const request = () => ({ type: DocumentsCost.DOCUMENTS_COST_REQUEST })
        const success = (costs: any) => ({ type: DocumentsCost.DOCUMENTS_COST_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: DocumentsCost.DOCUMENTS_COST_FAILURE, payload: error })

        dispatch(request())

        documentCostConfigurationService.getDocumentCost(userType)
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    saveDocumentCost: (payload) => (dispatch: any) => {
        const request = () => ({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_REQUEST })
        const success = (costs: any) => ({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_FAILURE, payload: error })

        dispatch(request())

        documentCostConfigurationService.saveDocumentCost(payload)
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_RESET }))
    },

    editDocumentCost: (payload) => (dispatch: any) => {
        const request = () => ({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_REQUEST })
        const success = (costs: any) => ({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_FAILURE, payload: error })

        dispatch(request())

        documentCostConfigurationService.saveDocumentCost(payload)
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    deleteDocumentCost: (docTypeCode) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_REQUEST })
        const success = (costs: any) => ({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_FAILURE, payload: error })

        dispatch(request())

        documentCostConfigurationService.deleteDocumentCost(docTypeCode)
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_RESET }))
    },
}