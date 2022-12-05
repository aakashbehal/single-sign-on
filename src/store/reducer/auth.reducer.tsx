import { AuthTypes } from "../types.d";

const initialState = {
    user: {},
    error: null,
    loading: false
}

const authReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case AuthTypes.LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case AuthTypes.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload
            }
        case AuthTypes.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case AuthTypes.LOGIN_RESET:
            return {
                ...state,
                loading: false,
                error: false
            }
        case AuthTypes.LOGOUT:
            return {}
        default:
            return state
    }
}

export default authReducer;