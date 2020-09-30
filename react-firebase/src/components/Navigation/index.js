import React from "react";
import { Link } from "react-router-dom";

import { Layout, Row, Col, Button, Typography } from "antd";

import { AuthUserContext } from "../Session";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const { Header } = Layout;

const Navigation = () => {
  return (
    <AuthUserContext.Consumer>
      {(authUser) =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  );
};

const NavigationAuth = ({ authUser }) => (
  <Header>
    <Row justify="end" align="middle">
      <Col>
        <Button type="link" shape="round" size="middle">
          <Link
            style={{ fontSize: "16px" }}
            to={ROUTES.HOME}
            component={Typography.Link}
          >
            Home
          </Link>
        </Button>
        <Button type="link" shape="round" size="middle">
          <Link
            style={{ fontSize: "16px" }}
            to={ROUTES.ACCOUNT}
            component={Typography.Link}
          >
            Account
          </Link>
        </Button>
        {!!authUser.roles[ROLES.ADMIN] && (
          <Button type="link" shape="round" size="middle">
            <Link
              style={{ fontSize: "16px" }}
              to={ROUTES.ADMIN}
              component={Typography.Link}
            >
              Admin
            </Link>
          </Button>
        )}
        <SignOutButton />
      </Col>
    </Row>
  </Header>
);

const NavigationNonAuth = () => {
  return (
    <Header>
      <Row justify="end">
        <Col align="center">
          <Link
            style={{ fontSize: "16px" }}
            to={ROUTES.SIGN_IN}
            component={Typography.Link}
          >
            Sign In
          </Link>
        </Col>
      </Row>
    </Header>
  );
};

export default Navigation;
