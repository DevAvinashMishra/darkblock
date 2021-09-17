import axios from "axios";

// const dummy_account = "0xbc355f371084200cd177131154ca8829fba0e623";

//fetches nfts associated to accountAddress
export const getNfts = (accountAddress) => {
  //switch the address var in production
  const URL = `https://api.rarible.com/protocol/v0.1/ethereum/nft/items/byCreator?creator=${accountAddress}`;
  return axios(URL, {
    method: "GET",
    headers: {
      "content-type": "application/json", // whatever you want
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

//fetches nfts associated to accountAddress
export const getNftMetaById = (id) => {
  //switch the address var in production
  const URL = `https://api.rarible.com/protocol/v0.1/ethereum/nft/items/${id}/meta`;
  return axios(URL, {
    method: "GET",
    headers: {
      "content-type": "application/json", // whatever you want
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      console.log(`Error : ${error.message}`);
      throw error;
    });
};

//fetches nfts associated to accountAddress
export const getUserProfile = (accountAddress) => {
  //switch the address var in production
  const URL = `https://api-mainnet.rarible.com/marketplace/api/v2/profiles/${accountAddress}`;
  return axios(URL, {
    method: "GET",
    headers: {
      "content-type": "application/json", // whatever you want
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

//fetches nfts associated to accountAddress
export const getNftById = (id) => {
  //switch the address var in production
  const URL = `https://api.rarible.com/protocol/v0.1/ethereum/nft/items/${id}`;
  return axios(URL, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
