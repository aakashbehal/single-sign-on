import { GetAllClients, AddClient, EditClient, DeactivateClient, AddDomainClient, AddGroupClient } from "../types.d";

const initialState = {
    data: [],
    error: false,
    totalCount: 0,
    loading: false,
    addClientSuccess: false,
    addClientLoading: false,
    addClientError: false,
    editClientSuccess: false,
    editClientLoading: false,
    editClientError: false,
    deactivateClientSuccess: false,
    deactivateClientLoading: false,
    deactivateClientError: false,
    addDomainClientSuccess: false,
    addDomainClientLoading: false,
    addDomainClientError: false,
    addGroupClientSuccess: false,
    addGroupClientLoading: false,
    addGroupClientError: false,
}

const clientSetupReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetAllClients.GET_ALL_CLIENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case GetAllClients.GET_ALL_CLIENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.clients,
                totalCount: action.payload.totalCount
            }
        case GetAllClients.GET_ALL_CLIENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case GetAllClients.GET_ALL_CLIENTS_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                totalCount: 0
            }
        case AddClient.ADD_CLIENTS_REQUEST:
            return {
                ...state,
                addClientLoading: true,
                addClientError: false,
            }
        case AddClient.ADD_CLIENTS_SUCCESS:
            return {
                ...state,
                addClientSuccess: true,
                addClientLoading: false
            }
        case AddClient.ADD_CLIENTS_FAILURE:
            return {
                ...state,
                addClientLoading: false,
                addClientError: true
            }
        case AddClient.ADD_CLIENTS_RESET:
            return {
                ...state,
                addClientSuccess: false,
                addClientLoading: false,
                addClientError: false,
            }
        case EditClient.EDIT_CLIENTS_REQUEST:
            return {
                ...state,
                editClientLoading: true,
                editClientError: false,
            }
        case EditClient.EDIT_CLIENTS_SUCCESS:
            return {
                ...state,
                editClientSuccess: true,
                editClientLoading: false
            }
        case EditClient.EDIT_CLIENTS_FAILURE:
            return {
                ...state,
                editClientLoading: false,
                editClientError: true
            }
        case EditClient.EDIT_CLIENTS_RESET:
            return {
                ...state,
                editClientSuccess: false,
                editClientLoading: false,
                editClientError: false,
            }
        case DeactivateClient.DEACTIVATE_CLIENTS_REQUEST:
            return {
                ...state,
                deactivateClientLoading: true,
                deactivateClientError: false,
            }
        case DeactivateClient.DEACTIVATE_CLIENTS_SUCCESS:
            return {
                ...state,
                deactivateClientSuccess: true,
                deactivateClientLoading: false
            }
        case DeactivateClient.DEACTIVATE_CLIENTS_FAILURE:
            return {
                ...state,
                deactivateClientLoading: false,
                deactivateClientError: true
            }
        case DeactivateClient.DEACTIVATE_CLIENTS_RESET:
            return {
                ...state,
                deactivateClientSuccess: false,
                deactivateClientLoading: false,
                deactivateClientError: false,
            }
        case AddDomainClient.ADD_DOMAIN_CLIENT_REQUEST:
            return {
                ...state,
                addDomainClientSuccess: false,
                addDomainClientLoading: true,
                addDomainClientError: false

            }
        case AddDomainClient.ADD_DOMAIN_CLIENT_SUCCESS:
            return {
                ...state,
                addDomainClientSuccess: true,
                addDomainClientLoading: false,
                addDomainClientError: false
            }
        case AddDomainClient.ADD_DOMAIN_CLIENT_FAILURE:
            return {
                ...state,
                addDomainClientSuccess: false,
                addDomainClientLoading: false,
                addDomainClientError: true
            }
        case AddDomainClient.ADD_DOMAIN_CLIENT_RESET:
            return {
                ...state,
                addDomainClientSuccess: false,
                addDomainClientLoading: false,
                addDomainClientError: false
            }
        case AddGroupClient.ADD_GROUP_CLIENT_REQUEST:
            return {
                ...state,
                addGroupClientSuccess: false,
                addGroupClientLoading: true,
                addGroupClientError: false,
            }
        case AddGroupClient.ADD_GROUP_CLIENT_SUCCESS:
            return {
                ...state,
                addGroupClientSuccess: true,
                addGroupClientLoading: false,
                addGroupClientError: false,
            }
        case AddGroupClient.ADD_GROUP_CLIENT_FAILURE:
            return {
                ...state,
                addGroupClientSuccess: false,
                addGroupClientLoading: false,
                addGroupClientError: true,
            }
        case AddGroupClient.ADD_GROUP_CLIENT_RESET:
            return {
                ...state,
                addGroupClientSuccess: false,
                addGroupClientLoading: false,
                addGroupClientError: false,
            }
        default:
            return state
    }
}

export default clientSetupReducer;