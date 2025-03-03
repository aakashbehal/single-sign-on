
import { IConfiguration, IDocConfig } from "../containers/User/DocumentGeneralConfiguration"
import { handleResponse, axiosCustom } from "../helpers/util"


const getConfig = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/file/config`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getUserConfig = async (requestParams: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/file/configuration`,
            { params: { orgType: requestParams.orgType, fieldName: requestParams.fileNameConfig } })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const handleDefaultAndSavedSelection = async (dataFieldOptions: any, userType: any, fieldsSelected: any, fromList: IConfiguration | null) => {
    let fromServer = fromList ? fromList.userDocConfig : []
    let treadedList = fromServer.map((config: IDocConfig) => {
        return {
            configSelectedCode: config.fileFieldCode,
            configValSelectedCode: config.attributeCode
        }
    })
    let allFields = [];
    if (dataFieldOptions && dataFieldOptions.length > 0) {
        allFields = dataFieldOptions
    }
    let selectedFields: any = []
    let notAvailableFields: any = []
    if (treadedList && treadedList.length === 0) {
        /**
         * Default available and selection
         */
        if (userType !== 'Client' || userType === "Equabli") {
            selectedFields = ['CSC', "DT", "CAN"]
            notAvailableFields = ['CSC', "DT", "CAN"]
        } else {
            selectedFields = ['CAN', "DT"]
            notAvailableFields = ['CSC', 'DT', 'CAN']
        }
    } else if (treadedList && treadedList.length > 0) {
        /**
         * Saved selections
         */
        treadedList.forEach((field: any, index: any) => {
            fieldsSelected[index + 1] = field.configValSelectedCode
            selectedFields.push(field.configValSelectedCode)
            notAvailableFields.push(field.configValSelectedCode)
        })
    }
    const dataFieldOptionsFiltered = allFields.map((fO: any) => {
        if (selectedFields.indexOf(fO.attributeCode) !== -1) {
            fO.selected = true
        } else {
            fO.selected = false
        }
        if (notAvailableFields.indexOf(fO.attributeCode) === -1) {
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
    let Obj = { fieldFinal: dataFieldOptionsFiltered, selectionFinal: fieldsSelected }
    return Obj
}

const saveUserConfiguration = async (requestBody: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/file/configuration/add`,
            requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const updateUserConfiguration = async (requestBody: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/file/configuration/update`,
            requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getListOfUserConfig = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/file/configuration`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deleteUserConfiguration = async (namingConfigGroupCode: string) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/file/${namingConfigGroupCode}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getPolicy = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/policy`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const saveDuplicatePolicy = async (requestBody: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/policy/duplication`,
            requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const SaveRetentionPolicy = async (requestBody: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/policy/retention`,
            requestBody)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

export const fileNameConfigService = {
    getConfig,
    getUserConfig,
    handleDefaultAndSavedSelection,
    saveUserConfiguration,
    getListOfUserConfig,
    deleteUserConfiguration,
    updateUserConfiguration,
    getPolicy,
    SaveRetentionPolicy,
    saveDuplicatePolicy
}