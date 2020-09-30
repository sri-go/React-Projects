import React from "react";
import { Row, Col, Typography, Space } from "antd";

import { SignInForm } from "./SignInForm";
import { SignUpLink } from "../SignUp/SignUpForm";
import { PasswordForgetLink } from "../PasswordForget";

export default function SignInPage() {
  const { Title } = Typography;

  return (
    <Row className="login-page" justify="center" align="middle">
      <Col className="login-box" align="center">
        <Title style={{ textAlign: "center" }} level={3}>
          Welcome Back
        </Title>
        <Title style={{ textAlign: "center" }} level={5}>
          Sign In
        </Title>
        <SignInForm />
        <Row justify="center">
          <Space horizontal>
            <SignUpLink />
            <PasswordForgetLink />
          </Space>
        </Row>
      </Col>
    </Row>
  );
}
