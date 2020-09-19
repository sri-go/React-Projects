import React from "react";

import { Row, Col, Typography } from "antd";

import { PasswordForgetForm, PasswordForgetLink } from "./PasswordForget";

const { Title } = Typography;

function PasswordForgetPage() {
  return (
    <Row justify="center">
      <Col justify="center" align="center">
        <Title level={1}>Password Forget</Title>
        <PasswordForgetForm />
      </Col>
    </Row>
  );
}

export default PasswordForgetPage;
export { PasswordForgetLink };
