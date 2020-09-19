import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { compose } from "recompose";

import UserList from "./Users/UserList";
import UserItem from "./Users/UserItem";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const AdminPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);

    props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val(); //retrieves an object of all users

      //restructuring object to make a list of all users
      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      setUsers(usersList);
      setLoading(false);
    });

    return () => props.firebase.users().off(); //cleanup
  }, []);

  return (
    <div>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      <Switch>
        <Route path={ROUTES.ADMIN_DETAILS} component={UserItem} />
        <Route path={ROUTES.ADMIN} component={UserList} />
      </Switch>
    </div>
  );
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(withAuthorization(condition))(AdminPage);
