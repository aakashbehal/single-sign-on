import { GetAllPartners, AddPartner, EditPartner, DeactivatePartner } from "../types.d";
import { partnerServices } from "../../services"

export const PartnerSetupActionCreator = {
    getAllPartners: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: GetAllPartners.GET_ALL_PARTNER_REQUEST })
        const success = (partners: any) => ({ type: GetAllPartners.GET_ALL_PARTNER_SUCCESS, payload: partners })
        const failure = () => ({ type: GetAllPartners.GET_ALL_PARTNER_FAILURE })

        dispatch(request())

        partnerServices.getAllPartners(payload)
            .then(
                partners => {
                    dispatch(success(partners))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    addPartner: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: AddPartner.ADD_PARTNER_REQUEST })
        const success = (clients: any) => ({ type: AddPartner.ADD_PARTNER_SUCCESS, payload: clients })
        const failure = () => ({ type: AddPartner.ADD_PARTNER_FAILURE })

        dispatch(request())

        partnerServices.addPartner(payload)
            .then(
                partners => {
                    dispatch(success(partners))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => dispatch({ type: AddPartner.ADD_PARTNER_RESET }))
    },
    editPartner: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: EditPartner.EDIT_PARTNER_REQUEST })
        const success = (clients: any) => ({ type: EditPartner.EDIT_PARTNER_SUCCESS, payload: clients })
        const failure = () => ({ type: EditPartner.EDIT_PARTNER_FAILURE })

        dispatch(request())

        partnerServices.editPartner(payload)
            .then(
                partners => {
                    dispatch(success(partners))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => dispatch({ type: EditPartner.EDIT_PARTNER_RESET }))
    },
    deactivatePartner: (clientId: any) => (dispatch: any) => {
        const request = () => ({ type: DeactivatePartner.DEACTIVATE_PARTNER_REQUEST })
        const success = (clients: any) => ({ type: DeactivatePartner.DEACTIVATE_PARTNER_SUCCESS, payload: clients })
        const failure = () => ({ type: DeactivatePartner.DEACTIVATE_PARTNER_FAILURE })

        dispatch(request())

        partnerServices.deactivatePartner(clientId)
            .then(
                partners => {
                    dispatch(success(partners))
                },
                error => {
                    dispatch(failure())
                }
            ).finally(() => dispatch({ type: DeactivatePartner.DEACTIVATE_PARTNER_RESET }))
    }
}