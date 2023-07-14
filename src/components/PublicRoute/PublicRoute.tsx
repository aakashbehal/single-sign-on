
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userService } from "../../services"

const PublicRoute = ({ component: Component, ...rest }: any) => {
    return (
        <Route {...rest} render={props => (
            userService.isLoggedIn() ?
                <Redirect to="/documents/my_documents" />
                : <Component {...props} />
        )} />
    );
};

export default PublicRoute;