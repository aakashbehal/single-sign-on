
import { userService } from "."
import { handleResponse, axiosCustom } from "../helpers/util"

const getFilterTypes = async (filterType: string) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getLookUpListByGroupKeyVal/${filterType}/0`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getClients = async () => {
    try {
        const user = userService.getUser()
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CLIENT_URL}/allClients`)
        const data = handleResponse(response)
        let clientArray = data.response
        if (user.orgType === 'CL') {
            clientArray = clientArray.filter((client) => {
                if (client.clientId === user.clientId) {
                    return client
                } else {
                    return false
                }
            })
            return clientArray
        } else {
            return clientArray
        }
    } catch (error: any) {
        throw error
    }
}

const getStates = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getAllStates`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getAgencies = async () => {
    try {
        const user = userService.getUser()
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_PARTNER_SERVICE}/getAllPartners`)
        const data = handleResponse(response)
        let partnerArray = data.response
        if (user.orgType === 'PT') {
            partnerArray = partnerArray.filter((partner) => {
                if (partner.partnerId === user.partnerId) {
                    return partner
                } else {
                    return false
                }
            })
            return partnerArray
        } else {
            return partnerArray
        }
    } catch (error: any) {
        throw error
    }
}

const getAppId = async (type: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getAppByShortName?shortName=${type}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getRecordStatus = async (type: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getRecordStatusByShortName?shortName=${type}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getStatus = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_INVENTORY_SERVICE}/getAllAccountStatuses`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getRecordSource = async (type: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getRecordSourceByShortName?shortName=${type}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getAccountConfig = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_INVENTORY_SERVICE}/getAccountConf`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getRegulatory = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getActiveRegulatoryBody`)
        const data = handleResponse(response)
        let regulators = data.response.filter((d) => {
            if (d.daysFirstSla && d.daysLastSla) {
                return d
            }
        })
        return regulators
    } catch (error: any) {
        throw error
    }
}

const fetchAllTypes = () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    };
    return fetch('/fetchAllTypes', requestOptions)
        .then((response) => {
            return response.text().then((text: string) => {
                const data = text && JSON.parse(text);
                if (!data.validation) {
                    throw Error(data.message)
                }
                return data;
            });
        })
        .then(data => {
            return data.response
        })
        .catch((error) => {
            throw error
        })
}

const getDocumentTypes = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/type`)
        const data = handleResponse(response)
        return data.response.datas
    } catch (error: any) {
        throw error
    }
}

const getProductTypes = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/require/product/type`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const componentMap = {
    myDocuments: "documentFolder",
    documents: "document",
    sentDocumentRequest: "sentDocumentRequest",
    receiveDocumentRequest: "receiveDocumentRequest"
}

const saveColumn = async ({ parentComponent, showHideColumns }) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/column`, {
            tableName: componentMap[parentComponent],
            columnNames: showHideColumns
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

const getColumnForAllTables = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/column/all`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error
    }
}

export const commonServices = {
    getFilterTypes,
    getClients,
    getAgencies,
    getAppId,
    getRecordStatus,
    getRecordSource,
    getStates,
    getRegulatory,
    getStatus,
    getAccountConfig,
    fetchAllTypes,
    getDocumentTypes,
    getProductTypes,
    saveColumn,
    getColumnForAllTables
}