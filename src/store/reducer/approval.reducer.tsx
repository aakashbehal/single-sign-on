import {
    GetAllUsers,
    ApproveUser
} from "../types.d"

const initialState = {
    data: [],
    error: false,
    loading: false,
    approving: false,
    approvingSuccess: false,
    approvingError: false
}

const approvalReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case GetAllUsers.GET_ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: false,
                data: [],
                totalCount: 0
            }
        case GetAllUsers.GET_ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            }
        case GetAllUsers.GET_ALL_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                data: [],
            }
        case GetAllUsers.GET_ALL_USERS_RESET:
            return {
                ...state,
                loading: false,
                error: false,
                data: [],
            }
        case ApproveUser.APPROVE_USER_REQUEST:
            return {
                ...state,
                approving: true,
                approvingSuccess: false,
                approvingError: false
            }
        case ApproveUser.APPROVE_USER_SUCCESS:
            return {
                ...state,
                approving: false,
                approvingSuccess: true,
                approvingError: false
            }
        case ApproveUser.APPROVE_USER_FAILURE:
            return {
                ...state,
                approving: false,
                approvingSuccess: false,
                approvingError: true
            }
        case ApproveUser.APPROVE_USER_RESET:
            return {
                ...state,
                approving: false,
                approvingSuccess: false,
                approvingError: false
            }
        default:
            return state
    }
}

export default approvalReducer