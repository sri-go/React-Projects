import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";

import { Button } from "antd";

import { withFirebase } from "../Firebase";

const SignOutButton = ({ history, firebase }) => {
  const onClick = (event) => {
    firebase.doSignOut().catch((error) => {
      console.log(error);
    });
  };

  return (
    <Button primary type="button" onClick={onClick}>
      Sign Out
    </Button>
  );
};

export default compose(withRouter, withFirebase)(SignOutButton);
