import { GetAllClients, AddClient, EditClient, DeactivateClient, AddDomainClient, AddGroupClient } from "../types.d";
import { clientServices } from "../../services"

export const ClientSetupActionCreator = {
    getAllClients: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: GetAllClients.GET_ALL_CLIENTS_REQUEST })
        const success = (clients: any) => ({ type: GetAllClients.GET_ALL_CLIENTS_SUCCESS, payload: clients })
        const failure = () => ({ type: GetAllClients.GET_ALL_CLIENTS_FAILURE })

        dispatch(request())

        clientServices.getAllClients(payload)
            .then(
                clients => {
                    dispatch(success(clients))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    addClient: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: AddClient.ADD_CLIENTS_REQUEST })
        const success = (clients: any) => ({ type: AddClient.ADD_CLIENTS_SUCCESS, payload: clients })
        const failure = () => ({ type: AddClient.ADD_CLIENTS_FAILURE })

        dispatch(request())

        clientServices.addClient(payload)
            .then(
                clients => {
                    dispatch(success(clients))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: AddClient.ADD_CLIENTS_RESET })
                }, 0)
            })
    },
    editClient: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: EditClient.EDIT_CLIENTS_REQUEST })
        const success = (clients: any) => ({ type: EditClient.EDIT_CLIENTS_SUCCESS, payload: clients })
        const failure = () => ({ type: EditClient.EDIT_CLIENTS_FAILURE })

        dispatch(request())

        clientServices.editClient(payload)
            .then(
                clients => {
                    dispatch(success(clients))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: EditClient.EDIT_CLIENTS_RESET })
                }, 0)
            })
    },
    deactivateClient: (clientId: any) => (dispatch: any) => {
        const request = () => ({ type: DeactivateClient.DEACTIVATE_CLIENTS_REQUEST })
        const success = (clients: any) => ({ type: DeactivateClient.DEACTIVATE_CLIENTS_SUCCESS, payload: clients })
        const failure = () => ({ type: DeactivateClient.DEACTIVATE_CLIENTS_FAILURE })

        dispatch(request())

        clientServices.deactivateClient(clientId)
            .then(
                clients => {
                    dispatch(success(clients))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeactivateClient.DEACTIVATE_CLIENTS_RESET })
                }, 0)
            })
    },
    addClientDomain: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: AddDomainClient.ADD_DOMAIN_CLIENT_REQUEST })
        const success = (clients: any) => ({ type: AddDomainClient.ADD_DOMAIN_CLIENT_SUCCESS, payload: clients })
        const failure = () => ({ type: AddDomainClient.ADD_DOMAIN_CLIENT_FAILURE })

        dispatch(request())

        clientServices.addClientDomain(payload)
            .then(
                clients => {
                    dispatch(success(clients))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: AddDomainClient.ADD_DOMAIN_CLIENT_RESET })
                }, 0)
            })
    },
    addClientGroup: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: AddGroupClient.ADD_GROUP_CLIENT_REQUEST })
        const success = (clients: any) => ({ type: AddGroupClient.ADD_GROUP_CLIENT_SUCCESS, payload: clients })
        const failure = () => ({ type: AddGroupClient.ADD_GROUP_CLIENT_FAILURE })

        dispatch(request())

        clientServices.addClientGroup(payload)
            .then(
                clients => {
                    dispatch(success(clients))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: AddGroupClient.ADD_GROUP_CLIENT_RESET })
                }, 0)
            })
    },
}