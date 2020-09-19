import React from "react";
import { compose } from "recompose";
import { Row, Col } from "antd";

import { withAuthorization } from "../Session";

const HomePage = () => (
  <Row direction="vertical" align="center">
    <Col align="center">
      <h1>Home Page</h1>
      <p>The Home Page is accessible by every signed in user.</p>
    </Col>
  </Row>
);

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(HomePage);
