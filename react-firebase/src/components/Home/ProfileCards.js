import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

import { Row, Col, Divider, Card, Drawer, Image, Typography } from "antd";
import {
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";

const { Meta } = Card;
const { Title, Text, Paragraph } = Typography;

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
    fetch data
    -> firebase userProfiles
    -> firebase storage
    
    process data
    -> 
    
    display data
    -> antd Card 
    -> maybe use the drawer to display more information about themselves
    -> resume upload?
    
    scenarios:
     -> no users -> display empty page/no users added page
*/

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
*/
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <Paragraph className="site-description-item-profile-p-label">
      {title}: {content}
    </Paragraph>
  </div>
);

const ProfileCard = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const {
    name,
    email,
    graduationYear,
    initiationClass,
    igLink,
    linkedInLink,
    phoneNumber,
    portfolioLink,
    profileURL,
  } = props.user;
  // console.log(props.user);

  const onClick = (e) => {
    console.log(e);
    setShowDrawer(true);
  };

  const onClose = (e) => {
    console.log(e);
    setShowDrawer(false);
  };

  //style={{ height: "240px", width: "240px" }}

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
        width={1000}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={showDrawer}
      >
        {/* <p
          className="site-description-item-profile-p"
          style={{ marginBottom: 24 }}
        >
          User Profile
        </p> */}
        <Title level={3} className="site-description-item-profile-p">
          Personal
        </Title>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Full Name" content={name} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Account" content="AntDesign@example.com" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="City" content="HangZhou" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Country" content="China🇨🇳" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Birthday" content="February 2,1900" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Website" content="-" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Message"
              content="Make things:simple as possible but no simpler."
            />
          </Col>
        </Row>
        <Divider />
        <Title level={3} className="site-description-item-profile-p">
          Academic information
        </Title>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Position" content="Programmer" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Responsibilities" content="Coding" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Department" content="XTech" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Skills"
              content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
            />
          </Col>
        </Row>
        <Divider />
        <Title level={3} className="site-description-item-profile-p">
          Contacts
        </Title>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content={email} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Github"
              content={
                <a href="http://github.com/ant-design/ant-design/">
                  github.com/ant-design/ant-design/
                </a>
              }
            />
          </Col>
        </Row>
      </Drawer>
    </Col>
  );
};

export default compose(withFirebase)(ProfileCards);
