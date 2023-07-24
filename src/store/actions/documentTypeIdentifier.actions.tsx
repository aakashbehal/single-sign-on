import { GetDocumentTypeIdentifier, AddDocumentCostIdentifier, EditDocumentCostIdentifier, DeleteDocumentCostIdentifier } from "../types.d";
import { documentTypeIdentifierService } from "../../services"

export const DocumentTypeIdentifierActionCreator = {
    getIdentifiers: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: GetDocumentTypeIdentifier.GET_DOCUMENT_TYPE_IDENTIFIER_REQUEST, payload: [] })
        const success = (identifiers: any) => ({ type: GetDocumentTypeIdentifier.GET_DOCUMENT_TYPE_IDENTIFIER_SUCCESS, payload: identifiers })
        const failure = () => ({ type: GetDocumentTypeIdentifier.GET_DOCUMENT_TYPE_IDENTIFIER_FAILURE, payload: [] })

        dispatch(request())

        documentTypeIdentifierService.getAllIdentifiers(requestPayload)
            .then(
                identifiers => {
                    dispatch(success(identifiers))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    addDocumentCostIdentifier: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_REQUEST, payload: [] })
        const success = (identifiers: any) => ({ type: AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_SUCCESS, payload: identifiers })
        const failure = () => ({ type: AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_FAILURE, payload: [] })

        dispatch(request())

        documentTypeIdentifierService.addDocumentCostIdentifier(requestPayload)
            .then(
                identifiers => {
                    dispatch(success(identifiers))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: AddDocumentCostIdentifier.ADD_DOCUMENT_TYPE_IDENTIFIER_RESET })
                }, 0)
            })
    },
    editDocumentCostIdentifier: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_REQUEST, payload: [] })
        const success = (identifiers: any) => ({ type: EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_SUCCESS, payload: identifiers })
        const failure = () => ({ type: EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_FAILURE, payload: [] })

        dispatch(request())

        documentTypeIdentifierService.addDocumentCostIdentifier(requestPayload)
            .then(
                identifiers => {
                    dispatch(success(identifiers))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: EditDocumentCostIdentifier.EDIT_DOCUMENT_TYPE_IDENTIFIER_RESET })
                }, 0)
            })
    },
    deleteDocumentCostIdentifier: (docTypeCode: string) => (dispatch: any) => {
        const request = () => ({ type: DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_REQUEST, payload: [] })
        const success = (identifiers: any) => ({ type: DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_SUCCESS, payload: identifiers })
        const failure = () => ({ type: DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_FAILURE, payload: [] })

        dispatch(request())

        documentTypeIdentifierService.deleteDocumentCostIdentifier(docTypeCode)
            .then(
                identifiers => {
                    dispatch(success(identifiers))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteDocumentCostIdentifier.DELETE_DOCUMENT_TYPE_IDENTIFIER_RESET })
                }, 0)
            })
    }
}