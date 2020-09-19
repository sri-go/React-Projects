import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { Typography, Form, Input, Button, message } from "antd";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const { Text } = Typography;

function PasswordForgetBase(props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const { firebase, history } = props;

  function onSubmit(values) {
    firebase
      .doPasswordReset(email)
      .then(() => {
        setEmail("");
        setError(null);
        history.push(ROUTES.SIGN_IN);
      })
      .catch((error) => {
        message.error(error.message, 5);
        setError(error);
      });
  }

  function onChange(changedValues, allValues) {
    const { email } = allValues;
    setEmail(email);
  }

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    setError(errorInfo.errorFields[0].errors[0]);
  };

  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "${label} is not a valid email",
    },
  };

  return (
    <Form
      layout="vertical"
      name="passwordResetForm"
      initialValues={{ email: "" }}
      validateMessages={validateMessages}
      onFinish={onSubmit}
      onFinishFailed={onFinishFailed}
      onValuesChange={onChange}
    >
      <Form.Item
        required
        name="email"
        label="Email"
        // validateStatus
        rules={[{ required: true, type: "email" }]}
        hasFeedback
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
}

function PasswordForgetLink() {
  return (
    <Text>
      <Link to={ROUTES.PASSWORD_FORGET} component={Typography.Link}>
        Forgot Password?
      </Link>
    </Text>
  );
}

const PasswordForgetForm = compose(
  withRouter,
  withFirebase
)(PasswordForgetBase);

export { PasswordForgetForm, PasswordForgetLink };
