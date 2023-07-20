
export { }

declare module '*';

declare global {

    interface Window {
        BASE_URL: string;
        BASE_URL1: string;
        LOGIN_URL: string;
        COMMON_URL: string;
        CLIENT_URL: string;
        COMPLIANCE_SEARCH_URL: string;
        CONSUMER_URL: string;
        BASE_URL2: string;
        COMMON_ENTITY_SERVICE: string;
        JOB_SERVICE: string;
        VENDOR_INTEGRATION: string;
        ACCOUNT_SERVICE: string;
        ADDRESS_SERVICE: string;
        INVENTORY_SERVICE: string;
        CLIENT_SERVICE: string;
        CONSUMER_SERVICE: string;
        PHONE_SERVICE: string;
        EMAIL_SERVICE: string;
        ALERT_SERVICE: string;
        PAYMENT_SERVICE: string;
        PARTNER_SERVICE: string;
        STATE_SERVICE: string;
        SCHEDULER_SERVICE: string;
        ALERT_MANAGEMENT: string;
        BUSINESS_PROCESS_MANAGEMENT: string;
        VENDOR_MANAGEMENT: string;
        BATCH_SCHEDULER_MANAGEMENT: string;
        CONFIGURATION_MANAGEMENT: string;
        SUSPECTED_MANAGEMENT: string;
        REPORT: string;
        AWS_SERVICE: string;
        COMMUNICATION_SERVICE: string;
        AWS_QUICKSIGHT_URL: string;
        SCOPES: string[];
        REDIRECT_URL: string;
        POST_LOGOUT_URL: string;
        TENANT_URL: string;
    }
    interface IConnectedUser {
        principleId: number
        loginKey: string
        firstName: string
        middleName: string
        lastName: string
        emailAddress: string
        phone: string
        orgType: string
        orgTypeDesc: string
        orgCode: string
        orgId: number
        orgName: string
        modifiedFirstName: string
    }
    interface IUsers {
        data: IConnectedUser[]
        error: string | null
        loading: boolean
    }
    interface IDeleteConfirm {
        onHide: any
        show: any
        confirmDelete: any
        text?: string
        actionText?: string
        details: any
        type: any
    }

}

