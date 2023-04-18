import {
    DocTypes,
    CommunicationType,
    BankruptcyType,
    DocumentsType,
    ProductTypes
} from "../../types.d";
import { commonServices } from "../../../services"

export const TypesActionCreator = {

    getDocTypes: (type: any) => (dispatch: any) => {
        const request = () => ({ type: DocTypes.DOC_TYPES_REQUEST })
        const success = (compliance: any) => ({ type: DocTypes.DOC_TYPES_SUCCESS, payload: compliance })
        const failure = (error: any) => ({ type: DocTypes.DOC_TYPES_FAILURE, payload: error })

        dispatch(request())

        commonServices.getFilterTypes(type)
            .then(
                compliance => {
                    compliance.sort((a: any, b: any) => {
                        if (a.keyvalue > b.keyvalue) return 1
                        else if (a.keyvalue < b.keyvalue) return -1
                        else return 0
                    })
                    dispatch(success(compliance))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getCommunicationType: (type: any) => (dispatch: any) => {
        const request = () => ({ type: CommunicationType.COMMUNICATION_TYPE_REQUEST })
        const success = (types: any) => ({ type: CommunicationType.COMMUNICATION_TYPE_SUCCESS, payload: types })
        const failure = (error: any) => ({ type: CommunicationType.COMMUNICATION_TYPE_FAILURE, payload: error })

        dispatch(request())

        commonServices.getFilterTypes(type)
            .then(
                types => {
                    dispatch(success(types))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getBankruptcyType: () => (dispatch: any) => {
        const request = () => ({ type: BankruptcyType.BANKRUPTCY_TYPE_REQUEST })
        const success = (compliance: any) => ({ type: BankruptcyType.BANKRUPTCY_TYPE_SUCCESS, payload: compliance })
        const failure = (error: any) => ({ type: BankruptcyType.BANKRUPTCY_TYPE_FAILURE, payload: error })

        dispatch(request())

        commonServices.getFilterTypes(`bankruptcy_type`)
            .then(
                compliance => {
                    dispatch(success(compliance))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getDocumentTypes: () => (dispatch: any) => {
        const request = () => ({ type: DocumentsType.DOCUMENTS_TYPE_REQUEST })
        const success = (compliance: any) => ({ type: DocumentsType.DOCUMENTS_TYPE_SUCCESS, payload: compliance })
        const failure = (error: any) => ({ type: DocumentsType.DOCUMENTS_TYPE_FAILURE, payload: error })

        dispatch(request())

        commonServices.getDocumentTypes()
            .then(
                compliance => {
                    dispatch(success(compliance))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getProductTypes: () => (dispatch: any) => {
        const request = () => ({ type: ProductTypes.PRODUCT_TYPE_REQUEST })
        const success = (products: any) => ({ type: ProductTypes.PRODUCT_TYPE_SUCCESS, payload: products })
        const failure = (error: any) => ({ type: ProductTypes.PRODUCT_TYPE_FAILURE, payload: error })

        dispatch(request())

        commonServices.getProductTypes()
            .then(
                products => {
                    dispatch(success(products))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    }
}
