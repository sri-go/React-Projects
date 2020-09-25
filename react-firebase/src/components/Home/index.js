import React from "react";
import { compose } from "recompose";
import { Row, Col } from "antd";

import ProfileCards from "./ProfileCards";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const HomePage = () => (
  <Row align="center">
    <Col align="center">
      <Row gutter={16}>
        <ProfileCards />
      </Row>
    </Col>
  </Row>
);

const condition = (authUser) => !!authUser;
export default compose(withAuthorization(condition))(HomePage);
