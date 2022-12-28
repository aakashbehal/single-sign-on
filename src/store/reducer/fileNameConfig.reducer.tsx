import { Conjunction, FieldOptions, UserFileNamingConfig } from "../types.d"

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
        default:
            return state
    }
}

export default fileNameConfigReducer;