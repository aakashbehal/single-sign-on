import {
    RequestedDocumentSummary,
    SentDocumentSummary,
    ReRender
} from "../types.d";

const initialState = {
    requestedSummary: {},
    sentSummary: {},
    errorSent: false,
    loadingSent: false,
    loadingRequest: false,
    errorRequest: false,
    reRender: false
}

const summaryReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_REQUEST:
            return {
                ...state,
                loadingRequest: true,
                errorRequest: null
            }
        case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_SUCCESS:
            return {
                ...state,
                loadingRequest: false,
                requestedSummary: action.payload
            }
        case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_FAILURE:
            return {
                ...state,
                loadingRequest: false,
                errorRequest: true,
                requestedSummary: {}
            }
        case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_RESET:
            return {
                ...state,
                loadingRequest: false,
                errorRequest: false,
                requestedSummary: {}
            }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_REQUEST:
            return {
                ...state,
                loadingSent: true,
                errorSent: null
            }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_SUCCESS:
            return {
                ...state,
                loadingSent: false,
                sentSummary: action.payload
            }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_FAILURE:
            return {
                ...state,
                loadingSent: false,
                errorSent: true,
                sentSummary: {}
            }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_RESET:
            return {
                ...state,
                loadingSent: false,
                errorSent: false,
                sentSummary: {}
            }
        case ReRender.RE_RENDER_REQUEST:
            return {
                ...state,
                reRender: true
            }
        case ReRender.RE_RENDER_RESET:
            return {
                ...state,
                reRender: false
            }
        default:
            return state
    }
}

export default summaryReducer;