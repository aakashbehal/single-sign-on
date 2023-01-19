import { MyDocumentsFolder, MyDocumentsList } from "../types.d"

const initialState = {
    folders: {
        loading: false,
        error: false,
        totalCount: 0,
        data: []
    },
    documents: {
        loading: false,
        error: false,
        totalCount: 0,
        data: []
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
                    error: false
                }
            }
        case MyDocumentsFolder.MY_DOCUMENTS_FOLDER_SUCCESS:
            return {
                ...state,
                folders: {
                    ...state.folders,
                    loading: false,
                    totalCount: action.payload.totalCount,
                    data: action.payload.folders
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
                    totalCount: action.payload.totalCount
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
        default:
            return state
    }
}

export default myDocumentsReducer;