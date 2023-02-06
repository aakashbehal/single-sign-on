import {
    RequiredDocuments,
    SaveRequiredDocuments,
    EditRequiredDocuments,
    DeleteRequiredDocuments
} from "../types.d";

const initialState = {
    data: [],
    error: false,
    loading: false,
    adding: false,
    addSuccessful: false,
    addError: false,
    editing: false,
    editSuccessful: false,
    editError: false,
    deleting: false,
    deleteSuccessful: false,
    deleteError: false
}

const requiredDocumentsReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case RequiredDocuments.REQUIRED_DOCUMENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case RequiredDocuments.REQUIRED_DOCUMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case RequiredDocuments.REQUIRED_DOCUMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case RequiredDocuments.REQUIRED_DOCUMENTS_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: []
            }
        case SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_REQUEST:
            return {
                ...state,
                adding: true,
                addSuccessful: false,
                addError: false
            }
        case SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_SUCCESS:
            return {
                ...state,
                adding: false,
                addSuccessful: true,
                addError: false
            }
        case SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_FAILURE:
            return {
                ...state,
                adding: false,
                addSuccessful: false,
                addError: true
            }
        case SaveRequiredDocuments.SAVE_REQUIRED_DOCUMENTS_RESET:
            return {
                ...state,
                adding: false,
                addSuccessful: false,
                addError: false
            }
        case EditRequiredDocuments.EDIT_REQUIRED_DOCUMENTS_REQUEST:
            return {
                ...state,
                editing: true,
                editSuccessful: false,
                editError: false
            }
        case EditRequiredDocuments.EDIT_REQUIRED_DOCUMENTS_SUCCESS:
            return {
                ...state,
                editing: false,
                editSuccessful: true,
                editError: false
            }
        case EditRequiredDocuments.EDIT_REQUIRED_DOCUMENTS_FAILURE:
            return {
                ...state,
                editing: false,
                editSuccessful: false,
                editError: true
            }
        case EditRequiredDocuments.EDIT_REQUIRED_DOCUMENTS_RESET:
            return {
                ...state,
                editing: false,
                editSuccessful: false,
                editError: false
            }
        case DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_REQUEST:
            return {
                ...state,
                deleting: true,
                deleteSuccessful: false,
                deleteError: false
            }
        case DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleteSuccessful: true,
                deleteError: false
            }
        case DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_FAILURE:
            return {
                ...state,
                deleting: false,
                deleteSuccessful: false,
                deleteError: true
            }
        case DeleteRequiredDocuments.DELETE_REQUIRED_DOCUMENTS_RESET:
            return {
                ...state,
                deleting: false,
                deleteSuccessful: false,
                deleteError: false
            }
        default:
            return state
    }
}

export default requiredDocumentsReducer;