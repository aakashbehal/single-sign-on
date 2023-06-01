import { GetAllPartners, AddPartner, EditPartner, DeactivatePartner } from "../types.d";

const initialState = {
    data: [],
    error: false,
    totalCount: 0,
    loading: false,
    addPartnerSuccess: false,
    addPartnerLoading: false,
    addPartnerError: false,
    editPartnerSuccess: false,
    editPartnerLoading: false,
    editPartnerError: false,
    deactivatePartnerSuccess: false,
    deactivatePartnerLoading: false,
    deactivatePartnerError: false,

}

const partnerSetupReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetAllPartners.GET_ALL_PARTNER_REQUEST:
            return {
                ...state,
                loading: true,
                error: false
            }
        case GetAllPartners.GET_ALL_PARTNER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.partners,
                totalCount: action.payload.totalCount
            }
        case GetAllPartners.GET_ALL_PARTNER_FAILURE:
            return {
                ...state,
                loading: false,
                error: true
            }
        case GetAllPartners.GET_ALL_PARTNER_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
                totalCount: 0
            }
        case AddPartner.ADD_PARTNER_REQUEST:
            return {
                ...state,
                addPartnerLoading: true,
                addPartnerError: false,
            }
        case AddPartner.ADD_PARTNER_SUCCESS:
            return {
                ...state,
                addPartnerSuccess: true,
                addPartnerLoading: false
            }
        case AddPartner.ADD_PARTNER_FAILURE:
            return {
                ...state,
                addPartnerLoading: false,
                addPartnerError: true
            }
        case AddPartner.ADD_PARTNER_RESET:
            return {
                ...state,
                addPartnerSuccess: false,
                addPartnerLoading: false,
                addPartnerError: false,
            }
        case EditPartner.EDIT_PARTNER_REQUEST:
            return {
                ...state,
                editPartnerLoading: true,
                editPartnerError: false,
            }
        case EditPartner.EDIT_PARTNER_SUCCESS:
            return {
                ...state,
                editPartnerSuccess: true,
                editPartnerLoading: false
            }
        case EditPartner.EDIT_PARTNER_FAILURE:
            return {
                ...state,
                editPartnerLoading: false,
                editPartnerError: true
            }
        case EditPartner.EDIT_PARTNER_RESET:
            return {
                ...state,
                editPartnerSuccess: false,
                editPartnerLoading: false,
                editPartnerError: false,
            }
        case DeactivatePartner.DEACTIVATE_PARTNER_REQUEST:
            return {
                ...state,
                deactivatePartnerLoading: true,
                deactivatePartnerError: false,
            }
        case DeactivatePartner.DEACTIVATE_PARTNER_SUCCESS:
            return {
                ...state,
                deactivatePartnerSuccess: true,
                deactivatePartnerLoading: false
            }
        case DeactivatePartner.DEACTIVATE_PARTNER_FAILURE:
            return {
                ...state,
                deactivatePartnerLoading: false,
                deactivatePartnerError: true
            }
        case DeactivatePartner.DEACTIVATE_PARTNER_RESET:
            return {
                ...state,
                deactivatePartnerSuccess: false,
                deactivatePartnerLoading: false,
                deactivatePartnerError: false,
            }
        default:
            return state
    }
}

export default partnerSetupReducer;