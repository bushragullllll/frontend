import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
   <footer className="footer">
  <div className="footer-container container">
    <p>&copy; {new Date().getFullYear()} TaskManager Pro. All Rights Reserved.</p>
    <div className="footer-links">
      <a href="/terms">Terms</a>
      <a href="/privacy">Privacy</a>
      <a href="/support">Support</a>
    </div>
  </div>
</footer>

  );
};

export default Footer;
