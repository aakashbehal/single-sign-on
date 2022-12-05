import React, { Suspense, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { useSelector } from 'react-redux';

import TopNavigation from "../../components/Header/TopNavigation/TopNavigation"
import BottomNavigation from "../../components/Header/BottomNavigation/BottomNavigation"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { userService } from "../../services"
import { LoadingIndicator } from "../../helpers"

const PrivateRoute = ({ component: Component, auth, ...rest }: any) => {
  //================ERROR REPORTING START=========================
  const { addToast, removeAllToasts } = useToasts();
  const { reportingIssueLoading, reportingIssueSuccess, reportingIssueError } = useSelector((state: any) => ({
    reportingIssueLoading: state.misc.reportingIssue.loading,
    reportingIssueSuccess: state.misc.reportingIssue.success,
    reportingIssueError: state.misc.reportingIssue.error
  }))

  useEffect(() => {
    removeAllToasts();
    if (!reportingIssueLoading && reportingIssueSuccess) {
      addToast(reportingIssueSuccess, { appearance: 'success', autoDismiss: true })
    } else if (!reportingIssueLoading && reportingIssueError) {
      addToast(reportingIssueError, { appearance: 'error', autoDismiss: false })
    }
  }, [reportingIssueLoading, reportingIssueSuccess, reportingIssueError])
  //================ERROR REPORTING END=========================
  return (
    <Route
      {...rest}
      render={props =>
        userService.isLoggedIn() ? (
          <div>
            <div className="fixed_header">
              <TopNavigation />
              <BottomNavigation />
            </div>
            <Suspense fallback={LoadingIndicator()}>
              <div style={{ padding: "20px" }}>
                <Breadcrumbs />
                <Component {...props} />
              </div>
            </Suspense>
          </div>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
};

export default PrivateRoute;
