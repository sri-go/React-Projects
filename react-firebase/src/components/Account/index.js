import React, { useState, useEffect } from "react";
import { compose } from "recompose";

import { Row, Col, Form, Input, Button, Typography, message } from "antd";

import PasswordChangeForm from "../PasswordChange";
import { withFirebase } from "../Firebase";
import { AuthUserContext, withAuthorization } from "../Session";

const { Title } = Typography;

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null,
  },
  {
    id: "google.com",
    provider: "googleProvider",
  },
];

const INITIAL_STATE = {
  password: "",
  confirmPassword: "",
};

const AccountPage = (props) => {
  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <Row justify="center">
          <Col justify="center">
            <Row>
              <Col>
                <Title style={{ margin: "0" }} level={1}>
                  Account Management
                </Title>
                <Title style={{ margin: "0 0 10px 0" }} level={4}>
                  {authUser.email}
                </Title>
              </Col>
            </Row>
            {/* <PasswordChangeForm /> */}
            <LoginManagement authUser={authUser} />
          </Col>
        </Row>
      )}
    </AuthUserContext.Consumer>
  );
};

const LoginManagementBase = (props) => {
  const [error, setError] = useState(null);
  const [activeSignInMethods, setActiveSignInMethods] = useState([]);

  useEffect(() => fetchSignInMethods(), []);

  const fetchSignInMethods = () => {
    props.firebase.auth
      .fetchSignInMethodsForEmail(props.authUser.email)
      .then((activeSignInMethods) => {
        setError(null);
        setActiveSignInMethods(activeSignInMethods);
      })
      .catch((error) => {
        setError(error);
        message.error(error.message, 3);
      });
  };

  const onSocialLoginLink = (provider) => {
    props.firebase.auth.currentUser
      .linkWithPopup(props.firebase[provider])
      .then(fetchSignInMethods)
      .catch((error) => {
        setError(error);
        message.error(error.message, 3);
      });
  };

  const onDefaultLoginLink = (password) => {
    const credential = props.firebase.emailAuthProvider.credential(
      props.authUser.email,
      password
    );

    props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(fetchSignInMethods)
      .catch((error) => {
        setError(error);
        message.error(error.message, 3);
      });
  };

  const onUnlink = (providerId) => {
    props.firebase.auth.currentUser
      .unlink(providerId)
      .then(fetchSignInMethods)
      .catch((error) => {
        setError(error);
        message.error(error.message, 3);
      });
  };

  return (
    <div>
      <Title level={4}>Link Sign In Methods</Title>
      <ul style={{ margin: "0" }}>
        {SIGN_IN_METHODS.map((signInMethod) => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(signInMethod.id);

          return (
            <li
              style={{ listStyle: "none", margin: "20px 0" }}
              key={signInMethod.id}
            >
              {signInMethod.id === "password" ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : (
                <SocialLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onLink={onSocialLoginLink}
                  onUnlink={onUnlink}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnlink,
}) =>
  isEnabled ? (
    <Button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </Button>
  ) : (
    <Button type="button" onClick={() => onLink(signInMethod.provider)}>
      Link {signInMethod.id}
    </Button>
  );

const DefaultLoginToggle = (props) => {
  const [passwords, setPasswords] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);

  const onSubmit = (values) => {
    const { passwordOne } = passwords;
    props.onLink(passwordOne);
    setPasswords(INITIAL_STATE);
  };

  const onChange = (changedValues, allValues) => {
    setPasswords(allValues);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    setError(errorInfo.errorFields[0].errors[0]);
    // message.error(errorInfo.errorFields[0].errors[0], 5);
  };

  const { onlyOneLeft, isEnabled, signInMethod, onUnlink } = props;

  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "${label} is not a valid email",
    },
  };

  return isEnabled ? (
    <Button
      type="button"
      onClick={() => onUnlink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </Button>
  ) : (
    <Form
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
          Link Accounts
        </Button>
      </Form.Item>
    </Form>
  );
};

const LoginManagement = withFirebase(LoginManagementBase);

const condition = (authUser) => !!authUser;
export default compose(withAuthorization(condition))(AccountPage);
