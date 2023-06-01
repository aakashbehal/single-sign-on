import React, { Suspense, useState } from "react";
import { Route, Redirect } from "react-router-dom";

import TopNavigation from "../../components/Header/TopNavigation/TopNavigation"
import BottomNavigation from "../../components/Header/BottomNavigation/BottomNavigation"
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { userService } from "../../services"
import { LoadingIndicator } from "../../helpers"
import Sidebar from "../Common/Sidebar";
import { BsChevronCompactRight } from "react-icons/bs";
import { FaAngleDoubleRight } from "react-icons/fa";

const PrivateRoute = ({ component: Component, auth, ...rest }: any) => {

  const [isClosed, setIsClosed] = useState(false)
  const handleClick = () => {
    setIsClosed((isClosed) => !isClosed)
  }

  //================ERROR REPORTING START=========================
  return (
    <Route
      {...rest}
      render={props =>
        userService.isLoggedIn() ? (
          <div>
            <div>
              <Sidebar isClosed={isClosed} />
            </div>
            <section className={`home-section ${!isClosed ? 'close_sidebar' : ''} `} >
              <div className="home-content">
                <div className="closeHandler">
                  <FaAngleDoubleRight className="menu" size={24} onClick={handleClick} />
                </div>
                <TopNavigation isSidebar={true} />
              </div>
              <Suspense fallback={LoadingIndicator()}>
                <div style={{ padding: "20px", height: '100%' }}>
                  <Breadcrumbs />
                  <Component {...props} />
                </div>
              </Suspense>
            </section>
            {/* top container */}

          </div>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
};

export default PrivateRoute;
