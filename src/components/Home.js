import React from "react";
import wallet from "../images/wallet-icon-home.svg";
import * as MetamaskUtil from "../util/metamask-util";
import * as LoginUtil from "../util/login-util";
import { useHistory } from "react-router-dom";
import "../styles/home.scss";
import hands from "../images/hands.png";
import goldblock from "../images/goldblock.png";
import silverblock from "../images/silverblock.png";
import tvimage from "../images/tvimage.png";
import Footer from "../components/footer";
import homegold from "../images/homegold.png";
import silverhome from "../images/silverhome.png";

//Logs user into metamask and fetches their account address
export default function Home({ setAddress }) {

  let history = useHistory();

  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const address = await MetamaskUtil.signInAndGetAccount();
    if (address) {
      setAddress(address); //when address is set, user is redirected to dashboard
      LoginUtil.keepUserLoggedIn(address);
      redirectToNFts();
    }
  };

  const redirectToNFts = () => {
    history.push("/nfts/created");
  };

  return (
    <div>
      <div className="home-page ">
        <div className="home-hero home-container">
          <div>
            <h1 className="home-title">Give superpowers to your NFTs!</h1>
            <p className="for-free">
              (for free)<span>*</span>
            </p>
            <div className="login-container">
              <button onClick={getAccount} className="login-button">
                <img className="wallet-icon" src={wallet} alt="wallet icon" />
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>
          <div>
            <img className="hands-image" src={hands} alt="hands" />
          </div>
          <div className="arweave-warning">
            <p>
              *Uploading to Arweave isn’t free. But we’ve got you covered for
              now.
            </p>
          </div>
        </div>
        <div className="level-container">
          <div className="choose-level">
            <div>
              <h1 className="level-title">
              Encrypt exclusive content that only the NFT owner can see
              </h1>
            </div>
            <div className="home-level-desc">
              <img src={homegold} alt="gold block" />
              <div>
                <p>Darkblocks can only be decrypted and displayed by the<span className="home-bold"> NFT owner.</span></p>
                <ul>
                  <li><span className="home-bold">Protected</span> by Darkblock encryption</li>
                  <li>Support<span className="home-bold">large file sizes</span>(350MB)</li>
                  <li>Stored on <span className="home-bold">Arweave</span> forever</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="level-container">
          <div className="home-test-block">
            <div>
              <h1 className="test-title">
              Create Test Darkblocks and preview your creations, before they go live
              </h1>
            </div>
            <div className="home-level-desc">
              <img src={silverhome} alt="gold block" />
              <div>
                <p>
                Before you send your creation out into the world, you can create a <span className="home-bold">Test Darkblock</span> to preview it on the <span className="home-bold">Darkblock Android TV app</span> in Test Mode and make sure it is exactly as you envisioned!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="tv-container">
          <div className="tv-info">
            <img className="tv-image" src={tvimage} alt="tv" />
            <div className="text-block">
              <h1 className="tv-home-title">
                View your Darkblocks on the big screen along with all your other
                NFTs
              </h1>
              <p>
                Download the Darkblock Android TV app to decrypt and display
                your Darkblocks.
                <span className="tv-link">
                  <a rel="noreferrer" className="footer-link" href="https://play.google.com/store/apps/details?id=io.darkblock.darkblock&hl=en&gl=US" target="_blank">Google Play Store</a>
                  <span style={{padding:"0 8px"}}>-</span>
                  <a rel="noreferrer" className="footer-link" href="https://www.amazon.com/Darkblock-NFT-Display/dp/B09B4FLQZ6/" target="_blank">Amazon Fire TV Store</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
