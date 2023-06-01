import { GetUsage } from "../types.d"

const initialState = {
    used: '',
    percentage: 0,
    total: '',
    totalDocument: 0,
    loading: false,
    error: false
}

const usageReducer = (state = initialState, action: { type: any, payload: any }) => {
    switch (action.type) {
        case GetUsage.GET_USAGE_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case GetUsage.GET_USAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.payload
            }
        case GetUsage.GET_USAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        default:
            return state
    }
}

export default usageReducer;