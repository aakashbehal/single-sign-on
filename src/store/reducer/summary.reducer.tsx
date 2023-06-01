import {
    RequestedDocumentSummary,
    SentDocumentSummary,
    DocumentCoverage,
    ReRender,
    DocumentSummaryDocuments,
    DocumentSummaryDocumentsNot
} from "../types.d";

const initialState = {
    requestedSummary: {},
    sentSummary: {},
    errorSent: false,
    loadingSent: false,
    loadingRequest: false,
    errorRequest: false,
    reRender: false,
    documentCoverage: [],
    loadingCoverage: false,
    errorCoverage: false,
    summaryDocuments: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
        columns: []
    },
    summaryDocumentsNot: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
        columns: []
    }
}

const summaryReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        // case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_REQUEST:
        //     return {
        //         ...state,
        //         loadingRequest: true,
        //         errorRequest: null
        //     }
        // case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_SUCCESS:
        //     return {
        //         ...state,
        //         loadingRequest: false,
        //         requestedSummary: action.payload
        //     }
        // case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_FAILURE:
        //     return {
        //         ...state,
        //         loadingRequest: false,
        //         errorRequest: true,
        //         requestedSummary: {}
        //     }
        // case RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_RESET:
        //     return {
        //         ...state,
        //         loadingRequest: false,
        //         errorRequest: false,
        //         requestedSummary: {}
        //     }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_REQUEST:
            return {
                ...state,
                loadingSent: true,
                errorSent: null,
                loadingRequest: true,
                errorRequest: null
            }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_SUCCESS:
            return {
                ...state,
                loadingSent: false,
                sentSummary: action.payload.sent,
                loadingRequest: false,
                requestedSummary: action.payload.received
            }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_FAILURE:
            return {
                ...state,
                loadingSent: false,
                errorSent: true,
                sentSummary: {},
                loadingRequest: false,
                errorRequest: true,
                requestedSummary: {}
            }
        case SentDocumentSummary.SENT_DOCUMENT_SUMMARY_RESET:
            return {
                ...state,
                loadingSent: false,
                errorSent: false,
                sentSummary: {},
                loadingRequest: false,
                errorRequest: false,
                requestedSummary: {}
            }
        case DocumentCoverage.DOCUMENT_COVERAGE_REQUEST:
            return {
                ...state,
                loadingCoverage: true,
                errorCoverage: false,
            }
        case DocumentCoverage.DOCUMENT_COVERAGE_SUCCESS:
            return {
                ...state,
                documentCoverage: action.payload,
                loadingCoverage: false
            }
        case DocumentCoverage.DOCUMENT_COVERAGE_FAILURE:
            return {
                ...state,
                loadingCoverage: false,
                errorCoverage: true,
            }
        case DocumentCoverage.DOCUMENT_COVERAGE_RESET:
            return {
                ...state,
                documentCoverage: [],
                loadingCoverage: false,
                errorCoverage: false,
            }
        case DocumentSummaryDocuments.DOCUMENT_SUMMARY_DOCUMENTS_REQUEST:
            return {
                ...state,
                summaryDocuments: {
                    loading: true,
                    error: false
                }
            }
        case DocumentSummaryDocuments.DOCUMENT_SUMMARY_DOCUMENTS_SUCCESS:
            return {
                ...state,
                summaryDocuments: {
                    loading: false,
                    data: action.payload.documents,
                    totalCount: action.payload.totalCount,
                    columns: action.payload.columns
                }
            }
        case DocumentSummaryDocuments.DOCUMENT_SUMMARY_DOCUMENTS_FAILURE:
            return {
                ...state,
                summaryDocuments: {
                    loading: false,
                    error: true,
                    totalCount: 0,
                    data: []
                }
            }
        case DocumentSummaryDocuments.DOCUMENT_SUMMARY_DOCUMENTS_RESET:
            return {
                ...state,
                summaryDocuments: {
                    data: [],
                    loading: false,
                    error: false,
                    totalCount: 0,
                    columns: []
                }
            }
        case DocumentSummaryDocumentsNot.DOCUMENT_SUMMARY_DOCUMENTS_NOT_REQUEST:
            return {
                ...state,
                summaryDocumentsNot: {
                    loading: true,
                    error: false
                }
            }
        case DocumentSummaryDocumentsNot.DOCUMENT_SUMMARY_DOCUMENTS_NOT_SUCCESS:
            return {
                ...state,
                summaryDocumentsNot: {
                    loading: false,
                    data: action.payload.documents,
                    totalCount: action.payload.totalCount,
                    columns: action.payload.columns
                }
            }
        case DocumentSummaryDocumentsNot.DOCUMENT_SUMMARY_DOCUMENTS_NOT_FAILURE:
            return {
                ...state,
                summaryDocumentsNot: {
                    loading: false,
                    error: true,
                    totalCount: 0,
                    data: []
                }
            }
        case DocumentSummaryDocumentsNot.DOCUMENT_SUMMARY_DOCUMENTS_NOT_RESET:
            return {
                ...state,
                summaryDocumentsNot: {
                    data: [],
                    loading: false,
                    error: false,
                    totalCount: 0,
                    columns: []
                }
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