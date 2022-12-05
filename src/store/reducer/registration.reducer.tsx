import { Registration, validateOrgName } from "../types.d";

const initialState = {
    loadingRegistration: false,
    errorRegistration: null,
    successRegistration: null,
    loadingOrgName: false,
    errorOrgName: null,
    successOrgName: null,
}

const registrationReducer = (state = initialState, action: { type: any; payload: any }) => {
    switch (action.type) {
        case Registration.REGISTRATION_REQUEST:
            return {
                ...state,
                loadingRegistration: true,
                errorRegistration: false
            }
        case Registration.REGISTRATION_SUCCESS:
            return {
                ...state,
                loadingRegistration: false,
                successRegistration: action.payload,
            }
        case Registration.REGISTRATION_FAILURE:
            return {
                ...state,
                loadingRegistration: false,
                errorRegistration: action.payload
            }
        case Registration.REGISTRATION_RESET:
            return {
                ...state,
                loadingRegistration: false,
                errorRegistration: null,
                successRegistration: null
            }
        case validateOrgName.ORG_NAME_VALIDATION_REQUEST:
            return {
                ...state,
                loadingOrgName: true,
                errorOrgName: null,
                successOrgName: null
            }
        case validateOrgName.ORG_NAME_VALIDATION_SUCCESS:
            return {
                ...state,
                loadingOrgName: false,
                successOrgName: action.payload,
            }
        case validateOrgName.ORG_NAME_VALIDATION_FAILURE:
            return {
                ...state,
                loadingOrgName: false,
                errorOrgName: action.payload
            }
        case validateOrgName.ORG_NAME_VALIDATION_RESET:
            return {
                ...state,
                loadingOrgName: false,
                errorOrgName: null,
                successOrgName: null
            }
        default:
            return state
    }
}

export default registrationReducer;