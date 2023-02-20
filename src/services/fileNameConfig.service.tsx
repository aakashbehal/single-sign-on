
import { handleResponse, axiosCustom } from "../helpers/util"

const getConfig = async (requestParams) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/file`,
            { params: { orgType: requestParams.orgType, fieldName: requestParams.fileNameConfig } })
        const data = handleResponse(response)
        return data.response.docMgrConfigs
    } catch (error: any) {
        console.log(error)
        throw error
    }
}

const getUserConfig = async (requestParams) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/file/configuration`,
            { params: { orgType: requestParams.orgType, fieldName: requestParams.fileNameConfig } })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const handleDefaultAndSavedSelection = async (dataFieldOptions, serverOptions, userType, fieldsSelected) => {
    let allFields = [];
    if (dataFieldOptions && dataFieldOptions.length > 0) {
        allFields = dataFieldOptions[0].configVals
    }
    let selectedFields: any = []
    let notAvailableFields: any = []
    if (serverOptions && serverOptions.length === 0) {
        /**
         * Default available and selection
         */
        if (userType !== 'Client' || userType === "Equabli") {
            selectedFields = ['CIDSC', "DT", "CAN", "PC"]
            notAvailableFields = ['CIDSC', "DT", "CAN"]
        } else {
            selectedFields = ['CAN', "DT", "PC"]
            notAvailableFields = ['CIDSC', 'DT', 'CAN']
        }
    } else if (serverOptions && serverOptions.length > 0) {
        /**
         * Saved selections
         */
        serverOptions.forEach((field, index) => {
            fieldsSelected[index + 1] = field.configValSelectedCode
            selectedFields.push(field.configValSelectedCode)
            notAvailableFields.push(field.configValSelectedCode)
        })
    }
    const dataFieldOptionsFiltered = allFields.map((fO: any) => {
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
    if (!fieldsSelected[4]) {
        fieldsSelected[4] = null
    }
    if (!fieldsSelected[5]) {
        fieldsSelected[5] = null
    }
    if (!fieldsSelected[6]) {
        fieldsSelected[6] = null
    }
    if (userType === 'Partner' && !fieldsSelected[7]) {
        fieldsSelected[7] = null
    }
    console.log(dataFieldOptionsFiltered, fieldsSelected)
    let Obj = { fieldFinal: dataFieldOptionsFiltered, selectionFinal: fieldsSelected }
    return Obj
}

const saveUserConfiguration = async (requestBody) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/file/configuration`,
            requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const fileNameConfigService = {
    getConfig,
    getUserConfig,
    handleDefaultAndSavedSelection,
    saveUserConfiguration
}