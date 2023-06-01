import { GetInvoice } from "../types.d"

const initialState = {
    data: '',
    loading: false,
    error: false
}

const invoiceReducer = (state = initialState, action: { type: any, payload: any }) => {
    switch (action.type) {
        case GetInvoice.GET_INVOICE_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case GetInvoice.GET_INVOICE_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case GetInvoice.GET_INVOICE_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        default:
            return state
    }
}

export default invoiceReducer;