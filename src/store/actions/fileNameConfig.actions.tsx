import {
    Conjunction,
    FieldOptions,
    UserFileNamingConfig,
    UserRetentionPolicy,
    UserSeparator,
    UserDocumentPolicy,
    SaveUserConfiguration,
    RetentionPolicy,
    DocumentPolicy,
    UserListOfUserConfig,
    DeleteUserConfiguration
} from "../types.d";
import { commonServices, fileNameConfigService } from "../../services"

export const FileNameConfigActionCreator = {
    getConjunction: () => (dispatch: any) => {
        const request = () => ({ type: Conjunction.CONJUNCTION_REQUEST })
        const success = (user: any) => ({ type: Conjunction.CONJUNCTION_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: Conjunction.CONJUNCTION_FAILURE, payload: error })

        dispatch(request())

        commonServices.getLookupValuesEQDocs({ lookupGroupKeyValue: 'CONJUNCTION_TYPE' })
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getFieldOptions: () => (dispatch: any) => {
        const request = () => ({ type: FieldOptions.FIELD_OPTIONS_REQUEST })
        const success = (user: any) => ({ type: FieldOptions.FIELD_OPTIONS_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: FieldOptions.FIELD_OPTIONS_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getConfig()
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getRetentionPolicy: () => (dispatch: any) => {
        const request = () => ({ type: RetentionPolicy.RETENTION_POLICY_REQUEST })
        const success = (user: any) => ({ type: RetentionPolicy.RETENTION_POLICY_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: RetentionPolicy.RETENTION_POLICY_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getConfig()
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getDocumentPolicy: () => (dispatch: any) => {
        const request = () => ({ type: DocumentPolicy.DOCUMENT_POLICY_REQUEST })
        const success = (user: any) => ({ type: DocumentPolicy.DOCUMENT_POLICY_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: DocumentPolicy.DOCUMENT_POLICY_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getConfig()
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getUserConfig: () => (dispatch: any) => {
        const request = () => ({ type: UserFileNamingConfig.USER_FILE_NAMING_CONFIG_REQUEST })
        const success = (userNameConfig: any) => ({ type: UserFileNamingConfig.USER_FILE_NAMING_CONFIG_SUCCESS, payload: userNameConfig })
        const failure = (error: any) => ({ type: UserFileNamingConfig.USER_FILE_NAMING_CONFIG_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getUserConfig({ fileNameConfig: 'FIELD' })
            .then(
                userNameConfig => {
                    dispatch(success(userNameConfig))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getListOfUserConfig: () => (dispatch: any) => {
        const request = () => ({ type: UserListOfUserConfig.USER_LIST_OF_FILE_NAMING_CONFIG_REQUEST })
        const success = (list: any) => ({ type: UserListOfUserConfig.USER_LIST_OF_FILE_NAMING_CONFIG_SUCCESS, payload: list })
        const failure = (error: any) => ({ type: UserListOfUserConfig.USER_LIST_OF_FILE_NAMING_CONFIG_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getListOfUserConfig()
            .then(
                list => {
                    dispatch(success(list))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getUserRetentionPolicy: () => (dispatch: any) => {
        const request = () => ({ type: UserRetentionPolicy.USER_RETENTION_POLICY_REQUEST })
        const success = (userNameConfig: any) => ({ type: UserRetentionPolicy.USER_RETENTION_POLICY_SUCCESS, payload: userNameConfig })
        const failure = (error: any) => ({ type: UserRetentionPolicy.USER_RETENTION_POLICY_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getUserConfig({ fileNameConfig: 'RETENTION_POLICY' })
            .then(
                userNameConfig => {
                    dispatch(success(userNameConfig))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getUserSeparator: () => (dispatch: any) => {
        const request = () => ({ type: UserSeparator.USER_SEPARATOR_REQUEST })
        const success = (userNameConfig: any) => ({ type: UserSeparator.USER_SEPARATOR_SUCCESS, payload: userNameConfig })
        const failure = (error: any) => ({ type: UserSeparator.USER_SEPARATOR_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getUserConfig({ fileNameConfig: 'SEPARATOR' })
            .then(
                userNameConfig => {
                    dispatch(success(userNameConfig))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getUserDocumentPolicy: () => (dispatch: any) => {
        const request = () => ({ type: UserDocumentPolicy.USER_DOCUMENT_POLICY_REQUEST })
        const success = (userNameConfig: any) => ({ type: UserDocumentPolicy.USER_DOCUMENT_POLICY_SUCCESS, payload: userNameConfig })
        const failure = (error: any) => ({ type: UserDocumentPolicy.USER_DOCUMENT_POLICY_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.getUserConfig({ fileNameConfig: 'DOCUMENT_POLICY' })
            .then(
                userNameConfig => {
                    dispatch(success(userNameConfig))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    saveUserConfiguration: (requestBody: any) => (dispatch: any) => {
        const request = () => ({ type: SaveUserConfiguration.SAVE_USER_CONFIG_REQUEST })
        const success = (userNameConfig: any) => ({ type: SaveUserConfiguration.SAVE_USER_CONFIG_SUCCESS, payload: userNameConfig })
        const failure = (error: any) => ({ type: SaveUserConfiguration.SAVE_USER_CONFIG_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.saveUserConfiguration(requestBody)
            .then(
                userNameConfig => {
                    dispatch(success(userNameConfig))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: SaveUserConfiguration.SAVE_USER_CONFIG_RESET })
                }, 0)
            })
    },
    deleteUserConfiguration: (namingConfigGroupCode: string) => (dispatch: any) => {
        const request = () => ({ type: DeleteUserConfiguration.DELETE_USER_CONFIG_REQUEST })
        const success = (userNameConfig: any) => ({ type: DeleteUserConfiguration.DELETE_USER_CONFIG_SUCCESS, payload: userNameConfig })
        const failure = (error: any) => ({ type: DeleteUserConfiguration.DELETE_USER_CONFIG_FAILURE, payload: error })

        dispatch(request())

        fileNameConfigService.deleteUserConfiguration(namingConfigGroupCode)
            .then(
                userNameConfig => {
                    dispatch(success(userNameConfig))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => {
                setTimeout(() => {
                    dispatch({ type: DeleteUserConfiguration.DELETE_USER_CONFIG_RESET })
                }, 0)
            })
    }
}