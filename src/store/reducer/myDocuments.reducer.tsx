import {
    MyDocumentsFolder,
    MyDocumentsList,
    DeleteDocument,
    DeleteFolder,
    DownloadFolder,
    DownloadDocument
} from "../types.d"

const initialState = {
    folders: {
        loading: false,
        error: false,
        totalCount: 0,
        data: [],
        columns: [],
        deleteRequest: false,
        deleteSuccess: false,
        deleteError: false
    },
    documents: {
        loading: false,
        error: false,
        totalCount: 0,
        data: [],
        columns: [],
        deleteRequest: false,
        deleteSuccess: false,
        deleteError: false
    },
    folderDownload: {
        loading: false,
        error: false,
        success: false,
        downloadLinks: []
    },
    documentDownload: {
        loading: false,
        error: false,
        success: false,
        downloadLink: null
    }
}

const myDocumentsReducer = (state = initialState, action: { type: any, payload: any }) => {
    switch (action.type) {
        case MyDocumentsFolder.MY_DOCUMENTS_FOLDER_REQUEST:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    loading: true,
                    error: false,
                }
            }
        case MyDocumentsFolder.MY_DOCUMENTS_FOLDER_SUCCESS:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    loading: false,
                    totalCount: action.payload.totalCount,
                    data: action.payload.folders,
                    columns: action.payload.columns
                }
            }
        case MyDocumentsFolder.MY_DOCUMENTS_FOLDER_FAILURE:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    loading: false,
                    totalCount: 0,
                    data: [],
                    error: true
                }
            }
        case MyDocumentsFolder.MY_DOCUMENTS_FOLDER_RESET:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    loading: false,
                    error: false,
                    totalCount: 0,
                    data: [],
                    columns: []
                }
            }
        case MyDocumentsList.MY_DOCUMENTS_LIST_REQUEST:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    loading: true,
                    error: false
                }
            }
        case MyDocumentsList.MY_DOCUMENTS_LIST_SUCCESS:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    loading: false,
                    data: action.payload.documents,
                    totalCount: action.payload.totalCount,
                    columns: action.payload.columns
                }
            }
        case MyDocumentsList.MY_DOCUMENTS_LIST_FAILURE:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    loading: false,
                    error: true,
                    totalCount: 0,
                    data: []
                }
            }
        case MyDocumentsList.MY_DOCUMENTS_LIST_RESET:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    loading: false,
                    error: false,
                    totalCount: 0,
                    data: [],
                    columns: []
                }
            }
        case DeleteDocument.DELETE_DOCUMENTS_REQUEST:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    deleteRequest: true,
                    deleteError: false,
                }
            }
        case DeleteDocument.DELETE_DOCUMENTS_SUCCESS:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    deleteRequest: false,
                    deleteSuccess: true
                }
            }
        case DeleteDocument.DELETE_DOCUMENTS_FAILURE:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    deleteRequest: false,
                    deleteError: true
                }
            }
        case DeleteDocument.DELETE_DOCUMENTS_RESET:
            return {
                ...state,
                documents: {
                    ...state.documents,
                    deleteRequest: false,
                    deleteSuccess: false,
                    deleteError: false,
                }
            }
        case DeleteFolder.DELETE_FOLDER_REQUEST:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    deleteRequest: true,
                    deleteError: false,
                }
            }
        case DeleteFolder.DELETE_FOLDER_SUCCESS:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    deleteRequest: false,
                    deleteSuccess: true
                }
            }
        case DeleteFolder.DELETE_FOLDER_FAILURE:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    deleteRequest: false,
                    deleteError: true
                }
            }
        case DeleteFolder.DELETE_FOLDER_RESET:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    deleteRequest: false,
                    deleteSuccess: false,
                    deleteError: false,
                }
            }
        case DownloadFolder.DOWNLOAD_FOLDER_REQUEST:
            return {
                ...state,
                folderDownload: {
                    ...state.folderDownload,
                    loading: true,
                    error: false,
                }
            }
        case DownloadFolder.DOWNLOAD_FOLDER_SUCCESS:
            return {
                ...state,
                folderDownload: {
                    ...state.folderDownload,
                    loading: false,
                    success: true,
                    downloadLinks: action.payload
                }
            }
        case DownloadFolder.DOWNLOAD_FOLDER_FAILURE:
            return {
                ...state,
                folderDownload: {
                    ...state.folderDownload,
                    loading: false,
                    error: true
                }
            }
        case DownloadFolder.DOWNLOAD_FOLDER_RESET:
            return {
                ...state,
                folderDownload: {
                    ...state.folderDownload,
                    loading: false,
                    error: false,
                    success: false,
                    downloadLinks: []
                }
            }
        case DownloadDocument.DOWNLOAD_DOCUMENT_REQUEST:
            return {
                ...state,
                documentDownload: {
                    ...state.documentDownload,
                    loading: true,
                    error: false,
                    downloadLinks: []
                }
            }
        case DownloadDocument.DOWNLOAD_DOCUMENT_SUCCESS:
            return {
                ...state,
                documentDownload: {
                    ...state.documentDownload,
                    loading: false,
                    success: true,
                    downloadLink: action.payload
                }
            }
        case DownloadDocument.DOWNLOAD_DOCUMENT_FAILURE:
            return {
                ...state,
                documentDownload: {
                    ...state.documentDownload,
                    loading: false,
                    error: true,
                    downloadLink: null
                }
            }
        case DownloadDocument.DOWNLOAD_DOCUMENT_RESET:
            return {
                ...state,
                documentDownload: {
                    ...state.documentDownload,
                    loading: false,
                    error: false,
                    success: false,
                    downloadLink: null
                }
            }
        default:
            return state
    }
}

export default myDocumentsReducer;