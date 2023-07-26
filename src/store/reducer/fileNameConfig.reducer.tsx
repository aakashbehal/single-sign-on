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
} from "../types.d"

const initialState = {
    conjunction: {
        loading: false,
        error: false,
        data: []
    },
    fieldOptions: {
        loading: false,
        error: false,
        data: []
    },
    fileNamingConfig: {
        loading: false,
        error: false,
        data: {}
    },
    fileNamingConfigList: {
        loading: false,
        error: false,
        data: [],
        deleteRequest: false,
        deleteSuccess: false,
        deleteError: false
    },
    userConjunction: {
        loading: false,
        error: false,
        data: {}
    },
    retentionPolicy: {
        loading: false,
        error: false,
        data: {}
    },
    documentPolicy: {
        loading: false,
        error: false,
        data: {}
    },
    userRetentionPolicy: {
        loading: false,
        error: false,
        data: {}
    },
    userDocumentPolicy: {
        loading: false,
        error: false,
        data: {}
    },
    saveConfig: {
        loading: false,
        error: false,
        success: false
    }
}

const fileNameConfigReducer = (state = initialState, action: { type: any, payload: any }) => {
    switch (action.type) {
        case Conjunction.CONJUNCTION_REQUEST:
            return {
                ...state,
                conjunction: {
                    ...state.conjunction,
                    loading: true,
                    error: false
                }
            }
        case Conjunction.CONJUNCTION_SUCCESS:
            return {
                ...state,
                conjunction: {
                    ...state.conjunction,
                    loading: false,
                    data: action.payload
                }
            }
        case Conjunction.CONJUNCTION_FAILURE:
            return {
                ...state,
                conjunction: {
                    ...state.conjunction,
                    loading: false,
                    error: true
                }
            }
        case FieldOptions.FIELD_OPTIONS_REQUEST:
            return {
                ...state,
                fieldOptions: {
                    ...state.fieldOptions,
                    loading: true,
                    error: false
                }
            }
        case FieldOptions.FIELD_OPTIONS_SUCCESS:
            return {
                ...state,
                fieldOptions: {
                    ...state.fieldOptions,
                    loading: false,
                    data: action.payload
                }
            }
        case FieldOptions.FIELD_OPTIONS_FAILURE:
            return {
                ...state,
                fieldOptions: {
                    ...state.fieldOptions,
                    loading: false,
                    error: true
                }
            }
        case UserFileNamingConfig.USER_FILE_NAMING_CONFIG_REQUEST:
            return {
                ...state,
                fileNamingConfig: {
                    ...state.fileNamingConfig,
                    loading: true,
                    error: false
                }
            }
        case UserFileNamingConfig.USER_FILE_NAMING_CONFIG_SUCCESS:
            return {
                ...state,
                fileNamingConfig: {
                    ...state.fileNamingConfig,
                    loading: false,
                    data: action.payload
                }
            }
        case UserFileNamingConfig.USER_FILE_NAMING_CONFIG_FAILURE:
            return {
                ...state,
                fileNamingConfig: {
                    ...state.fileNamingConfig,
                    loading: false,
                    error: true
                }
            }
        case UserListOfUserConfig.USER_LIST_OF_FILE_NAMING_CONFIG_REQUEST:
            return {
                ...state,
                fileNamingConfigList: {
                    ...state.fileNamingConfigList,
                    loading: true,
                    error: false
                }
            }
        case UserListOfUserConfig.USER_LIST_OF_FILE_NAMING_CONFIG_SUCCESS:
            return {
                ...state,
                fileNamingConfigList: {
                    ...state.fileNamingConfigList,
                    loading: false,
                    data: action.payload
                }
            }
        case UserListOfUserConfig.USER_LIST_OF_FILE_NAMING_CONFIG_FAILURE:
            return {
                ...state,
                fileNamingConfigList: {
                    ...state.fileNamingConfigList,
                    loading: false,
                    error: true
                }
            }
        case DeleteUserConfiguration.DELETE_USER_CONFIG_REQUEST:
            return {
                ...state,
                fileNamingConfigList: {
                    ...state.fileNamingConfigList,
                    deleteRequest: true,
                    deleteSuccess: false,
                    deleteError: false,
                }
            }
        case DeleteUserConfiguration.DELETE_USER_CONFIG_SUCCESS:
            return {
                ...state,
                fileNamingConfigList: {
                    ...state.fileNamingConfigList,
                    deleteRequest: false,
                    deleteSuccess: true,
                    deleteError: false,
                }
            }
        case DeleteUserConfiguration.DELETE_USER_CONFIG_FAILURE:
            return {
                ...state,
                fileNamingConfigList: {
                    ...state.fileNamingConfigList,
                    deleteRequest: false,
                    deleteSuccess: false,
                    deleteError: true,
                }
            }
        case DeleteUserConfiguration.DELETE_USER_CONFIG_RESET:
            return {
                ...state,
                fileNamingConfigList: {
                    ...state.fileNamingConfigList,
                    deleteRequest: false,
                    deleteSuccess: false,
                    deleteError: false,
                }
            }
        case UserSeparator.USER_SEPARATOR_REQUEST:
            return {
                ...state,
                userConjunction: {
                    ...state.userConjunction,
                    loading: true,
                    error: false
                }
            }
        case UserSeparator.USER_SEPARATOR_SUCCESS:
            return {
                ...state,
                userConjunction: {
                    ...state.userConjunction,
                    loading: false,
                    data: action.payload
                }
            }
        case UserSeparator.USER_SEPARATOR_FAILURE:
            return {
                ...state,
                userConjunction: {
                    ...state.userConjunction,
                    loading: false,
                    error: true
                }
            }
        case UserRetentionPolicy.USER_RETENTION_POLICY_REQUEST:
            return {
                ...state,
                userRetentionPolicy: {
                    ...state.userRetentionPolicy,
                    loading: true,
                    error: false
                }
            }
        case UserRetentionPolicy.USER_RETENTION_POLICY_SUCCESS:
            return {
                ...state,
                userRetentionPolicy: {
                    ...state.userRetentionPolicy,
                    loading: false,
                    data: action.payload[0]
                }
            }
        case UserRetentionPolicy.USER_RETENTION_POLICY_FAILURE:
            return {
                ...state,
                userRetentionPolicy: {
                    ...state.userRetentionPolicy,
                    loading: false,
                    error: true
                }
            }
        case UserDocumentPolicy.USER_DOCUMENT_POLICY_REQUEST:
            return {
                ...state,
                userDocumentPolicy: {
                    ...state.userDocumentPolicy,
                    loading: true,
                    error: false
                }
            }
        case UserDocumentPolicy.USER_DOCUMENT_POLICY_SUCCESS:
            return {
                ...state,
                userDocumentPolicy: {
                    ...state.userDocumentPolicy,
                    loading: false,
                    data: action.payload[0]
                }
            }
        case UserDocumentPolicy.USER_DOCUMENT_POLICY_FAILURE:
            return {
                ...state,
                userDocumentPolicy: {
                    ...state.userDocumentPolicy,
                    loading: false,
                    error: true
                }
            }
        case RetentionPolicy.RETENTION_POLICY_REQUEST:
            return {
                ...state,
                retentionPolicy: {
                    ...state.retentionPolicy,
                    loading: true,
                    error: false
                }
            }
        case RetentionPolicy.RETENTION_POLICY_SUCCESS:
            return {
                ...state,
                retentionPolicy: {
                    ...state.retentionPolicy,
                    loading: false,
                    data: action.payload[0]
                }
            }
        case RetentionPolicy.RETENTION_POLICY_FAILURE:
            return {
                ...state,
                retentionPolicy: {
                    ...state.retentionPolicy,
                    loading: false,
                    error: true
                }
            }
        case DocumentPolicy.DOCUMENT_POLICY_REQUEST:
            return {
                ...state,
                documentPolicy: {
                    ...state.documentPolicy,
                    loading: true,
                    error: false
                }
            }
        case DocumentPolicy.DOCUMENT_POLICY_SUCCESS:
            return {
                ...state,
                documentPolicy: {
                    ...state.documentPolicy,
                    loading: false,
                    data: action.payload
                }
            }
        case DocumentPolicy.DOCUMENT_POLICY_FAILURE:
            return {
                ...state,
                documentPolicy: {
                    ...state.documentPolicy,
                    loading: false,
                    error: true
                }
            }
        case SaveUserConfiguration.SAVE_USER_CONFIG_REQUEST:
            return {
                ...state,
                saveConfig: {
                    ...state.saveConfig,
                    loading: true
                }
            }
        case SaveUserConfiguration.SAVE_USER_CONFIG_SUCCESS:
            return {
                ...state,
                saveConfig: {
                    ...state.saveConfig,
                    loading: false,
                    success: true
                }
            }
        case SaveUserConfiguration.SAVE_USER_CONFIG_FAILURE:
            return {
                ...state,
                saveConfig: {
                    ...state.saveConfig,
                    loading: false,
                    error: true
                }
            }
        case SaveUserConfiguration.SAVE_USER_CONFIG_RESET:
            return {
                ...state,
                saveConfig: {
                    ...state.saveConfig,
                    loading: false,
                    error: false,
                    success: false
                }
            }
        default:
            return state
    }
}

export default fileNameConfigReducer;