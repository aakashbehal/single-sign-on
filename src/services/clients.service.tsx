
import { handleResponse, axiosCustom } from "../helpers/util"

const getAllClients = async ({
    pageSize,
    pageNumber,
    sortOrder,
    sortParam,
    isOnboarding
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/clients/search`, {
            pageSize,
            pageNumber: pageNumber - 1
        })
        const data = handleResponse(response)
        let clients = data.response.datas
        const responseModified: any = {}
        let clientDomainMap: any = {}
        responseModified.totalCount = data.response.metadata.recordCount
        // responseModified.totalCount = 10
        if (isOnboarding) {
            let clientList = clients.map((client: any) => client.shortCode)
            let result = await getOnboardingDetails(clientList)
            for (let r of result) {
                clientDomainMap[r.clientCode] = r
            }
        }
        responseModified.clients = clients.map((client: any) => {
            let obj = {
                domainCode: clientDomainMap[client.shortCode] ? clientDomainMap[client.shortCode].code : null,
                domainName: clientDomainMap[client.shortCode] ? clientDomainMap[client.shortCode].name : null,
                docGroup: clientDomainMap[client.shortCode] ? clientDomainMap[client.shortCode].docGroups : null
            }
            client = { ...client, ...obj }
            return client
        })
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const getOnboardingDetails = async (clients: string[]) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/onboarding/setup`, clients)
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}


const addClient = async ({
    shortCode,
    fullName,
    clientType,
    pocName,
    address1,
    address2,
    city,
    zip,
    phone1,
    phone2,
    emailAddress,
    recordSourceId,
    stateCode,
    website,
    isMasterServiced
}: any) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/clients`, {
            shortCode,
            fullName,
            clientType,
            pocName,
            address1,
            address2,
            city,
            zip,
            phone1,
            phone2,
            emailAddress,
            recordSourceId,
            stateCode,
            website,
            isMasterServiced
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const editClient = async ({
    clientId,
    shortCode,
    fullName,
    clientType,
    pocName,
    address1,
    address2,
    city,
    zip,
    phone1,
    phone2,
    emailAddress,
    recordSourceId,
    stateCode,
    website,
    isMasterserviced
}: any) => {
    try {
        const response = await axiosCustom.put(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/clients/${clientId}`, {
            shortCode,
            fullName,
            clientType,
            pocName,
            address1,
            address2,
            city,
            zip,
            phone1,
            phone2,
            emailAddress,
            recordSourceId,
            stateCode,
            website,
            isMasterServiced: isMasterserviced
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const deactivateClient = async (clientId: string | number) => {
    try {
        const response = await axiosCustom.patch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/clients/${clientId}`, {
            "action": "ACTIVE",
            "property": "string"
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const addClientDomain = async ({
    orgTypeCode,
    orgCode,
    domainCode
}: {
    "orgTypeCode": string,
    "orgCode": string,
    "domainCode": string
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/onboarding/setup/domain`, {
            orgTypeCode,
            orgCode,
            domainCode
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const addClientGroup = async ({
    orgTypeCode,
    orgCode,
    documentGroupCode
}: {
    "orgTypeCode": string,
    "orgCode": string,
    "documentGroupCode": string[]
}) => {
    try {
        const response = await axiosCustom.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/onboarding/setup/docGroup`, {
            orgTypeCode,
            orgCode,
            documentGroupCode
        })
        const data = handleResponse(response)
        return data.response
    } catch (error: any) {
        throw error.message
    }
}

const fetchPreferenceSchema = async () => {
    try {
        const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SSO_ONBOARDING_SERVICE}/clients/getPreferenceJsonSchema`)
        const data = handleResponse(response)
        const propertiesArray: any = []
        for (let key in data?.response?.properties) {
            if (data?.response?.properties[key].UIControlType !== 'TX') {
                let obj = {
                    ...data?.response?.properties[key],
                    key,
                    name: data?.response?.properties[key].name || key
                }
                propertiesArray.push(obj)
            }
        }
        data.response.properties = propertiesArray
        return data.response
    } catch (error: any) {
        throw error.message
    }
}


export const clientServices = {
    getAllClients,
    addClient,
    editClient,
    deactivateClient,
    addClientDomain,
    addClientGroup,
    getOnboardingDetails,
    fetchPreferenceSchema
}