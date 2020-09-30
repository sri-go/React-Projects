import React, { useState, useEffect } from "react";
import { Row, Col, Button, Typography, Checkbox } from "antd";

import { withFirebase } from "../../Firebase";
import * as ROLES from "../../../constants/roles";

const { Title } = Typography;

const UserItem = (props) => {
  // const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(props.location.state.record);

  const [isAdmin, setIsAdmin] = useState(
    props.location.state.record.roles.ADMIN
  );
  const roles = {};

  const { match, firebase } = props;

  useEffect(() => {
    if (!!user) return; //IF USER DATA IS PASSED DOWN AS PROPS FROM USER LIST,

    firebase.user(user.uid).on("value", (snapshot) => {
      //FETCH FROM DB IF NOT PASSED DOWN FROM PROPS
      console.log("fetching from db");
      setUser(snapshot.val());
    });

    return () => firebase.user(match.params.id).off();
  }, []);

  // GIVE ADMIN ACCESS TO WHOEVER DOESN'T HAVE AS A SUPER
  useEffect(() => {
    // PREVENT ACCIDENTAL ADMIN REMOVAL ON SELF WHEN LOGGED IN
    firebase.auth.onAuthStateChanged((user) => {
      if (match.params.id !== user.uid) {
        //params.id should match user.uid if logged in as user
        roles[ROLES.ADMIN] = isAdmin;
        firebase.user(props.match.params.id).update({ roles: roles });
      }
    });
  }, [isAdmin]);

  const onSendPasswordResetEmail = () => {
    firebase.doPasswordReset(user.email);
  };

  const onChangeCheckbox = (event) => {
    const { name, checked } = event.target;
    setIsAdmin(checked);
  };

  return (
    <Row justify="center" align="middle">
      {user && (
        <Col span={16} style={{ textAlign: "center" }}>
          <p>
            <strong>ID:</strong> {user.uid}
          </p>
          <p>
            <strong>E-Mail:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <Button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </Button>
          </p>
          <Checkbox
            name="isAdmin"
            type="checkbox"
            checked={isAdmin}
            onChange={onChangeCheckbox}
          >
            Admin
          </Checkbox>
        </Col>
      )}
    </Row>
  );
};
export default withFirebase(UserItem);
