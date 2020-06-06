import React from "react";
import "../styles/App.css";
import Header from "./Header";
import Profile from "./Profile";
import SocialContact from "./SocialContact";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);
function App() {
  return (
    <div className="App profile-card">
      <Header />
      <Profile />
      <SocialContact />
    </div>
  );
}

export default App;
