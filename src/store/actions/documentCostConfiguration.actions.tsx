import { DocumentsCost, SaveDocumentsCost, DeleteDocumentsCost } from "../types.d";
import { documentCostConfigurationService } from "../../services"

export const DocumentCostConfigActionCreator = {
    getDocumentCost: (userType: any) => (dispatch: any) => {
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

    saveDocumentCost: (payload: any) => (dispatch: any) => {
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
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_RESET })
                }, 0)
            })
    },

    editDocumentCost: (payload: any) => (dispatch: any) => {
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
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: SaveDocumentsCost.SAVE_DOCUMENTS_COST_RESET })
                }, 0)
            })
    },

    deleteDocumentCost: (id: any) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_REQUEST })
        const success = (costs: any) => ({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_FAILURE, payload: error })

        dispatch(request())

        documentCostConfigurationService.deleteDocumentCost(id)
            .then(
                costs => {
                    dispatch(success(costs))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteDocumentsCost.DELETE_DOCUMENTS_COST_RESET })
                }, 0)
            })
    },
}