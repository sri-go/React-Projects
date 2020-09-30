import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Input, Button, Typography, DatePicker, message } from "antd";

import { ProfileImage } from "./profileImage";
import moment from "moment";

import * as ROUTES from "../../../constants/routes";
import { withFirebase } from "../../Firebase";

const INITIAL_STATE = {
  profileURL: "",
  name: "",
  tagline: "",
  introduction: "",
  birthday: "",
  currentLocation: "",
  email: "",
  phoneNumber: "",
  hometown: "",
  igLink: "",
  linkedInLink: "",
  githubLink: "",
  portfolioLink: "",
  graduationYear: "",
  initiationClass: "",
  degree: "",
  major: "",
  highschool: "",
};

const { Title } = Typography;

const ProfileForm = (props) => {
  const [form] = Form.useForm();
  const [profileData, setProfileData] = useState(INITIAL_STATE);
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const { authUser, firebase, history } = props;

  const dateFormat = "MM/DD/YYYY";

  useEffect(() => {
    // ON LOAD GET THE DATA FROM DB
    props.firebase.userProfile(authUser.uid).on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        form.setFieldsValue({
          name: data.name,
          tagline: data.tagline,
          introduction: data.introduction,
          birthday: moment(data.birthday),
          currentLocation: data.currentLocation,
          email: data.email,
          phoneNumber: data.phoneNumber,
          hometown: data.hometown,
          igLink: data.igLink,
          linkedInLink: data.linkedInLink,
          githubLink: data.githubLink,
          portfolioLink: data.portfolioLink,
          graduationYear: moment(data.graduationYear),
          initiationClass: data.initiationClass,
          degree: data.degree,
          major: data.major,
          highschool: data.highschool,
        });
        setProfileData({ ...data });
        setImageURL(data.profileURL);
      } else {
        /*
      ON NEW USER CREATED, GET NAME + EMAIL FROM AUTH DB
      */
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
    //if a new picture file is uploaded
    if (fileList.length > 0) {
      //upload the picture to storage and retrieve the download url for the image
      firebase
        .profileImage(authUser.uid, fileList[0].name)
        .put(fileList[0].originFileObj)
        .then((snapshot) => {
          let link = snapshot.ref.getDownloadURL();
          return link;
        })
        .then((downloadURL) => {
          stringifyData = { ...stringifyData, profileURL: downloadURL };
        })
        .then(() => {
          //upload the rest of the data to the realtime database
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
          //message of created message
          onProfileSuccess();
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
      //if picture was deleted from storage, remove it from db as well
      if (!!stringifyData.profileURL && deleteStatus) {
        firebase.deleteFromStorage(stringifyData.profileURL);
        stringifyData = { ...stringifyData, profileURL: "" };
        firebase
          .userProfile(authUser.uid)
          .update(stringifyData)
          .then(() => {
            onUpdatedProfile();
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
      //only profile was updated
      else {
        firebase
          .userProfile(authUser.uid)
          .update(stringifyData)
          .then(() => {
            onUpdatedProfile();
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

  const onProfileSuccess = () => {
    message.success("Successfully created profile!", 3);
  };

  const onUpdatedProfile = () => {
    message.success("Successfully updated profile!", 3);
  };

  //on form change
  const onChange = (changedValues, allValues) => {
    const {
      name,
      tagline,
      introduction,
      birthday,
      currentLocation,
      email,
      phoneNumber,
      hometown,
      igLink,
      linkedInLink,
      githubLink,
      portfolioLink,
      graduationYear,
      initiationClass,
      degree,
      major,
      highschool,
    } = allValues;
    setProfileData({
      ...profileData,
      name: name,
      tagline: tagline,
      introduction: introduction,
      birthday: birthday,
      currentLocation: currentLocation,
      email: email,
      phoneNumber: phoneNumber,
      hometown: hometown,
      igLink: igLink,
      linkedInLink: linkedInLink,
      portfolioLink: portfolioLink,
      githubLink: githubLink,
      graduationYear: graduationYear,
      initiationClass: initiationClass,
      degree: degree,
      major: major,
      highschool: highschool,
    });
  };

  //on form failure
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error(errorInfo.errorFields[0].errors[0], 3);
    setError(errorInfo);
  };

  const uploadPic = (filelist, deleteStatus) => {
    setFileList(filelist);
    setDeleteStatus(deleteStatus);
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
      {/* Profile Picture */}
      <ProfileImage
        authUser={authUser}
        returnData={uploadPic}
        snapshot={imageURL}
      />
      {/* Personal Information */}
      <>
        <Title level={5} className="site-description-item-profile-p">
          Personal Information
        </Title>
        <Form.Item name="name" label="Name">
          <Input type="text" />
        </Form.Item>
        <Form.Item
          name="tagline"
          label="Tag Line"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Describe yourself in 10 words or less" />
        </Form.Item>
        <Form.Item name="introduction" label="Introduction">
          <Input.TextArea placeholder="Tell other alumni about yourself" />
        </Form.Item>
        <Form.Item name="birthday" label="Birthday">
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item name="currentLocation" label="Current Location">
          <Input placeholder="Cleveland, OH" />
        </Form.Item>
      </>
      {/* Contact Information */}
      <>
        <Title level={5} className="site-description-item-profile-p">
          Contact Information
        </Title>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input placeholder="Phone Number" type="tel" />
        </Form.Item>
        <Form.Item name="hometown" label="Hometown">
          <Input placeholder="Cleveland, OH" />
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
        <Form.Item
          name="githubLink"
          label="GitHub Link"
          rules={[{ type: "url" }]}
        >
          <Input placeholder="https://www.github.com/" type="url" />
        </Form.Item>
        <Form.Item name="igLink" label="Instagram Handle">
          <Input
            placeholder="What's your IG Profile (ex: kingjames)"
            type="text"
          />
        </Form.Item>
      </>
      {/* Academic Information */}
      <>
        <Title level={5} className="site-description-item-profile-p">
          Academic Information
        </Title>
        <Form.Item
          name="graduationYear"
          label="Graduation Year"
          rules={[
            {
              required: true,
              message: "Please input your graduation year!",
            },
          ]}
        >
          <DatePicker picker="year" />
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
        <Form.Item name="degree" label="Degree">
          <Input />
        </Form.Item>
        <Form.Item name="major" label="Major">
          <Input />
        </Form.Item>
        <Form.Item name="highschool" label="High School Name">
          <Input />
        </Form.Item>
      </>
      {/* Submit */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default compose(withRouter, withFirebase)(ProfileForm);
