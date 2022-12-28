import { combineReducers } from "redux";

import authReducer from "./auth.reducer";
import miscReducer from "./common/misc.reducer";
import typesReducer from "./common/types.reducer";
import fileNameConfigReducer from "./fileNameConfig.reducer";
import registrationReducer from "./registration.reducer";

const appReducer = combineReducers({
    auth: authReducer,
    misc: miscReducer,
    types: typesReducer,
    registration: registrationReducer,
    fileNameConfig: fileNameConfigReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'LOGIN_RESET' || action.type === 'LOGOUT') {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

export default rootReducer