import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

import { Row, Col, Divider, Card, Drawer, Avatar, Space } from "antd";
import {
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  UserOutlined,
  GithubOutlined,
  LinkOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

const ProfileCards = (props) => {
  const [profileData, setProfileData] = useState(null);

  const { authUser, firebase } = props;

  useEffect(() => {
    const userData = [];
    props.firebase.userProfiles().on("value", (snapshot) => {
      //download user data from database
      if (snapshot.exists()) {
        const data = snapshot.val();
        //iterate over data and push each object to an array
        for (let key in data) {
          userData.push(data[key]);
        }
      }
    });
    setProfileData(userData); //set data to array
    return () => props.firebase.userProfiles().off();
  }, []);

  return (
    profileData &&
    profileData.map((data) => {
      return <ProfileCard user={data} />;
    })
  );
};

/*
email: "lebron@gmail.com"
graduationYear: 2020
igLink: "kingJames"
initiationClass: "beta"
introduction: "best ball player"
linkedInLink: "https://www.google.com"
name: "Lebron James"
phoneNumber: "6143520445"
portfolioLink: "https://www.google.com"
profileURL: "https://firebasestorage.googleapis.com/v0/b/react-firebase-tutorial-2c3b8.appspot.com/o/profileImages%2FeiwVgqRMgsZrSKIjZu5M950j0gq1%2FDSC_9055.jpg?alt=;


<Paragraph style={{fontSize: 14px}}>{title}</Paragraph>
<Paragraph style={{fontSize: 16px}}>{content}</Paragraph>
*/

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      display: "flex",
      marginBottom: "7px",
      fontSize: "16px",
      lineHeight: "1.5715",
    }}
  >
    <p
      style={{
        display: "inline",
        marginRight: "5px",
        color: "rgb(255 255 255 / 44%)",
      }}
    >
      {title}:
    </p>
    <p
      style={{
        color: "rgb(255 255 255 / 85%)",
      }}
    >
      {content}
    </p>
  </div>
);

const ProfileCard = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const {
    profileURL,
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
    portfolioLink,
    graduationYear,
    initiationClass,
    degree,
    major,
    highschool,
  } = props.user;

  const onClick = (e) => {
    setShowDrawer(true);
  };

  const onClose = (e) => {
    setShowDrawer(false);
  };

  return (
    <Col span={8} style={{ margin: "50px 0" }}>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          profileURL === "" || null || undefined ? (
            <div>
              <UserOutlined
                style={{
                  fontSize: "200px",
                  height: "240px",
                  width: "240px",
                }}
              />
            </div>
          ) : (
            <img alt={`profile picture of ${name}`} src={profileURL} />
          )
        }
        onClick={onClick}
        actions={[
          <InstagramOutlined
            key="instagram"
            onClick={() => window.open(`https://www.instagram.com/${igLink}`)}
          />,
          <LinkedinOutlined
            key="linkedin"
            onClick={() => window.open(linkedInLink)}
          />,
          <MailOutlined
            key="mail"
            onClick={() => window.open(`mailto:${email}`)}
          />,
        ]}
      >
        <Meta
          title={name}
          description={`Graduation Year: ${graduationYear} 
          Initation Class: ${initiationClass}`}
        />
      </Card>
      <Drawer
        width={600}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={showDrawer}
      >
        {/* Top Info */}
        <Row align="middle" justify="center">
          <Col span={24} style={{ fontSize: "18px", textAlign: "center" }}>
            <Avatar shape="circle" size="large" src={profileURL} />
            <p style={{ margin: "10px 0px" }}>{tagline}</p>
            <p style={{ fontSize: "14px" }}>{introduction}</p>
          </Col>
        </Row>
        {/* Personal Info */}
        <Divider
          style={{ fontSize: "24px", color: "rgb(255 255 255 / 44%)" }}
          type="horizontal"
          orientation="center"
        >
          Personal Information{" "}
        </Divider>
        <Space direction="vertical">
          <Row>
            <Col span={24}>
              <DescriptionItem title="Full Name" content={name} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Current Location"
                content={currentLocation}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem title="Birthday" content="February 2,1900" />
            </Col>
          </Row>
        </Space>
        {/* Academic Information */}
        <Divider
          style={{ fontSize: "24px", color: "rgb(255 255 255 / 44%)" }}
          type="horizontal"
          orientation="center"
        >
          Academic Information
        </Divider>
        <Space direction="vertical">
          <Row>
            <Col span={24}>
              <DescriptionItem title="Degree" content={degree} />
            </Col>
            <Col span={24}>
              <DescriptionItem title="Major" content={major} />
            </Col>
            <Col span={24}>
              <DescriptionItem
                title="Graduation Year"
                content={graduationYear}
              />
            </Col>
            <Col span={24}>
              <DescriptionItem title="High School" content={highschool} />
            </Col>
          </Row>
        </Space>
        {/* Contact Infromation */}
        <Divider
          style={{ fontSize: "24px", color: "rgb(255 255 255 / 44%)" }}
          type="horizontal"
          orientation="center"
        >
          Contact Information
        </Divider>
        <Space direction="vertical">
          <Row>
            <Col span={24}>
              <DescriptionItem
                title=<MailOutlined />
                content={<a href={`mailto:${email}`}>{email}</a>}
              />
            </Col>
            <Col span={24}>
              <DescriptionItem title=<PhoneOutlined /> content={phoneNumber} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title=<LinkedinOutlined />
                content={<a href={linkedInLink}>{linkedInLink}</a>}
              />
            </Col>
            <Col span={24}>
              <DescriptionItem
                title=<LinkOutlined />
                content={<a href={portfolioLink}>{portfolioLink}</a>}
              />
            </Col>
            <Col span={24}>
              <DescriptionItem
                title=<GithubOutlined />
                content={<a href={portfolioLink}>{portfolioLink}</a>}
              />
            </Col>
          </Row>
        </Space>
      </Drawer>
    </Col>
  );
};

export default compose(withFirebase)(ProfileCards);
