import {
    GetReceiveDocumentRequest,
    DownloadDocumentRequest,
    DeleteReceiveDocumentRequest
} from "../types.d";
import { receiveDocumentRequest } from "../../services"

export const ReceiveDocumentRequestActionCreator = {
    getReceiveDocumentRequest: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: GetReceiveDocumentRequest.GET_RECEIVE_DOCUMENT_REQUEST_REQUEST })
        const success = (sent: any) => ({ type: GetReceiveDocumentRequest.GET_RECEIVE_DOCUMENT_REQUEST_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: GetReceiveDocumentRequest.GET_RECEIVE_DOCUMENT_REQUEST_FAILURE, payload: error })

        dispatch(request())

        receiveDocumentRequest.getReceiveDocumentRequest(requestPayload)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    DownloadDocumentRequest: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_REQUEST })
        const success = (sent: any) => ({ type: DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_FAILURE, payload: error })

        dispatch(request())

        receiveDocumentRequest.downloadDocumentRequest(requestPayload)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_RESET }))
    },
    deleteDocumentRequest: (id: any) => (dispatch: any) => {
        const request = () => ({ type: DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_REQUEST })
        const success = (sent: any) => ({ type: DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_FAILURE, payload: error })

        dispatch(request())

        receiveDocumentRequest.deleteReceiveDocumentRequest(id)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_RESET }))
    },
}