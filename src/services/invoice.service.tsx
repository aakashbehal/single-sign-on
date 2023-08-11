
import { handleResponse, axiosCustom } from "../helpers/util"

const GetInvoices = async (tenure: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/invoice`, {
            params: {
                tenure
            }
        })
        const data = handleResponse(response)
        data.response.tenure = tenure
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const invoiceService = {
    GetInvoices,
}