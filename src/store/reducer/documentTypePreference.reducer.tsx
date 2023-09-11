import {
    GetAllDocumentTypePreference,
    AddDocumentTypePreference,
    DeleteDocumentTypePreference
} from "../types.d"

const initialState = {
    data: [],
    totalCount: 0,
    error: false,
    loading: false,
    adding: false,
    addSuccess: false,
    addError: false,
    deleting: false,
    deleteSuccess: false,
    deleteError: false
}

const documentTypePreferenceReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetAllDocumentTypePreference.GET_ALL_DOCUMENT_TYPE_PREFERENCE_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case GetAllDocumentTypePreference.GET_ALL_DOCUMENT_TYPE_PREFERENCE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.domains,
                totalCount: action.payload.totalCount
            }
        case GetAllDocumentTypePreference.GET_ALL_DOCUMENT_TYPE_PREFERENCE_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
                totalCount: 0
            }
        case GetAllDocumentTypePreference.GET_ALL_DOCUMENT_TYPE_PREFERENCE_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                totalCount: 0
            }
        case AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_REQUEST:
            return {
                ...state,
                adding: true,
                addSuccess: false,
                addError: false
            }
        case AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_SUCCESS:
            return {
                ...state,
                adding: false,
                addSuccess: true,
                addError: false
            }
        case AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_FAILURE:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: true
            }
        case AddDocumentTypePreference.ADD_DOCUMENT_TYPE_PREFERENCE_RESET:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: false
            }
        case DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_REQUEST:
            return {
                ...state,
                deleting: true,
                deleteSuccess: false,
                deleteError: false
            }
        case DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleteSuccess: true,
                deleteError: false
            }
        case DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_FAILURE:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: true
            }
        case DeleteDocumentTypePreference.DELETE_DOCUMENT_TYPE_PREFERENCE_RESET:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: false
            }
        default:
            return state
    }
}

export default documentTypePreferenceReducer