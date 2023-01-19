import {
    DocTypes,
    CommunicationType,
    BankruptcyType,
    DocumentsType,
    ProductTypes
} from "../../types.d";

const initialState = {
    type: {
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
    },
    documentType: {
        data: [],
        loading: false,
        error: false
    },
    productType: {
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
        case DocumentsType.DOCUMENTS_TYPE_REQUEST:
            return {
                ...state,
                documentType: {
                    loading: true,
                    error: false
                }
            }
        case DocumentsType.DOCUMENTS_TYPE_SUCCESS:
            return {
                ...state,
                documentType: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case DocumentsType.DOCUMENTS_TYPE_FAILURE:
            return {
                ...state,
                documentType: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        case ProductTypes.PRODUCT_TYPE_REQUEST:
            return {
                ...state,
                productType: {
                    loading: true,
                    error: false
                }
            }
        case ProductTypes.PRODUCT_TYPE_SUCCESS:
            return {
                ...state,
                productType: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case ProductTypes.PRODUCT_TYPE_FAILURE:
            return {
                ...state,
                productType: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        default:
            return state
    }
}

export default typesReducer;
