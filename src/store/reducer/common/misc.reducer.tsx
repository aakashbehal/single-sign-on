import {
    Clients,
    AgencyName,
    AppId,
    RecordStatus,
    RecordSource,
    States,
    CommunicationChannel,
    AccountConfig,
    Status,
    SaveColumn,
    AllTableColumns,
    ClientAccountNumbers
} from "../../types.d";

const initialState = {
    client: {
        data: [],
        loading: false,
        error: false
    },
    status: {
        data: [],
        loading: false,
        error: false
    },

    agency: {
        data: [],
        loading: false,
        error: false
    },
    app: {
        data: null,
        loading: false,
        error: false
    },
    recordSource: {
        data: null,
        loading: false,
        error: false
    },
    recordStatus: {
        data: null,
        loading: false,
        error: false,
    },
    accountConfig: {
        config: [],
        loading: false
    },
    state: {
        data: [],
        loading: false,
        error: false
    },
    communicationChannel: {
        data: [],
        loading: false,
        error: false
    },
    column: {
        loading: false,
        error: false,
        success: false
    },
    allTableColumns: {
        data: [],
        loading: false,
        error: false
    },
    clientAccountNumbers: {
        data: [],
        loading: false,
        error: false
    }
}

const miscReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case Clients.CLIENTS_REQUEST:
            return {
                ...state,
                client: {
                    loading: true,
                    error: false
                }
            }
        case Clients.CLIENTS_SUCCESS:
            return {
                ...state,
                client: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case Clients.CLIENTS_FAILURE:
            return {
                ...state,
                client: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        case States.STATE_REQUEST:
            return {
                ...state,
                state: {
                    loading: true,
                    error: false
                }
            }
        case States.STATE_SUCCESS:
            return {
                ...state,
                state: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case States.STATE_FAILURE:
            return {
                ...state,
                state: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        case Status.STATUS_REQUEST:
            return {
                ...state,
                status: {
                    loading: true,
                    error: false
                }
            }
        case Status.STATUS_SUCCESS:
            return {
                ...state,
                status: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case Status.STATUS_FAILURE:
            return {
                ...state,
                status: {
                    loading: false,
                    error: true,
                    statuses: []
                }
            }
        case AgencyName.AGENCY_REQUEST:
            return {
                ...state,
                agency: {
                    loading: true,
                    error: false
                }
            }
        case AgencyName.AGENCY_SUCCESS:
            return {
                ...state,
                agency: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case AgencyName.AGENCY_FAILURE:
            return {
                ...state,
                agency: {
                    loading: false,
                    error: true,
                    data: []
                }
            }
        case AppId.APP_ID_REQUEST:
            return {
                ...state,
                app: {
                    loading: true,
                    error: false
                }
            }
        case AppId.APP_ID_SUCCESS:
            return {
                ...state,
                app: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case AppId.APP_ID_FAILURE:
            return {
                ...state,
                app: {
                    loading: false,
                    error: true,
                    data: {}
                }
            }
        case RecordStatus.RECORD_STATUS_REQUEST:
            return {
                ...state,
                recordStatus: {
                    loading: false,
                    error: false,
                }
            }
        case RecordStatus.RECORD_STATUS_SUCCESS:
            return {
                ...state,
                recordStatus: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case RecordStatus.RECORD_STATUS_FAILURE:
            return {
                ...state,
                recordStatus: {
                    loading: false,
                    error: true,
                    data: {}
                }
            }
        case RecordSource.RECORD_SOURCE_REQUEST:
            return {
                ...state,
                recordSource: {
                    loading: false,
                    error: false
                }
            }
        case RecordSource.RECORD_SOURCE_SUCCESS:
            return {
                ...state,
                recordSource: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case RecordSource.RECORD_SOURCE_FAILURE:
            return {
                ...state,
                recordSource: {
                    loading: false,
                    error: true,
                    data: {}
                }
            }
        case CommunicationChannel.COMMUNICATION_CHANNEL_REQUEST:
            return {
                ...state,
                communicationChannel: {
                    loading: true,
                    error: false
                }
            }
        case CommunicationChannel.COMMUNICATION_CHANNEL_SUCCESS:
            return {
                ...state,
                communicationChannel: {
                    loading: false,
                    error: false,
                    data: action.payload
                }
            }
        case CommunicationChannel.COMMUNICATION_CHANNEL_FAILURE:
            return {
                ...state,
                communicationChannel: {
                    loading: false,
                    error: true,
                    data: {}
                }
            }
        case AccountConfig.ACCOUNT_CONFIG_REQUEST:
            return {
                ...state,
                accountConfig: {
                    loading: true
                }
            }
        case AccountConfig.ACCOUNT_CONFIG_SUCCESS:
            return {
                ...state,
                accountConfig: {
                    loading: false,
                    config: action.payload
                }
            }
        case AccountConfig.ACCOUNT_CONFIG_FAILURE:
            return {
                ...state,
                accountConfig: {
                    loading: false,
                    error: true
                }
            }
        case AccountConfig.ACCOUNT_CONFIG_RESET:
            return {
                ...state,
                accountConfig: {
                    config: [],
                    error: false
                }
            }
        case SaveColumn.SAVE_COLUMN_REQUEST:
            return {
                ...state,
                column: {
                    loading: true,
                    error: false
                }
            }
        case SaveColumn.SAVE_COLUMN_SUCCESS:
            return {
                ...state,
                column: {
                    loading: false,
                    success: true
                }
            }
        case SaveColumn.SAVE_COLUMN_FAILURE:
            return {
                ...state,
                column: {
                    loading: false,
                    error: true
                }
            }
        case SaveColumn.SAVE_COLUMN_RESET:
            return {
                ...state,
                column: {
                    loading: false,
                    success: false,
                    error: false
                }
            }
        case AllTableColumns.ALL_TABLE_COLUMN_REQUEST:
            return {
                ...state,
                allTableColumns: {
                    loading: true,
                    error: false
                }
            }
        case AllTableColumns.ALL_TABLE_COLUMN_SUCCESS:
            return {
                ...state,
                allTableColumns: {
                    loading: false,
                    data: action.payload
                }
            }
        case AllTableColumns.ALL_TABLE_COLUMN_FAILURE:
            return {
                ...state,
                allTableColumns: {
                    loading: false,
                    error: true
                }
            }
        case AllTableColumns.ALL_TABLE_COLUMN_RESET:
            return {
                ...state,
                allTableColumns: {
                    loading: false,
                    data: [],
                    error: false
                }
            }
        case ClientAccountNumbers.CLIENT_ACCOUNT_NUMBERS_REQUEST:
            return {
                ...state,
                clientAccountNumbers: {
                    loading: true,
                    error: false
                }
            }
        case ClientAccountNumbers.CLIENT_ACCOUNT_NUMBERS_SUCCESS:
            return {
                ...state,
                clientAccountNumbers: {
                    loading: false,
                    data: action.payload
                }
            }
        case ClientAccountNumbers.CLIENT_ACCOUNT_NUMBERS_FAILURE:
            return {
                ...state,
                clientAccountNumbers: {
                    loading: false,
                    error: true
                }
            }
        case ClientAccountNumbers.CLIENT_ACCOUNT_NUMBERS_RESET:
            return {
                ...state,
                clientAccountNumbers: {
                    loading: false,
                    data: [],
                    error: false
                }
            }
        default:
            return state
    }
}

export default miscReducer;
