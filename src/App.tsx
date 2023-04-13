import React, { lazy } from "react";
import {
  Redirect,
  Router,
  Switch
} from "react-router-dom"
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';

import './App.sass';
import store from './store';
import { history, ErrorBoundary } from './helpers';

import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';

import Login from "./containers/Login/Login"
import Activate from "./containers/Login/Activate"
import SetPassword from "./containers/Login/SetPassword";
import ForgotPassword from "./containers/Login/ForgotPass";
import ChangePassword from "./containers/Login/ChangePassword";
import Registration from "./containers/Registration/Registration";
import { sessions } from "./helpers/sessions"
import { MyCustomToast } from "./helpers/customToaster";
import WithSidebar from "./components/PrivateRoute/SideBarRoute";

// Lazy load components
const Documents = lazy(() => import("./containers/DocumentManager/Documents"));
const UserAccount = lazy(() => import("./containers/User/UserAccount"));
const DocumentGeneralConfiguration = lazy(() => import("./containers/User/DocumentGeneralConfiguration"));
const DocumentsList = lazy(() => import("./containers/DocumentManager/DocumentsList"));
const DocumentCostConfiguration = lazy(() => import("./containers/User/DocumentCostConfiguration"));
const RequiredDocuments = lazy(() => import("./containers/User/RequiredDocuments"));
const SummaryDrillDownHave = lazy(() => import("./containers/DocumentManager/SummaryDrillDownHave"));
const SummaryDrillDownNotHave = lazy(() => import("./containers/DocumentManager/SummaryDrillDownNotHave"));
/**
 * Applications starting point
 * @returns 
 */
const App = () => {

  return (
    // Toaster handler
    <ToastProvider components={{ Toast: MyCustomToast }} placement="top-center" autoDismissTimeout={10000} >
      {/* Routes Handler */}
      <Router history={history}>
        {/* Store handler */}
        <Provider store={store}>
          {/* Universal Error Handler */}
          <ErrorBoundary>
            <Switch>

              {/* onboarding ---------------*/}
              <Redirect exact from="/" to="/login" />
              <PublicRoute path="/login" component={Login} />
              <PublicRoute path="/activate" component={Activate} />
              <PublicRoute path="/set_password" component={SetPassword} />
              <PublicRoute path="/forgot_password" component={ForgotPassword} />
              <PublicRoute path="/change_password" component={ChangePassword} />
              <PublicRoute path="/onboarding" component={Registration} />

              {/* User settings ---------------*/}
              <PrivateRoute exact path="/profile/user_account" component={sessions(UserAccount)} />
              <PrivateRoute exact path="/profile/document_general_configuration" component={sessions(DocumentGeneralConfiguration)} />
              <PrivateRoute exact path="/profile/document_cost_configuration" component={sessions(DocumentCostConfiguration)} />
              <PrivateRoute exact path="/profile/required_documents" component={sessions(RequiredDocuments)} />


              {/* Document Manager */}
              <PrivateRoute exact path="/documents/my_documents" component={Documents} />
              <PrivateRoute exact path="/documents/sent_document_requests" component={Documents} />
              <PrivateRoute exact path="/documents/received_document_requests" component={Documents} />
              <PrivateRoute exact path="/documents/templates" component={Documents} />
              <PrivateRoute exact path="/documents/download_history" component={Documents} />
              <PrivateRoute exact path="/documents/document_list" component={DocumentsList} />
              <PrivateRoute exact path="/documents/document_summary" component={SummaryDrillDownHave} />
              <PrivateRoute exact path="/documents/document_summary_not" component={SummaryDrillDownNotHave} />

              <WithSidebar exact path="/my_documents_side" component={Documents} />

            </Switch>
          </ErrorBoundary>
        </Provider>
      </Router>
    </ToastProvider>
  );
}

export default App;
