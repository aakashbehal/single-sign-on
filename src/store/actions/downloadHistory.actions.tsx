import {
    GetDownloadHistory,
    SaveDownloadHistory,
    DeleteDownloadHistory
} from "../types.d";
import { downloadHistory } from "../../services"

export const DownloadHistoryActionCreator = {
    getDownloadHistory: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: GetDownloadHistory.GET_DOWNLOAD_HISTORY_REQUEST })
        const success = (sent: any) => ({ type: GetDownloadHistory.GET_DOWNLOAD_HISTORY_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: GetDownloadHistory.GET_DOWNLOAD_HISTORY_FAILURE, payload: error })

        dispatch(request())

        downloadHistory.getDownloadHistory(requestPayload)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    saveDownloadHistory: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_REQUEST })
        const success = (sent: any) => ({ type: SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_FAILURE, payload: error })

        dispatch(request())

        downloadHistory.saveDownloadHistory(requestPayload)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_RESET })
                }, 0)
            })
    },
    deleteDownloadHistory: (id: any) => (dispatch: any) => {
        const request = () => ({ type: DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_REQUEST })
        const success = (sent: any) => ({ type: DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_SUCCESS, payload: sent })
        const failure = (error: any) => ({ type: DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_FAILURE, payload: error })

        dispatch(request())

        downloadHistory.deleteDownloadHistory(id)
            .then(
                sent => {
                    dispatch(success(sent))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_RESET })
                }, 0)
            })
    },
}