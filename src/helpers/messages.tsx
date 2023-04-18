const MESSAGES: any = {
    FILE_NAME_CONFIGURATION_SAVED_SUCCESS: "Great! File Name Configuration saved successfully",
    DOWNLOAD_REPORT_REQUEST: "Great! Download request submitted",
    ASSISTANCE: "Please wait and try your request again. If the issue persists, please contact the Equabli administrator at support@equabli.com",
    ALERT_ERROR_FETCHING: "Error in fetching requested details",
    ALL_BATCH_SCHEDULES: "All batch schedules executed successfully",
    SOL_VALUE_GREATER_ERROR: "'EQV score From' cannot be greater than 'EQV score To'. Please update search criteria and try again.",
    PLACEMENT_GREATER_ERROR: "'Placement date From' cannot be greater than 'Placement date To'. Please update search criteria and try again.",
    SOL_DATE_GREATER_ERROR: "'SOL Date From' cannot be greater than 'SOL Date To'. Please update search criteria and try again.",
    REPORT_DATE_GREATER_ERROR: "'Report Date From' cannot be greater than 'Report Date To'. Please update search criteria and try again.",
    CHARGE_VALUE_GREATER_ERROR: "'Charge-off Balance From' cannot be greater than 'Charge-off Balance To'. Please update search criteria and try again.",
    CHARGE_DATE_GREATER_ERROR: "'Charge-off Date From' cannot be greater than 'Charge-off Date To'. Please update search criteria and try again.",
    CONTACT_REQUEST: "Contact request generated successfully, someone from Itsupport@equabli.com and/or support@equabli.com will get back to you soon.",
    ADDITION_TIME_NOTE: "User to note that only one extension request for resolving a compliance item will be approved. Please read and close this message and then proceed to review the new SLA due date for the compliance item.",
    DOWNLOAD_STARTED: "Download Started",
    DOWNLOAD_SUCCESSFUL: "Download Finished",
    FILE_LARGE: "Total File size is more than 100 MB, please use SFTP to upload"
}

/**
 * function is used in making search params
 * @param type : error || success || info || etc
 * @param messageFrom: alert || account search .etc
 * @param messageType: updating || adding .etc 
 */
export const createMessage = (type: any, messageFrom: any, messageType?: any) => {
    if (type === 'error') {
        return `Error in ${messageFrom} ${messageType}. ${MESSAGES.ASSISTANCE}`
    } else if (type === 'success') {
        return `Great! ${messageType} ${messageFrom} successfully.`
    } else {
        return MESSAGES[messageFrom]
    }
} 