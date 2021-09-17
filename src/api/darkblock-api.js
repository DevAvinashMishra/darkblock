import axios from "axios";
import qs from "qs";

//fetches nfts associated to accountAddress
export const confirmTvLogin = (code, wallet, sessionToken) => {
  var data = qs.stringify({
    wallet: wallet,
    code: code,
    session_token: sessionToken,
  });

  var config = {
    method: "post",
    url: "https://app.darkblock.io/api2/codeset",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};
