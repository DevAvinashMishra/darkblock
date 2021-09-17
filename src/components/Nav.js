import React from "react";
import "../App.scss";
import logo from "../images/Black.svg";
import walleticon from "../images/wallet-icon.svg";
import wallet from "../images/wallet-button.svg";
import { useEffect } from "react";
import * as LoginUtil from "../util/login-util";
import { NavLink, useHistory } from "react-router-dom";
import * as MetamaskUtil from "../util/metamask-util";
import { useLocation } from "react-router-dom";
import SearchModal from "./SearchModal";
import SimpleModal from "./FindNft";

export default function Nav({ setAddress, address }) {
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {}, []);

  const handleLogOut = () => {
    LoginUtil.logOutUser();
    setAddress("");
    history.push("/");
  };

  const getAccount = async () => {
    //handle the case of when metamask is not installed
    const address = await MetamaskUtil.signInAndGetAccount();
    if (address) {
      setAddress(address); //when address is set, user is redirected to dashboard
      LoginUtil.keepUserLoggedIn(address);
      if (location.pathname === "/tv") {
        //dont redirect
      } else {
        redirectToNFts();
      }
    } else {
      alert(
        "Login Failed! Please make sure you have Metamask extension enabled."
      );
    }
  };

  const redirectToNFts = () => {
    history.push("/nfts/created");
  };

  return (
    <>
      {/* anika */}
      <header class="header">
        {address ? (
          <>
            <a href="/nfts/created">
              <img className="nav-logo" src={logo} alt="darkblock logo" />
            </a>
            <input class="menu-btn" type="checkbox" id="menu-btn" />
            <label class="menu-icon" for="menu-btn">
              <span class="navicon"></span>
            </label>
            {location.pathname === "/tv" ? null : (
              <ul class="menu">
                <li>
                  <NavLink
                    exact
                    className="nav-link"
                    activeClassName="active"
                    to="/nfts/created"
                  >
                    Created By Me
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="nav-link"
                    activeClassName="active"
                    to="/nfts/collected"
                  >
                    My NFT's
                  </NavLink>
                </li>
                <li>
                  <div style={{ marginTop: "5px" }}>
                    <SimpleModal />
                  </div>
                </li>
                <li>
                  <div className="dropdown">
                    <button className="dropbtn" >
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width="48"
                          height="48"
                          rx="4"
                          fill="#F4F4F0"
                          className="wallet-bg"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18 17C17.4523 17 17 17.4523 17 18C17 18.2652 17.1054 18.5196 17.2929 18.7071C17.4804 18.8946 17.7348 19 18 19H29V17H18ZM18 21C17.6561 21 17.3182 20.9409 17 20.8284V30C17 30.5477 17.4523 31 18 31H31V29H30C28.3477 29 27 27.6523 27 26C27 25.2043 27.3161 24.4413 27.8787 23.8787C28.4413 23.3161 29.2043 23 30 23H31V21H18ZM33 23V20C33 19.4477 32.5523 19 32 19H31V16C31 15.4477 30.5523 15 30 15H18C16.3477 15 15 16.3477 15 18V30C15 31.6523 16.3477 33 18 33H32C32.5523 33 33 32.5523 33 32V29H34C34.5523 29 35 28.5523 35 28V24C35 23.4477 34.5523 23 34 23H33ZM32 25H30C29.7348 25 29.4804 25.1054 29.2929 25.2929C29.1054 25.4804 29 25.7348 29 26C29 26.5477 29.4523 27 30 27H32H33V25H32Z"
                          fill="black"
                        />
                      </svg>
                    </button>
                    <div className="dropdown-content" >
                      <p onClick={handleLogOut}  >Log out</p>
                    </div>
                  </div>
                </li>
              </ul>
            )}
          </>
        ) : (
          <div className="nav">
            <div>
              <img
                className="nav-logo-loggedout"
                src={logo}
                alt="darkblock logo"
              />
            </div>
            <div className="nav-content">
              <div className="login-container">
                <button onClick={getAccount} className="login-button">
                  <img
                    className="wallet-icon"
                    src={walleticon}
                    alt="wallet icon"
                  />
                  <span>Connect Wallet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
