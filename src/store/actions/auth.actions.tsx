import { AuthTypes } from "../types.d";
import { userService } from "../../services"

export const LoginActionCreator = {
    login: ({ username, password }: { username: string, password: string }) => (dispatch: any) => {
        const request = (user: any) => ({ type: AuthTypes.LOGIN_REQUEST, payload: user })
        const success = (user: any) => ({ type: AuthTypes.LOGIN_SUCCESS, payload: user })
        const failure = (user: any) => ({ type: AuthTypes.LOGIN_FAILURE, payload: user })

        dispatch(request({ username }))

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: AuthTypes.LOGIN_RESET }))
    },

    logout: () => (dispatch: any) => {
        userService.logout()
        dispatch({ type: AuthTypes.LOGOUT })
    },

    resetUser: () => (dispatch: any) => {
        dispatch({ type: AuthTypes.LOGOUT })
    }
}