import {
    RequestedDocumentSummary,
    SentDocumentSummary,
    ReRender,
    DocumentCoverage,
    DocumentSummaryDocuments,
    DocumentSummaryDocumentsNot
} from "../types.d";
import { summaryService } from "../../services"

export const SummaryActionCreator = {
    getReceiveSummary: () => (dispatch: any) => {
        const request = () => ({ type: RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_REQUEST, payload: [] })
        const success = (data: any) => ({ type: RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_SUCCESS, payload: data })
        const failure = () => ({ type: RequestedDocumentSummary.REQUESTED_DOCUMENT_SUMMARY_FAILURE, payload: [] })

        dispatch(request())

        summaryService.getReceiveSummary()
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    getSentSummary: () => (dispatch: any) => {
        const request = () => ({ type: SentDocumentSummary.SENT_DOCUMENT_SUMMARY_REQUEST, payload: [] })
        const success = (data: any) => ({ type: SentDocumentSummary.SENT_DOCUMENT_SUMMARY_SUCCESS, payload: data })
        const failure = () => ({ type: SentDocumentSummary.SENT_DOCUMENT_SUMMARY_FAILURE, payload: [] })

        dispatch(request())

        summaryService.getSentSummary()
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    getDocumentCoverage: (payload) => (dispatch: any) => {
        const request = () => ({ type: DocumentCoverage.DOCUMENT_COVERAGE_REQUEST, payload: [] })
        const success = (data: any) => ({ type: DocumentCoverage.DOCUMENT_COVERAGE_SUCCESS, payload: data })
        const failure = () => ({ type: DocumentCoverage.DOCUMENT_COVERAGE_FAILURE, payload: [] })

        dispatch(request())

        summaryService.getDocumentCoverage(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    resetDocumentSummary: () => (dispatch: any) => {
        dispatch({ type: DocumentCoverage.DOCUMENT_COVERAGE_RESET })
    },
    getSummaryDrillDown: (payload) => (dispatch: any) => {
        const request = () => ({ type: DocumentSummaryDocuments.DOCUMENT_SUMMARY_DOCUMENTS_REQUEST, payload: [] })
        const success = (data: any) => ({ type: DocumentSummaryDocuments.DOCUMENT_SUMMARY_DOCUMENTS_SUCCESS, payload: data })
        const failure = () => ({ type: DocumentSummaryDocuments.DOCUMENT_SUMMARY_DOCUMENTS_FAILURE, payload: [] })

        dispatch(request())

        summaryService.getSummaryDrillDown(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    getSummaryDrillDownNot: (payload) => (dispatch: any) => {
        const request = () => ({ type: DocumentSummaryDocumentsNot.DOCUMENT_SUMMARY_DOCUMENTS_NOT_REQUEST, payload: [] })
        const success = (data: any) => ({ type: DocumentSummaryDocumentsNot.DOCUMENT_SUMMARY_DOCUMENTS_NOT_SUCCESS, payload: data })
        const failure = () => ({ type: DocumentSummaryDocumentsNot.DOCUMENT_SUMMARY_DOCUMENTS_NOT_FAILURE, payload: [] })

        dispatch(request())

        summaryService.getSummaryDrillDownNot(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    reRender: () => (dispatch: any) => {
        dispatch({ type: ReRender.RE_RENDER_REQUEST })
        setTimeout(() => {
            dispatch({ type: ReRender.RE_RENDER_RESET })
        }, 1000)
    }
}