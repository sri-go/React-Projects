import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Table, Tag, Space } from "antd";

import { withFirebase } from "../../Firebase";
import * as ROUTES from "../../../constants/routes";

const UserList = (props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  let color;
  useEffect(() => {
    setLoading(true);
    props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));
      setUsers(usersList);
      setLoading(false);
    });
    return () => props.firebase.users().off();
  }, []);

  /*
  Each Record Object
  {
    email: "john.syl@gmail.com"
    name: "john syl"
    roles: {ADMIN: false}
    uid: "0D6EL11GZQZFaDXdQB9xbqsODKE3"
  }
  */

  const onClick = (e) => {
    console.log(e);
  };

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "age",
    },
    {
      title: "Admin",
      key: "admin",
      render: (text, record) => (
        <>
          {/* {} */}
          <Tag
            color={
              record.roles.ADMIN ? (color = "green") : (color = "geekblue")
            }
          >
            {record.roles.ADMIN ? "Admin" : "User"}
          </Tag>
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link
            to={{
              pathname: `${ROUTES.ADMIN}/${record.uid}`,
              state: { record },
            }}
          >
            Details
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Row align="middle" justify="center">
      <Col span={16}>
        <Table columns={columns} dataSource={users} />
      </Col>
    </Row>
  );
};

export default withFirebase(UserList);

/*
  <div>
        <h2>Users</h2>
        {loading && <div>Loading ...</div>}
        <ul>
          {users.map((user) => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <span>
                <strong>Username:</strong> {user.username}
              </span>
              <span>
                <Link
                  to={{
                    pathname: `${ROUTES.ADMIN}/${user.uid}`,
                    state: { user },
                  }}
                >
                  Details
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
*/
