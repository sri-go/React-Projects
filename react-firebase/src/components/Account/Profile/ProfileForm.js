import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Input, InputNumber, Button, message } from "antd";

import { ProfileImage } from "./profileImage";

import * as ROUTES from "../../../constants/routes";
import { withFirebase } from "../../Firebase";

const INITIAL_STATE = {
  email: "",
  name: "",
  graduationYear: null,
  initiationClass: "",
  portfolioLink: "",
  igLink: "",
  linkedInLink: "",
  phoneNumber: "",
  introduction: "",
  profileURL: "",
};

const ProfileForm = (props) => {
  const [form] = Form.useForm();
  const [profileData, setProfileData] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState(false);

  const { authUser, firebase, history } = props;

  useEffect(() => {
    props.firebase.userProfile(authUser.uid).on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          graduationYear: data.graduationYear,
          initiationClass: data.initiationClass,
          portfolioLink: data.portfolioLink,
          igLink: data.igLink,
          linkedInLink: data.linkedInLink,
          phoneNumber: data.phoneNumber,
          introduction: data.introduction,
          profileURL: data.profileURL,
        });
        setProfileData({ ...data });
      } else {
        //on new profile submit or unsubmitted form
        props.firebase.user(authUser.uid).on("value", (snapshot) => {
          const data = snapshot.val();
          const { email, name } = data;
          form.setFieldsValue({
            name: data.name,
            email: data.email,
          });
          setProfileData({
            ...INITIAL_STATE,
            ...{ email: email, name: name },
          });
        });
      }
    });
    return () => props.firebase.userProfile(authUser.uid).off();
  }, []);

  // on form submit
  const onSubmit = (values) => {
    let stringifyData = JSON.parse(JSON.stringify(profileData));
    console.log("on submit data", stringifyData);

    //if file is added
    if (fileList.length > 0) {
      console.log(fileList[0]);
      firebase
        .profileImage(authUser.uid, fileList[0].name)
        .put(fileList[0].originFileObj)
        .then((snapshot) => {
          console.log(snapshot);
          let link = snapshot.ref.getDownloadURL();
          return link;
        })
        .then((downloadURL) => {
          stringifyData = { ...stringifyData, profileURL: downloadURL };
        })
        .then(() => {
          firebase
            .userProfile(authUser.uid)
            .update(stringifyData)
            .catch((error) => {
              setError(error);
              message.error(error.message, 3);
              console.log(error);
            });
        })
        .then(() => {
          onSuccess();
          // message.success("Successfully created profile!", 3);
        })
        .then(() => {
          history.push(ROUTES.HOME);
        })
        .catch((error) => {
          setError(error);
          message.error(error.message, 3);
          console.log(error);
        });
    }
    //if no pic is uploded
    if (fileList.length === 0) {
      console.log("url", stringifyData.profileURL);

      //if file exists -> remove from storage, and remove from db
      if (!!stringifyData.profileURL && deleteStatus) {
        console.log("pre-removal", stringifyData.profileURL);
        firebase.deleteFromStorage(stringifyData.profileURL);
        stringifyData = { ...stringifyData, profileURL: "" };
        firebase
          .userProfile(authUser.uid)
          .update(stringifyData)
          .then(() => {
            onSuccess();
            // message.success("Successfully updated profile!", 3);
          })
          .then(() => {
            history.push(ROUTES.HOME);
          })
          .catch((error) => {
            setError(error);
            message.error(error.message, 3);
            console.log(error);
          });
      }
      //else
      else {
        firebase
          .userProfile(authUser.uid)
          .update(stringifyData)
          .then(() => {
            onSuccess();
            // message.success("Successfully updated profile!", 3);
          })
          .then(() => {
            history.push(ROUTES.HOME);
          })
          .catch((error) => {
            setError(error);
            message.error(error.message, 3);
            console.log(error);
          });
      }
    }
  };

  const onSuccess = () => {
    message.success("Successfully created profile!", 3);
  };

  //on form change
  const onChange = (changedValues, allValues) => {
    const {
      name,
      email,
      graduationYear,
      initiationClass,
      igLink,
      linkedInLink,
      portfolioLink,
      phoneNumber,
      introduction,
    } = allValues;

    setProfileData({
      ...profileData,
      name: name,
      email: email,
      graduationYear: graduationYear,
      initiationClass: initiationClass,
      igLink: igLink,
      linkedInLink: linkedInLink,
      portfolioLink: portfolioLink,
      phoneNumber: phoneNumber,
      introduction: introduction,
    });
  };

  //on form failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setError(errorInfo);
  };

  const uploadPic = (filelist, deleteStatus) => {
    setFileList(filelist);
    setDeleteStatus(deleteStatus);
    console.log("post filelist", fileList);
  };

  //form layout
  const layout = {
    layout: "horizontal",
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  //form validation
  const validateMessages = {
    required: "${label} is required",
    types: {
      email: "${label} is not a valid email",
      url: "${label} is not a valid url",
      number: "${label} is not a valid number",
    },
    number: {
      min: "'${name}' cannot be less than ${min}",
      max: "'${name}' cannot be greater than ${max}",
    },
  };

  return (
    <Form
      // {...layout}
      style={{ width: "50vw", alignItems: "start" }}
      form={form}
      name="profileForm"
      onFinish={onSubmit}
      onFinishFailed={onFinishFailed}
      onValuesChange={onChange}
      initialValues={{ ...profileData }}
      validateMessages={validateMessages}
    >
      <ProfileImage
        style={{ width: "100vw", height: "100%" }}
        firebase={firebase}
        authUser={authUser}
        returnData={uploadPic}
      />
      <Form.Item name="name" label="Name">
        <Input type="text" />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input rules={[{ required: true, type: "email" }]} />
      </Form.Item>
      <Form.Item
        name="graduationYear"
        label="Graduation Year"
        rules={[{ required: true, type: "number", min: 2014, max: 3000 }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="initiationClass"
        label="Initation Class"
        rules={[
          {
            required: true,
            message: "Please input your initiation class!",
          },
        ]}
      >
        <Input placeholder="What Initiation Class Are You (Alpha, Beta...)" />
      </Form.Item>
      <Form.Item
        name="portfolioLink"
        label="Personal Website URL"
        rules={[{ type: "url" }]}
      >
        <Input placeholder="URL of your website" type="url" autoComplete="" />
      </Form.Item>
      <Form.Item
        name="linkedInLink"
        label="LinkedIn URL"
        rules={[{ type: "url" }]}
      >
        <Input placeholder="https://www.linkedin.com/" type="url" />
      </Form.Item>
      <Form.Item name="igLink" label="Instagram Handle">
        <Input
          placeholder="What's your IG Profile (ex: kingjames)"
          type="text"
        />
      </Form.Item>
      <Form.Item name="phoneNumber" label="Phone Number">
        <Input placeholder="Phone Number" type="tel" />
      </Form.Item>
      <Form.Item name="introduction" label="Introduction">
        <Input.TextArea placeholder="Tell other alumni about yourself" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default compose(withRouter, withFirebase)(ProfileForm);

/*
<form onSubmit={onSubmit}>
      <input name="profilePic" ref={fileInput} type="file" accept="image/*" />
      <input
        name="email"
        value={email}
        onChange={onChange}
        type="text"
        placeholder="Email Address"
      />
      <input
        name="graduationYear"
        value={graduationYear}
        onChange={onChange}
        type="number"
        min={1000}
        max={9999}
        placeholder="Graduation Year"
        required={true}
      />
      <input
        name="initiationClass"
        value={initiationClass}
        onChange={onChange}
        type="text"
        placeholder="Initiation Class"
        required={true}
      />
      <input
        name="aboutYourself"
        value={aboutYourself}
        type="text"
        onChange={onChange}
        placeholder="Briefly introduce yourself to fellow DSPs"
        required={true}
      />
      <input
        name="linkedInLink"
        value={linkedInLink}
        onChange={onChange}
        type="text"
        placeholder="LinkedIn Profile"
      />
      <input
        name="igLink"
        value={igLink}
        onChange={onChange}
        type="text"
        placeholder="IG Username"
      />
      <input
        name="portfolioLink"
        value={portfolioLink}
        onChange={onChange}
        type="text"
        placeholder="Portfolio URL"
      />
      <button type="submit">Update Profile</button>
    </form>
*/
