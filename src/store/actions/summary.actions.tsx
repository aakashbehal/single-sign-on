import {
    RequestedDocumentSummary,
    SentDocumentSummary,
    ReRender
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
    reRender: () => (dispatch: any) => {
        dispatch({ type: ReRender.RE_RENDER_REQUEST })
        setTimeout(() => {
            dispatch({ type: ReRender.RE_RENDER_RESET })
        }, 1000)
    }
}