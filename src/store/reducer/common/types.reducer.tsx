import {
    DocTypes,
    Types,
    PhoneTypes,
    AddressTypes,
    CommunicationType,
    BankruptcyType
} from "../../types.d";

const initialState = {
    type: {
        data: [],
        loading: false,
        error: false
    },
    phoneType: {
        data: [],
        loading: false,
        error: false
    },
    addressType: {
        data: [],
        loading: false,
        error: false
    },
    docTypes: {
        data: [],
        loading: false,
        error: false
    },
    communicationTypes: {
        data: [],
        loading: false,
        error: false
    },
    bankruptcyType: {
        data: [],
        loading: false,
        error: false
    }
}

const typesReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case DocTypes.DOC_TYPES_REQUEST:
            return {
                ...state,
                docTypes: {
                    loading: false,
                    error: false
                }
            }
        case DocTypes.DOC_TYPES_SUCCESS:
            return {
                ...state,
                docTypes: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case DocTypes.DOC_TYPES_FAILURE:
            return {
                ...state,
                docTypes: {
                    loading: false,
                    error: true,
                    data: {}
                }
            }
        case Types.TYPES_REQUEST:
            return {
                ...state,
                type: {
                    loading: true,
                    error: false
                }
            }
        case Types.TYPES_SUCCESS:
            return {
                ...state,
                type: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case Types.TYPES_FAILURE:
            return {
                ...state,
                type: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        case PhoneTypes.PHONE_TYPES_REQUEST:
            return {
                ...state,
                phoneType: {
                    loading: true,
                    error: false
                }
            }
        case PhoneTypes.PHONE_TYPES_SUCCESS:
            return {
                ...state,
                phoneType: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case PhoneTypes.PHONE_TYPES_FAILURE:
            return {
                ...state,
                phoneType: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        case AddressTypes.ADDRESS_TYPES_REQUEST:
            return {
                ...state,
                addressType: {
                    loading: true,
                    error: false
                }
            }
        case AddressTypes.ADDRESS_TYPES_SUCCESS:
            return {
                ...state,
                addressType: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case AddressTypes.ADDRESS_TYPES_FAILURE:
            return {
                ...state,
                addressType: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        case CommunicationType.COMMUNICATION_TYPE_REQUEST:
            return {
                ...state,
                communicationTypes: {
                    loading: true,
                    error: false
                }
            }
        case CommunicationType.COMMUNICATION_TYPE_SUCCESS:
            return {
                ...state,
                communicationTypes: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case CommunicationType.COMMUNICATION_TYPE_FAILURE:
            return {
                ...state,
                communicationTypes: {
                    loading: false,
                    error: true,
                    data: {}
                }
            }
        case BankruptcyType.BANKRUPTCY_TYPE_REQUEST:
            return {
                ...state,
                bankruptcyType: {
                    loading: true,
                    error: false
                }
            }
        case BankruptcyType.BANKRUPTCY_TYPE_SUCCESS:
            return {
                ...state,
                bankruptcyType: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case BankruptcyType.BANKRUPTCY_TYPE_FAILURE:
            return {
                ...state,
                bankruptcyType: {
                    loading: false,
                    error: true,
                    data: {}
                }
            }
        default:
            return state
    }
}

export default typesReducer;
