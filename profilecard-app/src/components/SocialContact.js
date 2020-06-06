import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SocialContact() {
  return (
    <ul className="profile-social-links">
      <li>
        <a target="_blank" href="https://www.instagram.com/sri.go">
          <FontAwesomeIcon icon={["fab", "instagram"]} size="lg" />
        </a>
      </li>
      <li>
        <a target="_blank" href="https://www.linkedin.com/in/sri-go">
          <FontAwesomeIcon icon={["fab", "linkedin"]} size="lg" />
        </a>
      </li>
      <li>
        <a target="_blank" href="https://www.github.com/sri-go">
          <FontAwesomeIcon icon={["fab", "github"]} size="lg" />
        </a>
      </li>
    </ul>
  );
}
