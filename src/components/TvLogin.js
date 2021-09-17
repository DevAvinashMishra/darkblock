import React from "react";
import "../App.scss";
import "../styles/tv.scss";
import { useState, useEffect } from "react";
import * as NodeApi from "../api/node-api";
import * as MetamaskUtil from "../util/metamask-util";
import Footer from "../components/footer";
import ReactGa from "react-ga";

export default function TvLogin({ address }) {
  const [code, setCode] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [connectResponse, setConnectResponse] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [isTestLogin, setIsTestLogin] = useState(false);
  const [isConnectEnabled, setIsConnectEnabled] = useState(true);

  useEffect(() => {
    //listener for test-login, F8 to toggle test-login
    const listener = (event) => {
      if (event.code === "F8") {
        event.preventDefault();
        setIsTestLogin((prevVal) => {
          console.log(`Test-Login status : ${!prevVal}`);
          setIsTestLogin(!prevVal);
        });
      }
    };
    document.addEventListener("keydown", listener);

    checkIfUserLoggedIn();

    return () => {
      document.removeEventListener("keydown", listener);
    };

    // eslint-disable-next-line
  }, [address]);

  const checkIfUserLoggedIn = () => {
    if (!address) {
      setIsUserLoggedIn(false);
    } else {
      setIsUserLoggedIn(true);
    }
  };

  const onSubmit = async () => {
    setIsConnectEnabled(false);

    try {
      if (isTestLogin === true) {
        ReactGa.event({
          category: "TV_LOGIN",
          action: "Pressed Connect in Test-Mode",
          label: "Attempted to login to tv in test-mode",
        });
        //add a hardcoded address and session token

        const testAddress = "0x438cba7e454b59a9f897d4731fd3eaef37160c0a";
        const testSessionToken =
          Date.now() +
          "_0x2c5546066929db3f3c4ebff3742e2d27a0e46cb50a7185320e694db7317c378b0f7ecc115a28f8d4fa76d50aba56f6ded16af508fded7c8e1cb345bf6a950f121b";

        var testSubmitResponse = await submitCode(
          testAddress,
          testSessionToken
        );
        console.log(testSubmitResponse);

        if (testSubmitResponse.status === 200) {
          //code submitted succesfully
          setIsResolved(true);
          setConnectResponse("The Darkblock TV App should now be signed in.");
        }
      } else {
        //normal flow
        ReactGa.event({
          category: "TV_LOGIN",
          action: "Pressed Connect",
          label: `Attempted to login to tv, address: ${address}`,
        });
        checkIfUserLoggedIn();
        var submitResponse;
        if (isUserLoggedIn === false) {
          //make him login, then send the code
          alert("Please make sure you are logged in first");
        } else {
          const signedSessionToken = await getSignedSession(address);
          submitResponse = await submitCode(address, signedSessionToken);
          console.log(submitResponse);

          if (submitResponse.status === 200) {
            //code submitted succesfully
            setIsResolved(true);
            setConnectResponse("The Darkblock TV App should now be signed in.");
            ReactGa.event({
              category: "TV_LOGIN",
              action: "Tv Login Success",
              label: `Attempt to login was successful, address: ${address}`,
            });
          }
        }
      }
    } catch (e) {
      setIsResolved(true);
      setConnectResponse("Login Failed! Incorrect code.");
      ReactGa.event({
        category: "TV_LOGIN",
        action: "Tv Login Failed",
        label: `Attempt to login failed, address: ${address}`,
      });
    }
  };

  const handleOnCodeChange = (e) => {
    setCode(e.target.value.toUpperCase());
  };

  const submitCode = async (address, sessionToken) => {
    return NodeApi.confirmTvLogin(code, address, sessionToken);
  };

  const getSignedSession = async (address) => {
    const epoch = Date.now(); // Unix timestamp in milliseconds
    var sessionToken = epoch + address;
    const signature = await MetamaskUtil.signTypedData(sessionToken);
    return epoch + "_" + signature;
  };

  return (
    <div className="tv-login">
      {isResolved === true ? (
        <div className="tv-success tv-height">
          <h1 className="tv-success-text">{connectResponse}</h1>
          <p className="tv-app-text">Troubles? Please refresh and try again.</p>
        </div>
      ) : (
        <div className="tv-height">
          {" "}
          <h1 className="tv-title">
            Enter 6 digit code from the TV App to Sign in.
          </h1>
          <p className="tv-meta">Requires Metamask for wallet verification.</p>
          <div className="tv-code">
            <input
              id="code"
              autoComplete="off"
              className="pin-input"
              placeholder="Please enter code here"
              value={code.toUpperCase()}
              maxLength="6"
              pattern="[0-9]*"
              onChange={handleOnCodeChange}
            />
          </div>
          <div className="tv-button">
            <button
              type="button"
              onClick={onSubmit}
              className="btn"
              disabled={!code || isConnectEnabled === false}
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {connectResponse === true ? (
        <div className="tv-success tv-height">
          <h1 className="tv-success-text">Login Failed! Incorrect code.</h1>
          <p className="tv-app-text">Please refresh and try again.</p>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
