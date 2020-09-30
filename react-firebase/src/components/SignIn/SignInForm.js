import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Row, Col, Form, Input, Button, Space, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
An account with an E-Mail address to
this social account already exists. Try to login from
this account instead and associate your social accounts on
your personal account page.`;

const INITIAL_STATE = {
  email: "",
  password: "",
};

const layout = {
  wrapperCol: {
    span: 24,
  },
};

const SignInFormBase = (props) => {
  const [userInfo, setUserInfo] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);

  const onSubmit = (values) => {
    //get current state
    const { email, password } = userInfo;
    //submit to Firebase API to check if user exists on database
    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      // if successfull set the User Info back to initial state and go // to direct user to home page
      .then(() => {
        setUserInfo({ ...INITIAL_STATE });
        props.history.push(ROUTES.HOME);
      })
      // if there is an error, set the to current error
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        message.error(error.message, 5);
        setError({ error });
      });
    // event.preventDefault;
  };

  // set the values that are being inputted into state
  const onChange = (changedValues, allValues) => {
    // console.log(allValues);
    setUserInfo(allValues);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    setError(errorInfo.errorFields[0].errors[0]);
  };

  return (
    <Form
      {...layout}
      name="login-form"
      initialValues={INITIAL_STATE}
      onFinish={onSubmit}
      onFinishFailed={onFinishFailed}
      onValuesChange={onChange}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Enter your user email",
          },
        ]}
        hasFeedback
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Row justify="center" align="middle">
        <Space align="center">
          <Col flex="auto">
            <SignInGoogle />
          </Col>
          <Col flex="auto">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Log In
              </Button>
            </Form.Item>
          </Col>
        </Space>
      </Row>
    </Form>
    /* <Row
    // gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
    // direction="vertical"
    // align="center"
    // className="login-page"
    >
      <Col className="login-box">
        
      </Col>
    </Row> */
  );
};

const SignInGoogleBase = (props) => {
  const [error, setError] = useState(null);

  const onSubmit = (values) => {
    props.firebase
      .doSignInWithGoogle()
      .then((socialAuthUser) => {
        setError(null);
        // Create a user in your Firebase Realtime Database if new login w google
        if (socialAuthUser.additionalUserInfo.isNewUser) {
          props.firebase.user(socialAuthUser.user.uid).set({
            name: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {
              ADMIN: false,
            },
          });
          return props.history.push(ROUTES.ACCOUNT);
        }
        return props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        setError(error);
      });
  };

  return (
    <Form onFinish={onSubmit}>
      <Form.Item>
        <Button type="default" htmlType="submit">
          Sign In with Google
        </Button>
      </Form.Item>
      {/* {error && <p>{error.message}</p>} */}
    </Form>
  );
};

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export { SignInForm, SignInGoogle };
