import { DocumentsCost, SaveDocumentsCost, EditDocumentsCost, DeleteDocumentsCost } from "../types.d";

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

const documentCostReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case DocumentsCost.DOCUMENTS_COST_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case DocumentsCost.DOCUMENTS_COST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case DocumentsCost.DOCUMENTS_COST_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case DocumentsCost.DOCUMENTS_COST_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: []
            }
        case SaveDocumentsCost.SAVE_DOCUMENTS_COST_REQUEST:
            return {
                ...state,
                adding: true,
                addSuccessful: false,
                addError: false
            }
        case SaveDocumentsCost.SAVE_DOCUMENTS_COST_SUCCESS:
            return {
                ...state,
                adding: false,
                addSuccessful: true,
                addError: false
            }
        case SaveDocumentsCost.SAVE_DOCUMENTS_COST_FAILURE:
            return {
                ...state,
                adding: false,
                addSuccessful: false,
                addError: true
            }
        case SaveDocumentsCost.SAVE_DOCUMENTS_COST_RESET:
            return {
                ...state,
                adding: false,
                addSuccessful: false,
                addError: false
            }
        case EditDocumentsCost.EDIT_DOCUMENTS_COST_REQUEST:
            return {
                ...state,
                editing: true,
                editSuccessful: false,
                editError: false
            }
        case EditDocumentsCost.EDIT_DOCUMENTS_COST_SUCCESS:
            return {
                ...state,
                editing: false,
                editSuccessful: true,
                editError: false
            }
        case EditDocumentsCost.EDIT_DOCUMENTS_COST_FAILURE:
            return {
                ...state,
                editing: false,
                editSuccessful: false,
                editError: true
            }
        case EditDocumentsCost.EDIT_DOCUMENTS_COST_RESET:
            return {
                ...state,
                editing: false,
                editSuccessful: false,
                editError: false
            }
        case DeleteDocumentsCost.DELETE_DOCUMENTS_COST_REQUEST:
            return {
                ...state,
                deleting: true,
                deleteSuccessful: false,
                deleteError: false
            }
        case DeleteDocumentsCost.DELETE_DOCUMENTS_COST_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleteSuccessful: true,
                deleteError: false
            }
        case DeleteDocumentsCost.DELETE_DOCUMENTS_COST_FAILURE:
            return {
                ...state,
                deleting: false,
                deleteSuccessful: false,
                deleteError: true
            }
        case DeleteDocumentsCost.DELETE_DOCUMENTS_COST_RESET:
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

export default documentCostReducer;