import { Registration, validateOrgName } from "../types.d";
import { registrationService } from "../../services"

export const RegistrationActionCreator = {
    registration: (requestData) => (dispatch: any) => {
        const request = () => ({ type: Registration.REGISTRATION_REQUEST })
        const success = (report: any) => ({ type: Registration.REGISTRATION_SUCCESS, payload: report })
        const failure = (error: any) => ({ type: Registration.REGISTRATION_FAILURE, payload: error })

        dispatch(request())

        registrationService.registration(requestData)
            .then(
                report => {
                    dispatch(success(report))
                },
                error => {
                    dispatch(failure(error))
                }
            )
            .finally(() => {
                dispatch({ type: Registration.REGISTRATION_RESET })
            })
    },
    validateOrgName: (orgName, orgType) => (dispatch: any) => {
        const request = () => ({ type: validateOrgName.ORG_NAME_VALIDATION_REQUEST })
        const success = (report: any) => ({ type: validateOrgName.ORG_NAME_VALIDATION_SUCCESS, payload: report })
        const failure = (error: any) => ({ type: validateOrgName.ORG_NAME_VALIDATION_FAILURE, payload: error })

        dispatch(request())

        registrationService.validateOrgName(orgName, orgType)
            .then(
                report => {
                    dispatch(success(report))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    }
}