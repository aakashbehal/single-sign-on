import { ConnectedUsers } from "../types.d";
import { userService } from "../../services"

export const UserActionCreator = {
    getConnectedUsers: () => (dispatch: any) => {
        const request = () => ({ type: ConnectedUsers.CONNECTED_USER_REQUEST, payload: [] })
        const success = (users: any) => ({ type: ConnectedUsers.CONNECTED_USER_SUCCESS, payload: users })
        const failure = () => ({ type: ConnectedUsers.CONNECTED_USER_FAILURE, payload: [] })

        dispatch(request())

        userService.getConnectedUsers()
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