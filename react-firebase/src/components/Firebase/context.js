import React from "react";

const FirebaseContext = React.createContext(null);

export function withFirebase(Component) {
  return function (props) {
    return (
      <FirebaseContext.Consumer>
        {(firebase) => <Component {...props} firebase={firebase} />}
      </FirebaseContext.Consumer>
    );
  };
}

export default FirebaseContext;