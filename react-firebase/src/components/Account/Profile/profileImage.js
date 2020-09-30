import React, { useState, useEffect } from "react";

import { Form, Upload } from "antd";
import ImgCrop from "antd-img-crop";

const ProfileImage = ({ style, snapshot, authUser, returnData }) => {
  const [fileList, setFileList] = useState([]);
  let deleteStatus = false;

  //ON COMPONENT LOAD -> FETCH IMAGE IF EXISTS OR SET TO NULL
  useEffect(() => {
    const pic = [{ uid: authUser.uid, name: authUser.name, url: snapshot }];
    if (snapshot === "" || !snapshot) {
      //IF PROFILE IMAGE DOESN'T EXIST OR FALSE
      setFileList([]);
      returnData([], deleteStatus);
    } else {
      //IF PROFILE IMAGE EXISTS
      setFileList(pic);
      returnData([], deleteStatus);
    }
  }, [snapshot]);

  //on pic uploaded
  const onChange = ({ file: file, fileList: fileList }) => {
    setFileList(fileList);
    console.log(file);
    if (fileList.length > 0) {
      returnData(fileList, deleteStatus);
    } else {
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

  return (
    <Form.Item
      style={style}
      name="profilePic"
      label="Profile Picture"
      noStyle
    >
      <ImgCrop rotate>
        <Upload
          listType="picture-card"
          onChange={onChange}
          onPreview={onPreview}
          accept="image/*"
          customRequest={fakeSuccess}
          fileList={fileList}
        >
          {fileList === null || (fileList.length === 0 && "+ Upload")}
        </Upload>
      </ImgCrop>
    </Form.Item>
  );
};

export { ProfileImage };
