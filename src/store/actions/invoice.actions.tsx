import { GetInvoice } from "../types.d";
import { invoiceService } from "../../services"

export const InvoiceActionCreator = {
    getInvoice: (tenure: any) => (dispatch: any) => {
        const request = () => ({ type: GetInvoice.GET_INVOICE_REQUEST, payload: [] })
        const success = (users: any) => ({ type: GetInvoice.GET_INVOICE_SUCCESS, payload: users })
        const failure = () => ({ type: GetInvoice.GET_INVOICE_FAILURE, payload: [] })

        dispatch(request())

        invoiceService.GetInvoices(tenure)
            .then(
                users => {
                    dispatch(success(users))
                },
                error => {
                    dispatch(failure())
                }
            )
    }
}