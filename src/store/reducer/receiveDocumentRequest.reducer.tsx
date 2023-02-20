import {
    GetReceiveDocumentRequest,
    DownloadDocumentRequest,
    DeleteReceiveDocumentRequest
} from "../types.d";

const initialState = {
    data: [],
    columns: [],
    totalCount: 0,
    error: false,
    loading: false,
    downloadRequest: false,
    downloadRequestSuccess: false,
    downloadRequestError: false,
    deleteRequest: false,
    deleteRequestSuccess: false,
    deleteRequestError: false
}

const receiveDocumentRequestReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetReceiveDocumentRequest.GET_RECEIVE_DOCUMENT_REQUEST_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case GetReceiveDocumentRequest.GET_RECEIVE_DOCUMENT_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.sentRequests,
                totalCount: action.payload.totalCount,
                columns: action.payload.columns
            }
        case GetReceiveDocumentRequest.GET_RECEIVE_DOCUMENT_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
                totalCount: 0
            }
        case GetReceiveDocumentRequest.GET_RECEIVE_DOCUMENT_REQUEST_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                columns: [],
                totalCount: 0
            }
        case DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_REQUEST:
            return {
                ...state,
                downloadRequest: true,
                downloadRequestSuccess: false,
                downloadRequestError: false
            }
        case DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_SUCCESS:
            return {
                ...state,
                downloadRequest: false,
                downloadRequestSuccess: true,
                downloadRequestError: false
            }
        case DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_FAILURE:
            return {
                ...state,
                downloadRequest: false,
                downloadRequestSuccess: false,
                downloadRequestError: true
            }
        case DownloadDocumentRequest.DOWNLOAD_DOCUMENT_REQUEST_RESET:
            return {
                ...state,
                downloadRequest: false,
                downloadRequestSuccess: false,
                downloadRequestError: false
            }
        case DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_REQUEST:
            return {
                ...state,
                deleteRequest: true,
                deleteRequestSuccess: false,
                deleteRequestError: false
            }
        case DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_SUCCESS:
            return {
                ...state,
                deleteRequest: false,
                deleteRequestSuccess: true,
                deleteRequestError: false
            }
        case DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_FAILURE:
            return {
                ...state,
                deleteRequest: false,
                deleteRequestSuccess: false,
                deleteRequestError: true
            }
        case DeleteReceiveDocumentRequest.DELETE_RECEIVE_DOCUMENT_REQUEST_RESET:
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

export default receiveDocumentRequestReducer;