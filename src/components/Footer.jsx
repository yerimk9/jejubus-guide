import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer_info">
        <div className="info_logo">
          <Link to={"/"}>JEJU BUS</Link>
        </div>
        <div className="info_company">
          <p>Copyright©2024 JEJU BUS</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
