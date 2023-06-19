import { GetDocumentTypeIdentifier, AddDocumentCostIdentifier, EditDocumentCostIdentifier, DeleteDocumentCostIdentifier } from "../types.d"

const initialState = {
    data: [],
    loading: false,
    error: false,
    totalCount: 0,
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

const documentTypeIdentifierReducer = (state = initialState, action: { type: any, payload: any }) => {
    switch (action.type) {
        case GetDocumentTypeIdentifier.GET_DOCUMENT_TYPE_IDENTIFIER_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case GetDocumentTypeIdentifier.GET_DOCUMENT_TYPE_IDENTIFIER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.identifiers,
                totalCount: action.payload.totalCount
            }
        case GetDocumentTypeIdentifier.GET_DOCUMENT_TYPE_IDENTIFIER_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_REQUEST:
            return {
                ...state,
                adding: true,
                addSuccessful: false,
                addError: false
            }
        case AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_SUCCESS:
            return {
                ...state,
                adding: false,
                addSuccessful: true,
                addError: false
            }
        case AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_FAILURE:
            return {
                ...state,
                adding: false,
                addSuccessful: false,
                addError: true
            }
        case AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_RESET:
            return {
                ...state,
                adding: false,
                addSuccessful: false,
                addError: false
            }
        case EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_REQUEST:
            return {
                ...state,
                editing: true,
                editSuccessful: false,
                editError: false
            }
        case EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_SUCCESS:
            return {
                ...state,
                editing: false,
                editSuccessful: true,
                editError: false
            }
        case EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_FAILURE:
            return {
                ...state,
                editing: false,
                editSuccessful: false,
                editError: true
            }
        case EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_RESET:
            return {
                ...state,
                editing: false,
                editSuccessful: false,
                editError: false
            }
        case DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_REQUEST:
            return {
                ...state,
                deleting: true,
                deleteSuccessful: false,
                deleteError: false
            }
        case DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleteSuccessful: true,
                deleteError: false
            }
        case DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_FAILURE:
            return {
                ...state,
                deleting: false,
                deleteSuccessful: false,
                deleteError: true
            }
        case DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_RESET:
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

export default documentTypeIdentifierReducer;