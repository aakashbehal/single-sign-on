import { GetSentDocumentRequest, SentDocumentRequest, DeleteDocumentRequest } from "../types.d";
import { sentDocumentRequestService } from "../../services"

export const SentDocumentRequestActionCreator = {
    getSentDocumentRequest: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: GetSentDocumentRequest.GET_SENT_DOCUMENT_REQUEST_REQUEST })
        const success = (sent: any) => ({ type: GetSentDocumentRequest.GET_SENT_DOCUMENT_REQUEST_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: GetSentDocumentRequest.GET_SENT_DOCUMENT_REQUEST_FAILURE, payload: error })

        dispatch(request())

        sentDocumentRequestService.getSentDocumentRequest(requestPayload)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    sentDocumentRequest: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: SentDocumentRequest.SENT_DOCUMENT_REQUEST_REQUEST })
        const success = (sent: any) => ({ type: SentDocumentRequest.SENT_DOCUMENT_REQUEST_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: SentDocumentRequest.SENT_DOCUMENT_REQUEST_FAILURE, payload: error })

        dispatch(request())

        sentDocumentRequestService.sentDocumentRequest(requestPayload)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: SentDocumentRequest.SENT_DOCUMENT_REQUEST_RESET }))
    },
    deleteDocumentRequest: (id: any) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_REQUEST })
        const success = (sent: any) => ({ type: DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_FAILURE, payload: error })

        dispatch(request())

        sentDocumentRequestService.deleteDocumentRequest(id)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_RESET }))
    },
}