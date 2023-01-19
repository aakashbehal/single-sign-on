import { DocumentsCost } from "../types.d";

const initialState = {
    data: [],
    error: false,
    loading: false
}

const documentCostReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case DocumentsCost.DOCUMENTS_COST_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case DocumentsCost.DOCUMENTS_COST_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case DocumentsCost.DOCUMENTS_COST_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case DocumentsCost.DOCUMENTS_COST_RESET:
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

export default documentCostReducer;