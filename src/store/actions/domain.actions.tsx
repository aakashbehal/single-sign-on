import {
    GetAllDomains,
    AddDomain,
    DeleteDomain,
    GetDomainByCode
} from "../types.d"
import { domainService } from "../../services"

export const DomainActionCreator = {
    getAllDomains: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: GetAllDomains.GET_ALL_DOMAIN_REQUEST })
        const success = (domains: any) => ({ type: GetAllDomains.GET_ALL_DOMAIN_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: GetAllDomains.GET_ALL_DOMAIN_FAILURE, payload: error })

        dispatch(request())

        domainService.getAllDomains(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    addDomains: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: AddDomain.ADD_DOMAIN_REQUEST })
        const success = (domains: any) => ({ type: AddDomain.ADD_DOMAIN_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: AddDomain.ADD_DOMAIN_FAILURE, payload: error })

        dispatch(request())

        domainService.addDomain(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: AddDomain.ADD_DOMAIN_RESET })
                }, 0)
            )
    },
    deleteDomains: (id: number) => (dispatch: any) => {
        const request = () => ({ type: DeleteDomain.DELETE_DOMAIN_REQUEST })
        const success = (domains: any) => ({ type: DeleteDomain.DELETE_DOMAIN_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: DeleteDomain.DELETE_DOMAIN_FAILURE, payload: error })

        dispatch(request())

        domainService.deleteDomain(id)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteDomain.DELETE_DOMAIN_RESET })
                }, 0)
            })
    },
    getDomainByCode: (shortCode: string) => (dispatch: any) => {
        const request = () => ({ type: GetDomainByCode.GET_DOMAIN_BY_CODE_REQUEST })
        const success = (domains: any) => ({ type: GetDomainByCode.GET_DOMAIN_BY_CODE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: GetDomainByCode.GET_DOMAIN_BY_CODE_FAILURE, payload: error })

        dispatch(request())

        domainService.getDomainByCode(shortCode)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
}