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
    TimeZones,
    PlacementReconciliationStatus,
    LogIssue,
    ReportingIssue
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
    getPlacementStatus: (type: any) => (dispatch: any) => {
        const request = () => ({ type: PlacementReconciliationStatus.PLACEMENT_RECONCILIATION_STATUS_REQUEST })
        const success = (agencies: any) => ({ type: PlacementReconciliationStatus.PLACEMENT_RECONCILIATION_STATUS_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: PlacementReconciliationStatus.PLACEMENT_RECONCILIATION_STATUS_FAILURE, payload: error })

        dispatch(request())

        commonServices.getFilterTypes(type)
            .then(
                types => {
                    dispatch(success(types))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getCountryTimeZone: () => (dispatch: any) => {
        const request = () => ({ type: TimeZones.TIME_ZONE_REQUEST })
        const success = (agencies: any) => ({ type: TimeZones.TIME_ZONE_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: TimeZones.TIME_ZONE_FAILURE, payload: error })

        dispatch(request())

        commonServices.getCountryTimeZone()
            .then(
                types => {
                    dispatch(success(types))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    logIssue: (data: any) => (dispatch: any) => {
        dispatch(({ type: LogIssue.LOG_ISSUE, payload: data }))
    },
    reportIssue: (issueData: any) => (dispatch: any) => {
        const request = () => ({ type: ReportingIssue.REPORTING_ISSUE_REQUESTED })
        const success = (agencies: any) => ({ type: ReportingIssue.REPORTING_ISSUE_SUCCESS, payload: agencies })
        const failure = (error: any) => ({ type: ReportingIssue.REPORTING_ISSUE_FAILURE, payload: error })

        dispatch(request())

        commonServices.reportIssue(issueData)
            .then(
                types => {
                    dispatch(success(types))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: ReportingIssue.REPORTING_ISSUE_RESET }))
    }
}
