import { combineReducers } from "redux";

import authReducer from "./auth.reducer";
import miscReducer from "./common/misc.reducer";
import typesReducer from "./common/types.reducer";
import documentCostConfigurationReducer from "./documentCostConfiguration.reducer";
import fileNameConfigReducer from "./fileNameConfig.reducer";
import myDocumentsReducer from "./myDocuments.reducer";
import registrationReducer from "./registration.reducer";
import requiredDocumentsReducer from "./requiredDocuments.reducer";
import sentDocumentRequestReducer from "./sentDocumentRequest.reducer";

const appReducer = combineReducers({
    auth: authReducer,
    misc: miscReducer,
    types: typesReducer,
    registration: registrationReducer,
    fileNameConfig: fileNameConfigReducer,
    myDocuments: myDocumentsReducer,
    cost: documentCostConfigurationReducer,
    requiredDocuments: requiredDocumentsReducer,
    sentDocumentRequest: sentDocumentRequestReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'LOGIN_RESET' || action.type === 'LOGOUT') {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

export default rootReducer