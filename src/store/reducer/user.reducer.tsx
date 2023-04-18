import { ConnectedUsers } from "../types.d";

const initialState: IUsers = {
    data: [],
    error: null,
    loading: false
}

const userReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case ConnectedUsers.CONNECTED_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case ConnectedUsers.CONNECTED_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload
            }
        case ConnectedUsers.CONNECTED_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case ConnectedUsers.CONNECTED_USER_RESET:
            return {
                ...state,
                loading: false,
                error: false
            }
        default:
            return state
    }
}

export default userReducer;