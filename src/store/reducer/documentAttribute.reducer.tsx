import {
    GetAllDocumentAttribute,
    AddDocumentAttribute,
    AddNewDocumentAttribute,
    UpdateDocumentAttribute,
    DeleteDocumentAttribute
} from "../types.d"

const initialState = {
    data: [],
    error: false,
    loading: false,
    updating: false,
    updateSuccess: false,
    updateError: false,
    adding: false,
    addSuccess: false,
    addError: false,
    deleting: false,
    deleteSuccess: false,
    deleteError: false,
    addingNew: false,
    addNewSuccess: false,
    addNewError: false,
}

const documentAttributeReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetAllDocumentAttribute.GET_ALL_DOCUMENT_ATTRIBUTE_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
            }
        case GetAllDocumentAttribute.GET_ALL_DOCUMENT_ATTRIBUTE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            }
        case GetAllDocumentAttribute.GET_ALL_DOCUMENT_ATTRIBUTE_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
            }
        case GetAllDocumentAttribute.GET_ALL_DOCUMENT_ATTRIBUTE_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
            }
        case AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_REQUEST:
            return {
                ...state,
                adding: true,
                addSuccess: false,
                addError: false
            }
        case AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_SUCCESS:
            return {
                ...state,
                adding: false,
                addSuccess: true,
                addError: false
            }
        case AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_FAILURE:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: true
            }
        case AddDocumentAttribute.ADD_DOCUMENT_ATTRIBUTE_RESET:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: false
            }
        case DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_REQUEST:
            return {
                ...state,
                deleting: true,
                deleteSuccess: false,
                deleteError: false
            }
        case DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleteSuccess: true,
                deleteError: false
            }
        case DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_FAILURE:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: true
            }
        case DeleteDocumentAttribute.DELETE_DOCUMENT_ATTRIBUTE_RESET:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: false
            }
        case UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_REQUEST:
            return {
                ...state,
                updating: true,
                updateSuccess: false,
                updateError: false
            }
        case UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_SUCCESS:
            return {
                ...state,
                updating: false,
                updateSuccess: true,
                updateError: false
            }
        case UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_FAILURE:
            return {
                ...state,
                updating: false,
                updateSuccess: false,
                updateError: true
            }
        case UpdateDocumentAttribute.UPDATE_DOCUMENT_ATTRIBUTE_RESET:
            return {
                ...state,
                updating: false,
                updateSuccess: false,
                updateError: false
            }
        case AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_REQUEST:
            return {
                ...state,
                addingNew: true,
                addNewSuccess: false,
                addNewError: false
            }
        case AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_SUCCESS:
            return {
                ...state,
                addingNew: false,
                addNewSuccess: true,
                addNewError: false
            }
        case AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_FAILURE:
            return {
                ...state,
                addingNew: false,
                addNewSuccess: false,
                addNewError: true
            }
        case AddNewDocumentAttribute.ADD_NEW_DOCUMENT_ATTRIBUTE_RESET:
            return {
                ...state,
                addingNew: false,
                addNewSuccess: false,
                addNewError: false
            }
        default:
            return state
    }
}

export default documentAttributeReducer