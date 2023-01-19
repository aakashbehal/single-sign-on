import { SentDocumentRequest } from "../types.d";

const initialState = {
    data: [],
    totalCount: 0,
    error: false,
    loading: false
}

const sentDocumentRequestReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.sentRequests,
                totalCount: action.payload.totalCount
            }
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
                totalCount: 0
            }
        case SentDocumentRequest.SENT_DOCUMENT_REQUEST_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                totalCount: 0
            }
        default:
            return state
    }
}

export default sentDocumentRequestReducer;