import { combineReducers } from "redux";

import authReducer from "./auth.reducer";
import miscReducer from "./common/misc.reducer";
import typesReducer from "./common/types.reducer";
import documentCostConfigurationReducer from "./documentCostConfiguration.reducer";
import downloadHistoryRequestReducer from "./downloadHistory.reducer";
import fileNameConfigReducer from "./fileNameConfig.reducer";
import myDocumentsReducer from "./myDocuments.reducer";
import receiveDocumentRequestReducer from "./receiveDocumentRequest.reducer";
import registrationReducer from "./registration.reducer";
import requiredDocumentsReducer from "./requiredDocuments.reducer";
import sentDocumentRequestReducer from "./sentDocumentRequest.reducer";
import shareReducer from "./share.reducer";
import summaryReducer from "./summary.reducer";
import userReducer from "./user.reducer";
import subscriptionReducer from "./subscription.reducer";
import usageReducer from "./usage.reducer";
import invoiceReducer from "./invoice.reducer";
import clientSetupReducer from "./clientSetup.reducer";
import partnerSetupReducer from "./partnerSetup.reducer";
import notificationReducer from "./notification.reducer";

const appReducer = combineReducers({
    auth: authReducer,
    misc: miscReducer,
    types: typesReducer,
    registration: registrationReducer,
    fileNameConfig: fileNameConfigReducer,
    myDocuments: myDocumentsReducer,
    cost: documentCostConfigurationReducer,
    requiredDocuments: requiredDocumentsReducer,
    sentDocumentRequest: sentDocumentRequestReducer,
    receiveDocumentRequest: receiveDocumentRequestReducer,
    downloadHistory: downloadHistoryRequestReducer,
    users: userReducer,
    summary: summaryReducer,
    share: shareReducer,
    subscription: subscriptionReducer,
    usage: usageReducer,
    invoice: invoiceReducer,
    clients: clientSetupReducer,
    partners: partnerSetupReducer,
    notification: notificationReducer
})

const rootReducer = (state: any, action: any) => {
    if (action.type === 'LOGIN_RESET' || action.type === 'LOGOUT') {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

export default rootReducer