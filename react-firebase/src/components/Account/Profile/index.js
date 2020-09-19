import React from "react";
import ProfileForm from "./ProfileForm";
import { compose } from "recompose";
import { Row, Col, Typography } from "antd";

import { withAuthorization, AuthUserContext } from "../../Session";

const { Title } = Typography;

const ProfilePage = () => {
  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <Row justify="center">
          <Col justify="center" align="center" style={{ width: "50vw" }}>
            <Title level={3}>Profile</Title>
            <ProfileForm authUser={authUser} />
          </Col>
        </Row>
      )}
    </AuthUserContext.Consumer>
  );
};

// redirects to SignIn if not logged in
const condition = (authUser) => !!authUser;
export default compose(withAuthorization(condition))(ProfilePage);
