import {
    GetAllDomains,
    AddDomain,
    DeleteDomain,
    UpdateDomain,
    GetDomainByCode
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

const domainReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetAllDomains.GET_ALL_DOMAIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case GetAllDomains.GET_ALL_DOMAIN_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.domains,
                totalCount: action.payload.totalCount
            }
        case GetAllDomains.GET_ALL_DOMAIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
                totalCount: 0
            }
        case GetAllDomains.GET_ALL_DOMAIN_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                totalCount: 0
            }
        case AddDomain.ADD_DOMAIN_REQUEST:
            return {
                ...state,
                adding: true,
                addSuccess: false,
                addError: false
            }
        case AddDomain.ADD_DOMAIN_SUCCESS:
            return {
                ...state,
                adding: false,
                addSuccess: true,
                addError: false
            }
        case AddDomain.ADD_DOMAIN_FAILURE:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: true
            }
        case AddDomain.ADD_DOMAIN_RESET:
            return {
                ...state,
                adding: false,
                addSuccess: false,
                addError: false
            }
        case DeleteDomain.DELETE_DOMAIN_REQUEST:
            return {
                ...state,
                deleting: true,
                deleteSuccess: false,
                deleteError: false
            }
        case DeleteDomain.DELETE_DOMAIN_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleteSuccess: true,
                deleteError: false
            }
        case DeleteDomain.DELETE_DOMAIN_FAILURE:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: true
            }
        case DeleteDomain.DELETE_DOMAIN_RESET:
            return {
                ...state,
                deleting: false,
                deleteSuccess: false,
                deleteError: false
            }
        case UpdateDomain.UPDATE_DOMAIN_REQUEST:
            return {
                ...state,
                updating: true,
                updateSuccess: false,
                updateError: false
            }
        case UpdateDomain.UPDATE_DOMAIN_SUCCESS:
            return {
                ...state,
                updating: false,
                updateSuccess: true,
                updateError: false
            }
        case UpdateDomain.UPDATE_DOMAIN_FAILURE:
            return {
                ...state,
                updating: false,
                updateSuccess: false,
                updateError: true
            }
        case UpdateDomain.UPDATE_DOMAIN_RESET:
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

export default domainReducer