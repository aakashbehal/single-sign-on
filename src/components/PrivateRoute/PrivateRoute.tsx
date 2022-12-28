import React, { Suspense } from "react";
import { Route, Redirect } from "react-router-dom";

import TopNavigation from "../../components/Header/TopNavigation/TopNavigation"
import BottomNavigation from "../../components/Header/BottomNavigation/BottomNavigation"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { userService } from "../../services"
import { LoadingIndicator } from "../../helpers"

const PrivateRoute = ({ component: Component, auth, ...rest }: any) => {
  //================ERROR REPORTING START=========================
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
