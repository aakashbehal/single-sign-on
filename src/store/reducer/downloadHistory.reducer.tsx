import {
    GetDownloadHistory,
    SaveDownloadHistory,
    DeleteDownloadHistory
} from "../types.d";

const initialState = {
    data: [],
    totalCount: 0,
    error: false,
    loading: false,
    saveDownload: false,
    saveDownloadSuccess: false,
    saveDownloadError: false,
    deleteDownloadHistory: false,
    deleteDownloadHistorySuccess: false,
    deleteDownloadHistoryError: false

}

const downloadHistoryRequestReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetDownloadHistory.GET_DOWNLOAD_HISTORY_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case GetDownloadHistory.GET_DOWNLOAD_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.sentRequests,
                totalCount: action.payload.totalCount
            }
        case GetDownloadHistory.GET_DOWNLOAD_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
                totalCount: 0
            }
        case GetDownloadHistory.GET_DOWNLOAD_HISTORY_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                totalCount: 0
            }
        case SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_REQUEST:
            return {
                ...state,
                saveDownload: true,
                saveDownloadSuccess: false,
                saveDownloadError: false
            }
        case SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_SUCCESS:
            return {
                ...state,
                saveDownload: false,
                saveDownloadSuccess: true,
                saveDownloadError: false
            }
        case SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_FAILURE:
            return {
                ...state,
                saveDownload: false,
                saveDownloadSuccess: false,
                saveDownloadError: true
            }
        case SaveDownloadHistory.SAVE_DOWNLOAD_HISTORY_RESET:
            return {
                ...state,
                saveDownload: false,
                saveDownloadSuccess: false,
                saveDownloadError: false
            }
        case DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_REQUEST:
            return {
                ...state,
                deleteDownloadHistory: true,
                deleteDownloadHistorySuccess: false,
                deleteDownloadHistoryError: false
            }
        case DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_SUCCESS:
            return {
                ...state,
                deleteDownloadHistory: false,
                deleteDownloadHistorySuccess: true,
                deleteDownloadHistoryError: false
            }
        case DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_FAILURE:
            return {
                ...state,
                deleteDownloadHistory: false,
                deleteDownloadHistorySuccess: false,
                deleteDownloadHistoryError: true
            }
        case DeleteDownloadHistory.DELETE_DOWNLOAD_HISTORY_RESET:
            return {
                ...state,
                deleteDownloadHistory: false,
                deleteDownloadHistorySuccess: false,
                deleteDownloadHistoryError: false
            }
        default:
            return state
    }
}

export default downloadHistoryRequestReducer;