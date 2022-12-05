
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

const getCountryTimeZone = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/getCountryTimeZone`)
        const data = handleResponse(response)
        return data.response
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

const reportIssue = async (requestData) => {
    console.log(requestData)
    try {
        const user: any = localStorage.getItem('user')
        const ip: any = localStorage.getItem('ip')
        const browserVersion = (function () {
            var ua = navigator.userAgent;
            var tem;
            var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        })();
        // eslint-disable-next-line no-restricted-globals
        let pagePath = location.hash.split('/')
        const request = {
            loginKey: user && (JSON.parse(user)) ? (JSON.parse(user)).loginKey : (JSON.parse(requestData.config.data)).loginKey,
            orgType: user && (JSON.parse(user)) ? (JSON.parse(user)).orgType : null,
            browserInfo: browserVersion,
            // eslint-disable-next-line no-restricted-globals
            relativePath: location.hash,
            actionPage: (pagePath[pagePath.length - 1]).split('?')[0],
            apiURL: requestData.config.url,
            httpMethod: requestData.config.method,
            requestBody: JSON.parse(requestData.config.data),
            responseCode: requestData.status,
            responseBody: JSON.parse(requestData.request.response),
            ipAddress: ip
        }
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_COMMON_URL}/insertIntoAppErrorLog`, request)
        const data = handleResponse(response)
        return data.message
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
    getCountryTimeZone,
    reportIssue
}