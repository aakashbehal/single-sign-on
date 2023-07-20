
import { userService } from "."
import { handleResponse, axiosCustom } from "../helpers/util"

const getFilterTypes = async (filterType: string) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getLookUpListByGroupKeyVal/${filterType}/0`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getLookupValues = async ({ lookupGroupKeyValue }: { lookupGroupKeyValue: string }) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/lookupGroup/lookup`, {
            params: {
                lookupGroupKeyValue
            }
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getClients = async () => {
    try {
        const user = userService.getUser()
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CLIENT_URL}/allClients`)
        const data = handleResponse(response)
        let clientArray = data.response
        if (user.orgType === 'CL') {
            clientArray = clientArray.filter((client: any) => {
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
        throw error.message
    }
}

const getStates = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL_2}/${process.env.REACT_APP_COMMON_CONFIG_SERVICE_2}/getAllStates`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getAgencies = async () => {
    try {
        const user = userService.getUser()
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_PARTNER_SERVICE}/getAllPartners`)
        const data = handleResponse(response)
        let partnerArray = data.response
        if (user.orgType === 'PT') {
            partnerArray = partnerArray.filter((partner: any) => {
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
        throw error.message
    }
}

const getAppId = async (type: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getAppByShortName?shortName=${type}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getRecordStatus = async (type: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getRecordStatusByShortName?shortName=${type}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getStatus = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_INVENTORY_SERVICE}/getAllAccountStatuses`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getRecordSource = async (type: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getRecordSourceByShortName?shortName=${type}`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getAccountConfig = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_INVENTORY_SERVICE}/getAccountConf`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getRegulatory = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getActiveRegulatoryBody`)
        const data = handleResponse(response)
        let regulators = data.response.filter((d: any) => {
            if (d.daysFirstSla && d.daysLastSla) {
                return d
            }
        })
        return regulators
    } catch (error: any) {
        throw error.message
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
            throw error.message
        })
}

const getDocumentTypes = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/type`,
            {
                params: {
                    pageSize: 100,
                    pageNumber: 0,
                }
            })
        const data = handleResponse(response)
        return data.response.datas
    } catch (error: any) {
        throw error.message
    }
}

const getProductTypes = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/require/product/type`)
        const data = handleResponse(response)
        // data.response = data.response.map((dr: any) => {
        //     dr.fullName = dr.name
        //     dr.shortName = dr.productCode
        //     return dr
        // })
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const componentMap: any = {
    myDocuments: "documentFolder",
    documents: "document",
    sentDocumentRequest: "sentDocumentRequest",
    receiveDocumentRequest: "receiveDocumentRequest",
    documentSummary: "accounts",
    documentNotSummary: "accounts"
}

const saveColumn = async ({ parentComponent, showHideColumns }: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/attribute/preference/user`, {
            tableName: componentMap[parentComponent],
            columnNames: showHideColumns,
            domainCode: 'DEBT'
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getColumnForAllTables = async (table: string) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/column`, {
            params: {
                table
            }
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getClientAccountNumbers = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/summary/clientAccount`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getUsage = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/summary/usage`)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const getSignedURL = async (objectKey: any, fileSize: any) => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_FILE_UPLOAD_SERVICE}/file/download/presignUrl`,
            {
                params: {
                    objectKey,
                    fileSize
                }
            }
        )
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
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
    getColumnForAllTables,
    getClientAccountNumbers,
    getUsage,
    getSignedURL,
    getLookupValues
}