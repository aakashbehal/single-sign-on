import {
    AgencyName,
    Clients,
    AppId,
    RecordStatus,
    Status,
    RecordSource,
    States,
    CommunicationChannel,
    AccountConfig,
    SaveColumn,
    AllTableColumns,
    ClientAccountNumbers,
    RecordSourceAll
} from "../../types.d";
import { commonServices } from "../../../services"

export const MiscActionCreator = {
    getClients: () => (dispatch: any) => {
        const request = () => ({ type: Clients.CLIENTS_REQUEST })
        const success = (allClients: any) => ({ type: Clients.CLIENTS_SUCCESS, payload: allClients })
        const failure = (error: any) => ({ type: Clients.CLIENTS_FAILURE, payload: error })

        dispatch(request())

        commonServices.getClients()
            .then(
                allClients => {
                    dispatch(success(allClients))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getStates: () => (dispatch: any) => {
        const request = () => ({ type: States.STATE_REQUEST })
        const success = (allStates: any) => ({ type: States.STATE_SUCCESS, payload: allStates })
        const failure = (error: any) => ({ type: States.STATE_FAILURE, payload: error })

        dispatch(request())

        commonServices.getStates()
            .then(
                allStates => {
                    dispatch(success(allStates))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getAgencies: () => (dispatch: any) => {
        const request = () => ({ type: AgencyName.AGENCY_REQUEST })
        const success = (agencies: any) => ({ type: AgencyName.AGENCY_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: AgencyName.AGENCY_FAILURE, payload: error })

        dispatch(request())

        commonServices.getAgencies()
            .then(
                agencies => {
                    dispatch(success(agencies))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    getStatus: () => (dispatch: any) => {
        const request = () => ({ type: Status.STATUS_REQUEST })
        const success = (allStatus: any) => ({ type: Status.STATUS_SUCCESS, payload: allStatus })
        const failure = (error: any) => ({ type: Status.STATUS_FAILURE, payload: error })

        dispatch(request())

        commonServices.getStatus()
            .then(
                allStatus => {
                    dispatch(success(allStatus))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    getAccountConfig: () => (dispatch: any) => {
        const request = () => ({ type: AccountConfig.ACCOUNT_CONFIG_REQUEST })
        const success = (agencies: any) => ({ type: AccountConfig.ACCOUNT_CONFIG_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: AccountConfig.ACCOUNT_CONFIG_FAILURE, payload: error })

        dispatch(request())

        commonServices.getAccountConfig()
            .then(
                lifeCycle => {
                    dispatch(success(lifeCycle))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getAppId: (type: any) => (dispatch: any) => {
        const request = () => ({ type: AppId.APP_ID_REQUEST })
        const success = (compliance: any) => ({ type: AppId.APP_ID_SUCCESS, payload: compliance })
        const failure = (error: any) => ({ type: AppId.APP_ID_FAILURE, payload: error })

        dispatch(request())

        commonServices.getAppId(type)
            .then(
                compliance => {
                    dispatch(success(compliance))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getRecordStatus: (type: any) => (dispatch: any) => {
        const request = () => ({ type: RecordStatus.RECORD_STATUS_REQUEST })
        const success = (compliance: any) => ({ type: RecordStatus.RECORD_STATUS_SUCCESS, payload: compliance })
        const failure = (error: any) => ({ type: RecordStatus.RECORD_STATUS_FAILURE, payload: error })

        dispatch(request())

        commonServices.getRecordStatus(type)
            .then(
                compliance => {
                    dispatch(success(compliance))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getRecordSource: (type: any) => (dispatch: any) => {
        const request = () => ({ type: RecordSource.RECORD_SOURCE_REQUEST })
        const success = (compliance: any) => ({ type: RecordSource.RECORD_SOURCE_SUCCESS, payload: compliance })
        const failure = (error: any) => ({ type: RecordSource.RECORD_SOURCE_FAILURE, payload: error })

        dispatch(request())

        commonServices.getRecordSource(type)
            .then(
                compliance => {
                    dispatch(success(compliance))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    getAllRecordSource: () => (dispatch: any) => {
        const request = () => ({ type: RecordSourceAll.RECORD_SOURCE_ALL_REQUEST })
        const success = (compliance: any) => ({ type: RecordSourceAll.RECORD_SOURCE_ALL_SUCCESS, payload: compliance })
        const failure = (error: any) => ({ type: RecordSourceAll.RECORD_SOURCE_ALL_FAILURE, payload: error })

        dispatch(request())

        commonServices.getAllRecordSource()
            .then(
                compliance => {
                    dispatch(success(compliance))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getCommunicationChannel: (type: any) => (dispatch: any) => {
        const request = () => ({ type: CommunicationChannel.COMMUNICATION_CHANNEL_REQUEST })
        const success = (communication: any) => ({ type: CommunicationChannel.COMMUNICATION_CHANNEL_SUCCESS, payload: communication })
        const failure = (error: any) => ({ type: CommunicationChannel.COMMUNICATION_CHANNEL_FAILURE, payload: error })

        dispatch(request())

        commonServices.getFilterTypes(type)
            .then(
                communication => {
                    dispatch(success(communication))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    saveColumn: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: SaveColumn.SAVE_COLUMN_REQUEST })
        const success = (data: any) => ({ type: SaveColumn.SAVE_COLUMN_SUCCESS, payload: data })
        const failure = (error: any) => ({ type: SaveColumn.SAVE_COLUMN_FAILURE, payload: error })

        dispatch(request())

        commonServices.saveColumn(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

    getColumnForAllTables: (table: string) => (dispatch: any) => {
        const request = () => ({ type: AllTableColumns.ALL_TABLE_COLUMN_REQUEST })
        const success = (data: any) => ({ type: AllTableColumns.ALL_TABLE_COLUMN_SUCCESS, payload: data })
        const failure = (error: any) => ({ type: AllTableColumns.ALL_TABLE_COLUMN_FAILURE, payload: error })

        dispatch(request())

        commonServices.getColumnForAllTables(table)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getClientAccountNumbers: () => (dispatch: any) => {
        const request = () => ({ type: ClientAccountNumbers.CLIENT_ACCOUNT_NUMBERS_REQUEST })
        const success = (data: any) => ({ type: ClientAccountNumbers.CLIENT_ACCOUNT_NUMBERS_SUCCESS, payload: data })
        const failure = (error: any) => ({ type: ClientAccountNumbers.CLIENT_ACCOUNT_NUMBERS_FAILURE, payload: error })

        dispatch(request())

        commonServices.getClientAccountNumbers()
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },

}
