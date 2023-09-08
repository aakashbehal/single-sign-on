import {
    GetAllDocumentGroup,
    AddDocumentGroup,
    UpdateDocumentGroup,
    DeleteDocumentGroup,
    GetDocumentGroupByCode
} from "../types.d"

const initialState = {
    data: [],
    totalCount: 0,
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
    deleteError: false
}

const documentGroupReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetAllDocumentGroup.GET_ALL_DOCUMENT_GROUP_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case GetAllDocumentGroup.GET_ALL_DOCUMENT_GROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.domains,
                totalCount: action.payload.totalCount
            }
        case GetAllDocumentGroup.GET_ALL_DOCUMENT_GROUP_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
                totalCount: 0
            }
        case GetAllDocumentGroup.GET_ALL_DOCUMENT_GROUP_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                totalCount: 0
            }
        case AddDocumentGroup.ADD_DOCUMENT_GROUP_REQUEST:
            return {
                ...state,
                adding: true,
                addSuccess: false,
                addError: false
            }
        case AddDocumentGroup.ADD_DOCUMENT_GROUP_SUCCESS:
            return {
                ...state,
                adding: false,
                addSuccess: true,
                addError: false
            }
        case AddDocumentGroup.ADD_DOCUMENT_GROUP_FAILURE:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: true
            }
        case AddDocumentGroup.ADD_DOCUMENT_GROUP_RESET:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: false
            }
        case DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_REQUEST:
            return {
                ...state,
                deleting: true,
                deleteSuccess: false,
                deleteError: false
            }
        case DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleteSuccess: true,
                deleteError: false
            }
        case DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_FAILURE:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: true
            }
        case DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_RESET:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: false
            }
        case UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_REQUEST:
            return {
                ...state,
                updating: true,
                updateSuccess: false,
                updateError: false
            }
        case UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_SUCCESS:
            return {
                ...state,
                updating: false,
                updateSuccess: true,
                updateError: false
            }
        case UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_FAILURE:
            return {
                ...state,
                updating: false,
                updateSuccess: false,
                updateError: true
            }
        case UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_RESET:
            return {
                ...state,
                updating: false,
                updateSuccess: false,
                updateError: false
            }
        default:
            return state
    }
}

export default documentGroupReducer