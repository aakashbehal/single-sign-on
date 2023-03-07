import { MyDocumentsFolder, MyDocumentsList, DeleteDocument } from "../types.d"

const initialState = {
    folders: {
        loading: false,
        error: false,
        totalCount: 0,
        data: [],
        columns: []
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
        default:
            return state
    }
}

export default myDocumentsReducer;