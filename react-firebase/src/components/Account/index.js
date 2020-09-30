import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Row, Col, Typography, Layout, Space } from "antd";
import { UserOutlined, SettingOutlined, KeyOutlined } from "@ant-design/icons";

import ProfilePage from "./Profile";
import PasswordChangeForm from "../PasswordChange";
import { LoginManagement } from "./LoginManagement";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROUTES from "../../constants/routes";

const { Sider } = Layout;

const AccountPage = (props) => {
  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <>
          <Layout style={{ height: "100%" }}>
            <Sider
              style={{
                position: "fixed",
                height: "100vh",
              }}
            >
              <Col align="center">
                <Space direction="vertical" size="large" align="center">
                  <Row justify="center" align="middle">
                    <Space>
                      <UserOutlined />
                      <Link to={ROUTES.ACCOUNT} component={Typography.Link}>
                        Edit Profile
                      </Link>
                    </Space>
                  </Row>
                  <Row justify="center" align="middle">
                    <Space>
                      <SettingOutlined />
                      <Link
                        to={ROUTES.ACCOUNT_MANAGEMENT}
                        component={Typography.Link}
                      >
                        Account Management
                      </Link>
                    </Space>
                  </Row>
                  <Row justify="center" align="middle">
                    <Space>
                      <KeyOutlined />
                      <Link
                        to={ROUTES.PASSWORD_CHANGE}
                        component={Typography.Link}
                      >
                        Password Change
                      </Link>
                    </Space>
                  </Row>
                </Space>
              </Col>
            </Sider>
            <Switch>
              <Route exact path={ROUTES.ACCOUNT} component={ProfilePage} />
              <Route
                exact
                path={ROUTES.ACCOUNT_MANAGEMENT}
                render={() => <LoginManagement authUser={authUser} />}
              />
              <Route
                exact
                path={ROUTES.PASSWORD_CHANGE}
                component={PasswordChangeForm}
              />
            </Switch>
          </Layout>
        </>
      )}
    </AuthUserContext.Consumer>
  );
};

export default AccountPage;
