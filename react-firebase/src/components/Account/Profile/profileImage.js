import React, { useState, useEffect } from "react";

import { Form, Upload } from "antd";
import ImgCrop from "antd-img-crop";

const ProfileImage = ({ style, authUser, firebase, returnData }) => {
  const [fileList, setFileList] = useState([]);

  let deleteStatus = false;

  //on component load
  useEffect(() => {
    firebase.userProfile(authUser.uid).on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        const { name, profileURL } = data;
        const pic = [{ uid: authUser.uid, name: name, url: profileURL }];
        if (profileURL === "" || !profileURL) {
          setFileList([]);
          returnData([], deleteStatus);
        } else {
          setFileList(pic);
          returnData([], deleteStatus);
        }
      }
    });
    return () => firebase.userProfile(authUser.uid).off();
  }, []);

  //on pic uploaded
  const onChange = ({ file: file, fileList: fileList }) => {
    setFileList(fileList);
    console.log(file);
    if (fileList.length > 0) {
      returnData(fileList, deleteStatus);
    } else {
      console.log(deleteStatus);
      deleteStatus = true;
      returnData(fileList, deleteStatus);
    }
  };
  //circumvents default antd upload action
  //to do implement file compression here
  const fakeSuccess = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  // console.log(style)
  return (
    <Form.Item style={style} name="profilePic" label="Profile Picture" noStyle>
      <ImgCrop rotate>
        <Upload
          listType="picture-card"
          onChange={onChange}
          onPreview={onPreview}
          accept="image/*"
          customRequest={fakeSuccess}
          fileList={fileList}
          id="profile"
        >
          {fileList === null || (fileList.length === 0 && "+ Upload")}
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
};

export { ProfileImage };
