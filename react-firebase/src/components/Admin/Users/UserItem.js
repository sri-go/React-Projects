import React, { useState, useEffect } from "react";
import { compose } from "recompose";

import { withFirebase } from "../../Firebase";
import * as ROLES from "../../../constants/roles";

const UserItemBase = (props) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(props.location.state.user);

  const [isAdmin, setIsAdmin] = useState(user.roles.ADMIN);
  const roles = {};

  useEffect(() => {
    console.log(props.location.state);
    if (!user) return;
    setLoading(true);
    props.firebase.user(user.uid).on("value", (snapshot) => {
      setUser(snapshot.val());
      setLoading(false);
      console.group(user);
    });
    return () => props.firebase.user(props.match.params.id).off();
  }, []);

  useEffect(() => {
    //prevent accidental admin change to current user logged in
    if (props.match.params.id !== props.firebase.auth.currentUser.uid) {
      console.log(isAdmin);
      roles[ROLES.ADMIN] = isAdmin;
      props.firebase.user(props.match.params.id).update({ roles: roles });
    }
  }, [isAdmin]);

  const onSendPasswordResetEmail = () => {
    props.firebase.doPasswordReset(user.email);
  };

  const onChangeCheckbox = (event) => {
    const { name, checked } = event.target;
    setIsAdmin(checked);
  };

  return (
    <div>
      <h2>User ({props.match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
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
            <button type="button" onClick={onSendPasswordResetEmail}>
              Send Password Reset
            </button>
          </span>
          <label>
            Admin:
            <input
              name="isAdmin"
              type="checkbox"
              checked={user.roles.ADMIN}
              onChange={onChangeCheckbox}
            />
          </label>
        </div>
      )}
    </div>
  );
};

const UserItem = compose(withFirebase)(UserItemBase);

export default UserItem;
