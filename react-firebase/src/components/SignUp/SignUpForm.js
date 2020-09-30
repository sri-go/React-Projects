import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Row, Col, Form, Input, Button, Typography, message } from "antd";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const { Title } = Typography;

const INITIAL_STATE = {
  name: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
    An account with this E-Mail address already exists.
    Try to login with this account instead. If you think the
    account is already used from one of the social logins, try
    to sign in with one of them. Afterward, associate your accounts on your personal account page.
  `;

const SignUpFormBase = (props) => {
  const [userInfo, setUserInfo] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const onSubmit = (values) => {
    const { name, email, passwordOne, isAdmin } = userInfo;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = true;
    } else if (!isAdmin) {
      roles[ROLES.ADMIN] = false;
    }
    props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a user in the Firebase Realtime Database
        return props.firebase.user(authUser.user.uid).set({
          name,
          email,
          roles,
        });
      })
      .then(() => {
        setUserInfo(INITIAL_STATE);
        setError(null);
        props.history.push(ROUTES.ACCOUNT);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
        message.error(error.message, 5);
      });
  };

  const onChange = (changedValues, allValues) => {
    setUserInfo(allValues);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setError(errorInfo);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
    },
  };

  const { name, email, passwordOne, passwordTwo, isAdmin } = userInfo;

  return (
    <>
      <Row className={props.className} justify="center">
        <Col align="center">
          <Title level={3}>Sign Up Here</Title>
          <Form
            name="signUp"
            initialValues={INITIAL_STATE}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            onValuesChange={onChange}
            validateMessages={validateMessages}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                },
              ]}
              hasFeedback
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              name="passwordOne"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value) {
                      return Promise.resolve();
                    } else if (getFieldValue("passwordOne").length <= 6) {
                      return Promise.reject(
                        "The password must be at least 6 characters long"
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="passwordTwo"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("passwordOne") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered do not match!"
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

const SignUpLink = () => <Link to={ROUTES.SIGN_UP}>Sign Up</Link>;

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export { SignUpForm, SignUpLink };
