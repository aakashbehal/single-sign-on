import {
    GetAllDocumentGroup,
    AddDocumentGroup,
    UpdateDocumentGroup,
    DeleteDocumentGroup,
    GetDocumentGroupByCode
} from "../types.d"
import { documentGroupService, domainService } from "../../services"

export const DocumentGroupActionCreator = {
    getAllDocumentGroup: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: GetAllDocumentGroup.GET_ALL_DOCUMENT_GROUP_REQUEST })
        const success = (domains: any) => ({ type: GetAllDocumentGroup.GET_ALL_DOCUMENT_GROUP_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: GetAllDocumentGroup.GET_ALL_DOCUMENT_GROUP_FAILURE, payload: error })

        dispatch(request())

        documentGroupService.getAllDocumentGroup(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    addDocumentGroup: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: AddDocumentGroup.ADD_DOCUMENT_GROUP_REQUEST })
        const success = (domains: any) => ({ type: AddDocumentGroup.ADD_DOCUMENT_GROUP_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: AddDocumentGroup.ADD_DOCUMENT_GROUP_FAILURE, payload: error })

        dispatch(request())

        documentGroupService.addDocumentGroup(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: AddDocumentGroup.ADD_DOCUMENT_GROUP_RESET })
                }, 0)
            )
    },
    updateDocumentGroup: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_REQUEST })
        const success = (domains: any) => ({ type: UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_FAILURE, payload: error })

        dispatch(request())

        documentGroupService.updateDocumentGroup(requestPayload)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: UpdateDocumentGroup.UPDATE_DOCUMENT_GROUP_RESET })
                }, 0)
            )
    },
    deleteDocumentGroup: (id: number) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_REQUEST })
        const success = (domains: any) => ({ type: DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_FAILURE, payload: error })

        dispatch(request())

        documentGroupService.deleteDocumentGroup(id)
            .then(
                domains => {
                    dispatch(success(domains))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteDocumentGroup.DELETE_DOCUMENT_GROUP_RESET })
                }, 0)
            })
    },
    getDocumentGroupByCode: (shortCode: string) => (dispatch: any) => {
        const request = () => ({ type: GetDocumentGroupByCode.GET_DOCUMENT_GROUP_BY_CODE_REQUEST })
        const success = (domains: any) => ({ type: GetDocumentGroupByCode.GET_DOCUMENT_GROUP_BY_CODE_SUCCESS, payload: domains })
        const failure = (error: any) => ({ type: GetDocumentGroupByCode.GET_DOCUMENT_GROUP_BY_CODE_FAILURE, payload: error })

        dispatch(request())

        documentGroupService.getDocumentGroupByCode(shortCode)
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