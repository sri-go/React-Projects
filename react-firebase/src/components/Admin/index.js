import React from "react";
import { Switch, Route } from "react-router-dom";
import { compose } from "recompose";
import { Row, Col, Typography } from "antd";

import { UserList, UserItem } from "./Users";
import { AuthUserContext, withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const { Title } = Typography;

const AdminPage = () => {
  return (
    <Row justify="center" align="middle">
      <Col span={24}>
        <Title level={3} style={{ margin: "20px 0", textAlign: "center" }}>
          Admin Page
        </Title>
        <Switch>
          <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
          <Route exact path={ROUTES.ADMIN} component={UserList} />
        </Switch>
      </Col>
    </Row>
  );
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(withAuthorization(condition))(AdminPage);
