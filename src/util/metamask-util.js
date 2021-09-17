import Web3 from "web3";
import ReactGa from "react-ga";

// A JS library for recovering signatures:

const web3 = new Web3(Web3.givenProvider || "http://localhost:8080");

export async function signTypedData(data) {
  const address = await signInAndGetAccount();

  const typedData = [
    {
      type: "string",
      name: "Message",
      value: data,
    },
  ];

  return web3.currentProvider.send(
    {
      method: "eth_signTypedData",
      params: [typedData, address],
    },
    function (err, result) {
      if (err) return console.error(err);
      if (result.error) {
        return result.error.message;
      }
      return result.result;
    }
  );
}

export async function signData(data, address) {
  let signature = await new Promise((resolve, reject) => {
    web3.eth.sign(data, address, function (err, result) {
      if (err) return reject(err);
      console.log(`Result : ${result}`);
      return resolve(result);
    });
  });
  return signature;
}

const ethereum = window.ethereum;

export async function signInAndGetAccount() {
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (e) {
    alert(`Please make sure you have Metamask installed : ${e.message}`);
    ReactGa.event({
      category: "USER_LOGIN",
      action: "Login Failed",
      label: "Attempt to login failed with error : " + e,
    });
  }
}
