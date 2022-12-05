import {
    DocTypes,
    CommunicationType,
    Types,
    PhoneTypes,
    AddressTypes,
    BankruptcyType
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
                    compliance.sort((a, b) => {
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
    getAllTypes: () => (dispatch: any) => {
        const request = () => ({ type: Types.TYPES_REQUEST })
        const success = (agencies: any) => ({ type: Types.TYPES_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: Types.TYPES_FAILURE, payload: error })

        dispatch(request())

        commonServices.fetchAllTypes()
            .then(
                types => {
                    dispatch(success(types))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getPhoneType: (type: any) => (dispatch: any) => {
        const request = () => ({ type: PhoneTypes.PHONE_TYPES_REQUEST })
        const success = (agencies: any) => ({ type: PhoneTypes.PHONE_TYPES_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: PhoneTypes.PHONE_TYPES_FAILURE, payload: error })

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
    getAddressType: (type: any) => (dispatch: any) => {
        const request = () => ({ type: AddressTypes.ADDRESS_TYPES_REQUEST })
        const success = (agencies: any) => ({ type: AddressTypes.ADDRESS_TYPES_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: AddressTypes.ADDRESS_TYPES_FAILURE, payload: error })

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
}
