import React from "react";
import { Row, Col, Typography } from "antd";

const { Text } = Typography;

export default function Landing() {
  return (
    <Row direction="vertical" align="center">
      <Col>
        <Text>
          Landing Page, is accessible by every user (Authorized and
          Unauthorized)
        </Text>
      </Col>
    </Row>
  );
}
