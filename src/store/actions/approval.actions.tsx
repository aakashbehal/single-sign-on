import {
    GetAllUsers,
    ApproveUser
} from "../types.d"
import { approvalService } from "../../services"

export const ApprovalActionCreator = {
    getAllUsers: () => (dispatch: any) => {
        const request = () => ({ type: GetAllUsers.GET_ALL_USERS_REQUEST })
        const success = (users: any) => ({ type: GetAllUsers.GET_ALL_USERS_SUCCESS, payload: users })
        const failure = (error: any) => ({ type: GetAllUsers.GET_ALL_USERS_FAILURE, payload: error })

        dispatch(request())

        approvalService.getAllUsers()
            .then(
                users => {
                    dispatch(success(users))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    approveUser: (requestPayload: any) => (dispatch: any) => {
        const request = () => ({ type: ApproveUser.APPROVE_USER_REQUEST })
        const success = (user: any) => ({ type: ApproveUser.APPROVE_USER_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: ApproveUser.APPROVE_USER_FAILURE, payload: error })

        dispatch(request())

        approvalService.approveUser(requestPayload)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() =>
                setTimeout(() => {
                    dispatch({ type: ApproveUser.APPROVE_USER_RESET })
                }, 0)
            )
    }
}