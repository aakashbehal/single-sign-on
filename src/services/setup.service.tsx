
import { handleResponse, axiosCustom } from "../helpers/util"

const getServiceTypes = async () => {
    try {
        // const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/subscription/all`)
        // const data = handleResponse(response)
        // return data.response
        return [
            { shortName: "LW", fullName: "LAW-Legal" },
            { shortName: "CL", fullName: "Debt Collection" },
            { shortName: "DG", fullName: "Digital Communication" },
            { shortName: "DR", fullName: "Data Enrichment" },
            { shortName: "UN", fullName: "Unknown" }
        ]
    } catch (error: any) {
        throw error.message
    }
}

const GetClients = async () => {
    try {
        // const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/subscription/all`)
        // const data = handleResponse(response)
        // return data.response
        let datas = [
            {
                "client_id": 11,
                "short_name": "CL",
                "full_name": "client",
                "client_type": "client type",
                "poc_name": "poc name",
                "address1": "address1",
                "address2": "address2",
                "city": "city",
                "zip": "zip",
                "phone1": "phone1",
                "phone2": "phone2",
                "email_address": "email_address",
                "record_status_id": 5,
                "dtm_utc_create": "2022-10-10 13:19:11.785334",
                "created_by": "postgres",
                "dtm_utc_update": "2022-10-10 13:19:11.785334",
                "updated_by": "postgres",
                "record_source_id": 3,
                "app_id": 1,
                "ip_address": "35.171.65.110",
                "mac_address": "",
                "state_code": "ST",
                "website": "website",
                "quicksight_id": 16711078,
                "is_masterserviced": false
            },
            {
                "client_id": 17,
                "short_name": "CL1",
                "full_name": "client",
                "client_type": "client type",
                "poc_name": "poc name",
                "address1": "address1",
                "address2": "address2",
                "city": "city",
                "zip": "zip",
                "phone1": "phone1",
                "phone2": "phone2",
                "email_address": "email_address",
                "record_status_id": 5,
                "dtm_utc_create": "2022-10-10 13:21:31.553606",
                "created_by": "postgres",
                "dtm_utc_update": "2022-10-10 13:21:31.553606",
                "updated_by": "postgres",
                "record_source_id": 3,
                "app_id": 1,
                "ip_address": "35.171.65.110",
                "mac_address": "",
                "state_code": "ST",
                "website": "website",
                "quicksight_id": 16717055,
                "is_masterserviced": false
            }
        ]
        let clients = datas
        const responseModified: any = {}
        responseModified.clients = clients
        responseModified.totalCount = 2
        responseModified.columns = [
            "short_name",
            "full_name",
            "client_type",
            "poc_name",
            "address1",
            "address2",
            "city",
            "zip",
            "phone1",
            "phone2",
            "email_address",
            "record_status_id",
            "dtm_utc_create",
            "created_by",
            "dtm_utc_update",
            "updated_by",
            "record_source_id",
            "app_id",
            "ip_address",
            "mac_address",
            "state_code",
            "website",
            "quicksight_id",
            "is_masterserviced"
        ]
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}

const GetPartners = async () => {
    try {
        // const response = await axiosCustom.get(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/subscription/all`)
        // const data = handleResponse(response)
        // return data.response
        let datas = [{
            "partner_id": 14,
            "short_name": "ABSRC",
            "full_name": "Absolute Resolutions Corporation",
            "address1": "8000 Norman Center Dr., Ste 860",
            "address2": "-",
            "city": "Bloomington",
            "zip": "55437 ",
            "email_address": "media@absoluteresolutions.com",
            "phone1": "800-713-0670",
            "phone2": "",
            "poc_name": "",
            "amt_min_coll_limit": null,
            "amt_max_coll_limit": null,
            "servicetype_id": 5,
            "record_status_id": 5,
            "dtm_utc_create": "2022-12-09 09:33:54.447238",
            "created_by": "postgres",
            "dtm_utc_update": "2023-02-22 16:56:16.512691",
            "updated_by": "postgres",
            "record_source_id": 4,
            "app_id": 1,
            "ip_address": "35.171.65.110",
            "mac_address": "",
            "state_code": "MN",
            "website": "",
            "quicksight_id": 16514044,
            "name_pronunciation": "",
            "email_pronunciation": "",
            "phone_pronunciation": null,
            "address_pronunciation": "",
            "is_eqassociate": true
        },
        {
            "partner_id": 8,
            "short_name": "DAS",
            "full_name": "D&A Services, LLC",
            "address1": "1400 E Touhy Ave",
            "address2": "Suite G2",
            "city": "Des Plaines Illinois",
            "zip": "60018",
            "email_address": "demonstration@equabli.com",
            "phone1": "+1-773-902-1130",
            "phone2": "",
            "poc_name": "Greg Neely",
            "amt_min_coll_limit": null,
            "amt_max_coll_limit": null,
            "servicetype_id": 2,
            "record_status_id": 5,
            "dtm_utc_create": "2022-08-26 11:30:00.379467",
            "created_by": "postgres",
            "dtm_utc_update": "2022-10-26 11:08:30.205321",
            "updated_by": "postgres",
            "record_source_id": 4,
            "app_id": 1,
            "ip_address": "35.171.65.110",
            "mac_address": "",
            "state_code": "IL",
            "website": "www.dnasllc.com",
            "quicksight_id": 16880379,
            "name_pronunciation": "D and A Services LLC",
            "email_pronunciation": "Contact at D N A S L L C dot com",
            "phone_pronunciation": 17739021130,
            "address_pronunciation": "1400 E Touhy Ave Suite G2 Des Plaines Illinois 60018",
            "is_eqassociate": true
        }
        ]
        let clients = datas
        const responseModified: any = {}
        responseModified.clients = clients
        responseModified.totalCount = 2
        responseModified.columns = [
            "partner_id",
            "short_name",
            "full_name",
            "address1",
            "address2",
            "city",
            "zip",
            "email_address",
            "phone1",
            "phone2",
            "poc_name",
            "amt_min_coll_limit",
            "amt_max_coll_limit",
            "servicetype_id",
            "record_status_id",
            "dtm_utc_create",
            "created_by",
            "dtm_utc_update",
            "updated_by",
            "record_source_id",
            "app_id",
            "ip_address",
            "mac_address",
            "state_code",
            "website",
            "quicksight_id",
            "name_pronunciation",
            "email_pronunciation",
            "phone_pronunciation",
            "address_pronunciation",
            "is_eqassociate"
        ]
        return responseModified
    } catch (error: any) {
        throw error.message
    }
}


export const subscriptionService = {
    getServiceTypes,
    GetClients,
    GetPartners
}