import React from "react";
import "../styles/footer.scss";
import footericon from "../images/footericon.svg";
import footerdb from "../images/footerdb.svg";

export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <div className="footer-grid">
          <div className="footer-column">
            <h1 className="footer-title">Contact</h1>
            <ul className="footer-item">
              <li>
                <a rel="noreferrer" className="footer-link" href="mailto:info@darkblock.io">
                  info@darkblock.io
                </a>
              </li>
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
                  className="footer-link"
                  href="http://chat.darkblock.io"
                  target="_blank"
                >
                  Join our Discord
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
                  href="/help"
                >
                  Help
                </a>
              </li>
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="https://play.google.com/store/apps/details?id=io.darkblock.darkblock&hl=en&gl=US"
                  target="_blank"
                >
                  <span style={{marginTop:"0"}} className="tv-link">
                  <a rel="noreferrer" className="footer-link" href="https://play.google.com/store/apps/details?id=io.darkblock.darkblock&hl=en&gl=US" target="_blank">Google Play Store</a>
                  <br></br>
                  <a rel="noreferrer" className="footer-link" href="https://www.amazon.com/Darkblock-NFT-Display/dp/B09B4FLQZ6/" target="_blank">Amazon Fire TV Store</a>
                </span>
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
              <li>
                <a
                  rel="noreferrer"
                  className="footer-link"
                  href="https://opensea.io"
                  target="_blank"
                >
                  NFT data powered by Opensea
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
