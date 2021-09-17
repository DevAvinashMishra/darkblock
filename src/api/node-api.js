import axios from "axios";
import qs from "qs";

// Takes care of all the calls to our Node Api

// const baseUrl = "http://localhost:5000";
const baseUrl = "/api";

//uploads the file+tags to back-end to trigger transaction
export const postTransaction = (data, options) => {
  const URL = `${baseUrl}/upload`;
  return axios
    .post(URL, data, options)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

//gets an arr of id's matched
export const verifyNFTs = (data) => {
  const URL = `${baseUrl}/verify`;

  return axios
    .post(URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

//get meta data of the match
export const verifyNFT = (data) => {
  const URL = `${baseUrl}/verify-id`;
  return axios
    .post(URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

//gets an arr of id's matched
export const getDarkblockedNftsFrom = async (ids) => {
  const data = new FormData(); //we put the file and tags inside formData and send it across
  data.append("ids", ids);

  try {
    const verifyRes = await verifyNFTs(data);
    //handle the response
    //check if we got any matches
    var matches = verifyRes.data;
    if (matches) {
      //here we have some matches : separate the ids by comma and compare with items
      var matchesArr = matches.split(",");
      return matchesArr;
    }
  } catch (err) {
    //catch some errors here
    console.log(err);
  }
};

export const getDarkblockedNftFrom = async (id) => {
  const data = new FormData(); //we put the file and tags inside formData and send it across
  data.append("ids", id);

  try {
    const verifyRes = await verifyNFT(data);
    //handle the response
    return verifyRes;
  } catch (err) {
    //catch some errors here
    console.log(err);
  }
};

//fetches nfts associated to accountAddress
export const confirmTvLogin = (code, wallet, sessionToken) => {
  const URL = `${baseUrl}/codeset`;

  var data = qs.stringify({
    wallet: wallet,
    code: code,
    session_token: sessionToken,
  });
  var config = {
    method: "post",
    url: URL,
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
