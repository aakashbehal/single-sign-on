import { RequiredDocuments } from "../types.d";
import { requiredDocumentService } from "../../services"

export const RequiredDocumentActionCreator = {
    getRequiredDocuments: (userType) => (dispatch: any) => {
        const request = () => ({ type: RequiredDocuments.REQUIRED_DOCUMENTS_REQUEST })
        const success = (costs: any) => ({ type: RequiredDocuments.REQUIRED_DOCUMENTS_SUCCESS, payload: costs })
        const failure = (error: any) => ({ type: RequiredDocuments.REQUIRED_DOCUMENTS_FAILURE, payload: error })

        dispatch(request())

        requiredDocumentService.getRequiredDocuments(userType)
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