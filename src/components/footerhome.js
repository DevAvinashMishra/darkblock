import React from "react";
import "../styles/footer.scss";
import footericon from "../images/footericon.svg";
import footerdb from "../images/footerdb.svg";

export default function FooterHome() {
    const footerhome = {
        position: 'relative',
        backgroundColor: '#121212',
        paddingLeft: '120px',
        paddingRight: '120px',
        paddingTop: '80px',
        paddingBottom: '24px',
        color: '#ffffff',
        marginTop: '40px'
      }

  return (
    <footer>
      <div style={footerhome} className="footer-home">
        <div className="footer-grid">
          <div className="footer-column">
            <h1 className="footer-title">Contact</h1>
            <ul className="footer-item">
              <li>
                <a rel="noreferrer" className="footer-link" href="mailto:info@darkblock.io">
                  info@darkblock.io
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h1 className="footer-title">Useful Links</h1>
            <ul className="footer-item">
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="https://darkblock.io"
                  target="_blank"
                >
                  darkblock.io
                </a>
              </li>
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link non-link"
                //   href=""
                  target="_blank"
                >
                  The Darkblock TV app
                </a>
              </li>
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="https://darkblock.medium.com/darkblock-bridge-to-the-decentralized-digital-frontier-e1ec1eeb5a60"
                  target="_blank"
                >
                  Read our manifesto
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h1 className="footer-title">Follow Us</h1>
            <ul className="footer-item">
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="https://darkblock.medium.com/"
                  target="_blank"
                >
                  Medium
                </a>
              </li>
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="http://chat.darkblock.io"
                  target="_blank"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="https://twitter.com/darkblockio"
                  target="_blank"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="https://www.instagram.com/darkblock.io/"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-icon">
            <img src={footericon} alt="icon" />
            <img className="footer-db" src={footerdb} alt="icon" />
            <p className="footer-copyright">2021 ©</p>
        </div>
      </div>
    </footer>
  );
}
