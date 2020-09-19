import React, { useState } from "react";
import { withFirebase } from "../Firebase";

import { Form, Input, Button, Typography, message } from "antd";

const { Title } = Typography;

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
};

function PasswordChangeForm(props) {
  const [passwords, setPasswords] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();

  function onSubmit(values) {
    const { passwordOne } = passwords;
    props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setPasswords({ ...INITIAL_STATE });
        message.success("Successfuly reset password", 3);
        form.resetFields();
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        message.error(error.message, 3);
      });
  }

  function onChange(changedValues, allValues) {
    console.log(allValues);
    setPasswords(allValues);
  }

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    setError(errorInfo.errorFields[0].errors[0]);
    // message.error(errorInfo.errorFields[0].errors[0], 5);
  };

  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "${label} is not a valid email",
    },
  };

  return (
    <>
      <Title level={4}>Password Change Form</Title>
      <Form
        form={form}
        layout="vertical"
        name="passwordResetForm"
        initialValues={INITIAL_STATE}
        validateMessages={validateMessages}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        onValuesChange={onChange}
      >
        <Form.Item
          required
          name="passwordOne"
          label="New Password"
          // validateStatus
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value) {
                  return Promise.resolve();
                } else if (getFieldValue("passwordOne").length <= 7) {
                  return Promise.reject(
                    "The password must be at least 7 characters long"
                  );
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          required
          name="passwordTwo"
          label="Confirm New Password"
          rules={[
            { required: true },
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
    </>
  );
}

export default withFirebase(PasswordChangeForm);
