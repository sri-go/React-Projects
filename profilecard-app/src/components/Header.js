import React from "react";
import ProfilePic from "../assets/DSC_7113.jpg";

export default function Header() {
  return (
    <header>
      {/* <!-- here’s the avatar --> */}
      <a target="_blank" href="#">
        <img src={ProfilePic} class="hoverZoomLink" />
      </a>

      {/* <!-- the username --> */}
      <h1>Sri Gowda</h1>

      {/* <!-- and role or location --> */}
      <h2>Learning Front End Engineering</h2>
    </header>
  );
}
