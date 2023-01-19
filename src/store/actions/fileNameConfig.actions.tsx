import { Conjunction, FieldOptions, UserFileNamingConfig } from "../types.d";
import { fileNameConfigService } from "../../services"

export const FileNameConfigActionCreator = {
    getConjunction: (userType) => (dispatch: any) => {
        const request = () => ({ type: Conjunction.CONJUNCTION_REQUEST })
        const success = (user: any) => ({ type: Conjunction.CONJUNCTION_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: Conjunction.CONJUNCTION_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getConjunction(userType)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: Conjunction.CONJUNCTION_RESET }))
    },
    getFieldOptions: (userType) => (dispatch: any) => {
        const request = () => ({ type: FieldOptions.FIELD_OPTIONS_REQUEST })
        const success = (user: any) => ({ type: FieldOptions.FIELD_OPTIONS_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: FieldOptions.FIELD_OPTIONS_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getFieldOptions(userType)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: FieldOptions.FIELD_OPTIONS_RESET }))
    },
    getUserConfig: (userType) => (dispatch: any) => {
        const request = () => ({ type: UserFileNamingConfig.USER_FILE_NAMING_CONFIG_REQUEST })
        const success = (userNameConfig: any) => ({ type: UserFileNamingConfig.USER_FILE_NAMING_CONFIG_SUCCESS, payload: userNameConfig })
        const failure = (error: any) => ({ type: UserFileNamingConfig.USER_FILE_NAMING_CONFIG_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getUserConfig(userType)
            .then(
                userNameConfig => {
                    dispatch(success(userNameConfig))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: UserFileNamingConfig.USER_FILE_NAMING_CONFIG_RESET }))
    }
}