import { GetUsage } from "../types.d";
import { commonServices } from "../../services"

export const UsageActionCreator = {
    getUsage: () => (dispatch: any) => {
        const request = () => ({ type: GetUsage.GET_USAGE_REQUEST, payload: [] })
        const success = (users: any) => ({ type: GetUsage.GET_USAGE_SUCCESS, payload: users })
        const failure = () => ({ type: GetUsage.GET_USAGE_FAILURE, payload: [] })

        dispatch(request())

        commonServices.getUsage()
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