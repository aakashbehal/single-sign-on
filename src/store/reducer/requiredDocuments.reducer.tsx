import { RequiredDocuments } from "../types.d";

const initialState = {
    data: [],
    error: false,
    loading: false
}

const requiredDocumentsReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case RequiredDocuments.REQUIRED_DOCUMENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case RequiredDocuments.REQUIRED_DOCUMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case RequiredDocuments.REQUIRED_DOCUMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case RequiredDocuments.REQUIRED_DOCUMENTS_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: []
            }
        default:
            return state
    }
}

export default requiredDocumentsReducer;