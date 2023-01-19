
import { handleResponse, axiosCustom } from "../helpers/util"

const getConjunction = async (userType) => {
    try {
        const response = await axiosCustom.get(`/fileNamesConfig`, { params: { userType, fileNameConfig: 'SEPARATOR' } })
        const data = handleResponse(response)
        return data.response.docMgrConfigs[0]
    } catch (error: any) {
        throw error
    }
}

const getFieldOptions = async (userType) => {
    try {
        const response = await axiosCustom.get(`/fileNamesConfig`, { params: { userType, fileNameConfig: '' } })
        const data = handleResponse(response)
        return data.response.docMgrConfigs
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
    let allFields = [];
    if (dataFieldOptions && dataFieldOptions.length > 0) {
        allFields = dataFieldOptions[0].docMgrConfigVals
    }
    let selectedFields: any = []
    let notAvailableFields: any = []
    let defaultFields: any = []
    if (userType === 'Client') {
        defaultFields = [1, 2]
    } else {
        defaultFields = [1, 2, 3]
    }
    let defaultFieldsShortCode: any = []
    if (serverOptions && serverOptions.length === 0) {
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
    } else if (serverOptions && serverOptions.length > 0) {
        /**
         * Saved selections
         */
        serverOptions.forEach((field, index) => {
            fieldsSelected[index + 1] = field.docMgrConfigValSelectedCode
            selectedFields.push(field.docMgrConfigValSelectedCode)
            notAvailableFields.push(field.docMgrConfigValSelectedCode)
            if (defaultFields.indexOf(index + 1) !== -1) {
                defaultFieldsShortCode.push(field.docMgrConfigValSelectedCode)
            }
        })
    }
    const dataFieldOptionsFiltered = allFields.map((fO: any) => {
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