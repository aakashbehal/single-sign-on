import { SentDocumentRequest } from "../types.d";
import { sentDocumentRequestService } from "../../services"

export const SentDocumentRequestActionCreator = {
    getSentDocumentRequest: (userType) => (dispatch: any) => {
        const request = () => ({ type: SentDocumentRequest.SENT_DOCUMENT_REQUEST_REQUEST })
        const success = (sent: any) => ({ type: SentDocumentRequest.SENT_DOCUMENT_REQUEST_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: SentDocumentRequest.SENT_DOCUMENT_REQUEST_FAILURE, payload: error })

        dispatch(request())

        sentDocumentRequestService.getSentDocumentRequest(userType)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
}