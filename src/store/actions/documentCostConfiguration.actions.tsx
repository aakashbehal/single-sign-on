import { DocumentsCost } from "../types.d";
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
}