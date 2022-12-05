
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { userService } from "../../services"

const PublicRoute = ({ component: Component, ...rest }: any) => {
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
        <Route {...rest} render={props => (
            userService.isLoggedIn() ?
                <Redirect to="/dashboard" />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;