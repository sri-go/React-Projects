import React from "react";
import { Row, Col, Typography, Space } from "antd";

import { SignInForm } from "./SignInForm";
import { SignUpLink } from "../SignUp/SignUpForm";
import { PasswordForgetLink } from "../PasswordForget";

export default function SignInPage() {
  const { Title } = Typography;

  return (
    <Row justify="center">
      <Col justify="center">
        <Title level={3}>Sign In</Title>
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
