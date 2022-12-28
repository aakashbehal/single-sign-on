
import { handleResponse, axiosCustom } from "../helpers/util"

const getConjunction = async () => {
    try {
        const response = await axiosCustom.get(`/conjunctionType`, {})
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getFieldOptions = async (requestParams) => {
    try {
        const response = await axiosCustom.get(`/concatVal`, { params: requestParams })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getUserConfig = async (requestParams) => {
    try {
        const response = await axiosCustom.get(`/configuration`, { params: requestParams })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const handleDefaultAndSavedSelection = async (dataFieldOptions, serverOptions, userType, fieldsSelected) => {
    let selectedFields: any = []
    let notAvailableFields: any = []
    let defaultFields: any = []
    if (userType === 'Client') {
        defaultFields = [1, 2]
    } else {
        defaultFields = [1, 2, 3]
    }
    let defaultFieldsShortCode: any = []
    if (serverOptions && serverOptions.fileConfiguration && serverOptions.fileConfiguration.length === 0) {
        /**
         * Default available and selection
         */
        if (userType !== 'Client') {
            selectedFields = ['CID', "DTI", "CAN"]
            notAvailableFields = ['CID', "DTI", "CAN"]
            defaultFieldsShortCode = ['CID', "DTI", "CAN"]
        } else {
            selectedFields = ['CAN', "DTI"]
            notAvailableFields = ['CID', 'DTI', 'CAN']
            defaultFieldsShortCode = ['CAN', "DTI"]
        }
    } else if (serverOptions && serverOptions.fileConfiguration && serverOptions.fileConfiguration.length > 0) {
        /**
         * Saved selections
         */
        serverOptions.fileConfiguration.forEach((field) => {
            fieldsSelected[field.sequence] = field.shortCode
            selectedFields.push(field.shortCode)
            notAvailableFields.push(field.shortCode)
            if (defaultFields.indexOf(field.sequence) !== -1) {
                defaultFieldsShortCode.push(field.shortCode)
            }
        })
    }
    console.log(selectedFields, notAvailableFields, defaultFieldsShortCode)
    const dataFieldOptionsFiltered = dataFieldOptions.map((fO: any) => {
        if (defaultFieldsShortCode.indexOf(fO.shortCode) !== -1) {
            fO.default = true
        } else {
            fO.default = false
        }
        if (selectedFields.indexOf(fO.shortCode) !== -1) {
            fO.selected = true
        } else {
            fO.selected = false
        }
        if (notAvailableFields.indexOf(fO.shortCode) === -1) {
            fO.available = true
        } else {
            fO.available = false
        }
        return fO
    })
    return { fieldFinal: dataFieldOptionsFiltered, selectionFinal: fieldsSelected }
}

export const fileNameConfigService = {
    getConjunction,
    getFieldOptions,
    getUserConfig,
    handleDefaultAndSavedSelection
}