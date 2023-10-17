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
import Approval from "./containers/Setup/Approval";


// Lazy load components
const Documents = lazy(() => import("./containers/DocumentManager/Documents"));
const UserAccount = lazy(() => import("./containers/User/UserAccount"));
const DocumentGeneralConfiguration = lazy(() => import("./containers/User/DocumentGeneralConfiguration"));
const DocumentsList = lazy(() => import("./containers/DocumentManager/DocumentsList"));
const DocumentCostConfiguration = lazy(() => import("./containers/User/DocumentCostConfiguration"));
const RequiredDocuments = lazy(() => import("./containers/User/RequiredDocuments"));
const SummaryDrillDownHave = lazy(() => import("./containers/DocumentManager/SummaryDrillDownHave"));
const SummaryDrillDownNotHave = lazy(() => import("./containers/DocumentManager/SummaryDrillDownNotHave"));
const ClientSetup = lazy(() => import("./containers/Setup/ClientSetup"));
const PartnerSetup = lazy(() => import("./containers/Setup/PartnerSetup"));
const DocumentTypeIdentifier = lazy(() => import("./containers/DocumentManager/DocumentTypeIdentifier"));
const ConsoleSettings = lazy(() => import("./containers/DocumentManager/ConsoleSettings"));
const Automation = lazy(() => import("./containers/DocumentManager/Automation"));
const NamingConfiguration = lazy(() => import("./containers/User/NamingConfiguration"));
const DomainSetup = lazy(() => import("./containers/Setup/DomainSetup"));
const DocumentGroup = lazy(() => import("./containers/Setup/DocumentGroup"));
const DocumentTypePreference = lazy(() => import("./containers/Setup/DocumentTypePreference"));
const DocumentAttribute = lazy(() => import("./containers/DocumentManager/DocumentAttribute"));

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
              <PublicRoute path="/forgot_password" component={ForgotPassword} />s
              <PublicRoute path="/change_password" component={ChangePassword} />
              <PublicRoute path="/onboarding" component={Registration} />

              {/* User settings ---------------*/}
              <PrivateRoute exact path="/profile/user_account" component={sessions(UserAccount)} />


              {/* Document Manager */}
              <PrivateRoute exact path="/documents/my_documents" component={Documents} />
              <PrivateRoute exact path="/documents/sent_document_requests" component={Documents} />
              <PrivateRoute exact path="/documents/received_document_requests" component={Documents} />
              <PrivateRoute exact path="/documents/templates" component={Documents} />
              <PrivateRoute exact path="/documents/download_history" component={Documents} />
              <PrivateRoute exact path="/documents/document_list" component={DocumentsList} />
              <PrivateRoute exact path="/documents/accounts_documents" component={SummaryDrillDownHave} />
              <PrivateRoute exact path="/documents/accounts_missing_documents" component={SummaryDrillDownNotHave} />


              <WithSidebar exact path="/my_documents_side" component={Documents} />

              {/* Setup */}
              <PrivateRoute exact path="/setup/client" component={ClientSetup} />
              <PrivateRoute exact path="/setup/partner" component={PartnerSetup} />
              <PrivateRoute exact path="/setup/user_approval" component={Approval} />
              <PrivateRoute exact path="/setup/Domain" component={DomainSetup} />
              <PrivateRoute exact path="/setup/document_general_configuration" component={sessions(DocumentGeneralConfiguration)} />
              <PrivateRoute exact path="/setup/document_general_configuration/:id" component={sessions(NamingConfiguration)} />
              <PrivateRoute exact path="/setup/document_cost_configuration" component={sessions(DocumentCostConfiguration)} />
              <PrivateRoute exact path="/setup/required_documents" component={sessions(RequiredDocuments)} />
              <PrivateRoute exact path="/setup/document_group" component={sessions(DocumentGroup)} />
              <PrivateRoute exact path="/setup/document_type" component={sessions(DocumentTypePreference)} />
              <PrivateRoute exact path="/setup/document_attribute" component={sessions(DocumentAttribute)} />

              {/* OCR */}
              <PrivateRoute exact path="/setup/document_type_identifier" component={DocumentTypeIdentifier} />
              {/* Console */}
              <PrivateRoute exact path="/setup/console" component={ConsoleSettings} />
              <PrivateRoute exact path="/automation" component={Automation} />

            </Switch>
          </ErrorBoundary>
        </Provider>
      </Router>
    </ToastProvider>
  );
}

export default App;
