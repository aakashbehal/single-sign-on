import { GetSentDocumentRequest, SentDocumentRequest, DeleteDocumentRequest } from "../types.d";

const initialState = {
    data: [],
    columns: [],
    totalCount: 0,
    error: false,
    loading: false,
    sendRequest: false,
    sendRequestSuccess: false,
    sendRequestError: false,
    deleteRequest: false,
    deleteRequestSuccess: false,
    deleteRequestError: false

}

const sentDocumentRequestReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetSentDocumentRequest.GET_SENT_DOCUMENT_REQUEST_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case GetSentDocumentRequest.GET_SENT_DOCUMENT_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.sentRequests,
                columns: action.payload.columns,
                totalCount: action.payload.totalCount
            }
        case GetSentDocumentRequest.GET_SENT_DOCUMENT_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
                totalCount: 0
            }
        case GetSentDocumentRequest.GET_SENT_DOCUMENT_REQUEST_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                columns: [],
                totalCount: 0
            }
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_REQUEST:
            return {
                ...state,
                sendRequest: true,
                sendRequestSuccess: false,
                sendRequestError: false
            }
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_SUCCESS:
            return {
                ...state,
                sendRequest: false,
                sendRequestSuccess: true,
                sendRequestError: false
            }
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_FAILURE:
            return {
                ...state,
                sendRequest: false,
                sendRequestSuccess: false,
                sendRequestError: true
            }
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_RESET:
            return {
                ...state,
                sendRequest: false,
                sendRequestSuccess: false,
                sendRequestError: false
            }
        case DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_REQUEST:
            return {
                ...state,
                deleteRequest: true,
                deleteRequestSuccess: false,
                deleteRequestError: false
            }
        case DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_SUCCESS:
            return {
                ...state,
                deleteRequest: false,
                deleteRequestSuccess: true,
                deleteRequestError: false
            }
        case DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_FAILURE:
            return {
                ...state,
                deleteRequest: false,
                deleteRequestSuccess: false,
                deleteRequestError: true
            }
        case DeleteDocumentRequest.DELETE_DOCUMENT_REQUEST_RESET:
            return {
                ...state,
                deleteRequest: false,
                deleteRequestSuccess: false,
                deleteRequestError: false
            }
        default:
            return state
    }
}

export default sentDocumentRequestReducer;