import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Layout, Row, Col } from "antd";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import ProfilePage from "../Account/Profile";
import { withAuthentication } from "../Session";
import * as ROUTES from "../../constants/routes";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Navigation />
        <Content>
          <Row flex="auto">
            <Col span={24}>
              <Switch>
                {/* <Route exact path={ROUTES.LANDING} component={LandingPage} /> */}
                <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route exact path={ROUTES.PROFILE} component={ProfilePage} />
                <Route
                  exact
                  path={ROUTES.PASSWORD_FORGET}
                  component={PasswordForgetPage}
                />
                <Route exact path={ROUTES.HOME} component={HomePage} />
                <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route exact path={ROUTES.ADMIN} component={AdminPage} />
              </Switch>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Router>
  );
}

export default withAuthentication(App);
