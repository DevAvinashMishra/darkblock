import axios from "axios";

// const dummy_account = "0x1fa2e96809465732c49f00661d94ad08d38e68df";

const MY_NFTS_LIMIT = 50;
const CREATED_BY_ME_LIMIT = 50;

//fetches nfts associated to accountAddress, pagianted
export const getNftsForPage = async (page, accountAddress) => {
  //pagination query : &offset=0&limit=20

  var offset = (page - 1) * MY_NFTS_LIMIT;

  return await getNfts(accountAddress, offset);
};

//fetches nfts associated to accountAddress, pagianted
export const getNftsCreatedByUserForPage = async (page, accountAddress) => {
  //pagination query : &offset=0&limit=20

  var offset = (page - 1) * CREATED_BY_ME_LIMIT;

  return await getNftsCreatedByUser(accountAddress, offset);
};

//fetches nfts associated to accountAddress
export const getNfts = (accountAddress, offset) => {
  //pagination query : &offset=0&limit=20
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${offset}&limit=${MY_NFTS_LIMIT}&owner=${accountAddress}`,
    headers: {},
  };

  return axios(config)
    .then((response) => response.data.assets)
    .catch(function (error) {
      console.log(error);
    });
};

//fetches nfts associated to accountAddress
export const getAllNfts = async (accountAddress) => {
  //pagination query : &offset=0&limit=20

  var offset = 0;
  var allNfts = [];

  //hit the api (with updated offset) as long as we are getting the max nfts
  do {
    var tempNfts = await getNfts(accountAddress, offset);
    if (tempNfts !== undefined && tempNfts.length > 0) {
      offset += MY_NFTS_LIMIT;
      tempNfts.forEach((element) => {
        allNfts.push(element);
      });
      console.log(`Posts Fetched : ${allNfts.length}`);
    } else {
      break;
    }
  } while (tempNfts.length === MY_NFTS_LIMIT);
  return allNfts;
};

//fetches nfts associated to accountAddress
export const getAllNftsCreatedByUser = async (accountAddress) => {
  //pagination query : &offset=0&limit=20

  var offset = 0;
  var allNfts = [];

  //hit the api (with updated offset) as long as we are getting the max nfts
  do {
    var tempNfts = await getNftsCreatedByUser(accountAddress, offset);
    if (tempNfts !== undefined && tempNfts.length > 0) {
      offset += CREATED_BY_ME_LIMIT;
      tempNfts.forEach((element) => {
        allNfts.push(element);
      });
      console.log(`Posts Fetched : ${allNfts.length}`);
    } else {
      break;
    }
  } while (tempNfts.length === CREATED_BY_ME_LIMIT);
  return allNfts;
};

//fetches nfts associated to accountAddress, created by user
export const getNftsCreatedByUser = (accountAddress, offset) => {
  //pagination query : &offset=0&limit=20
  //event_type=created&
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/events?account_address=${accountAddress}&only_opensea=false&limit=${CREATED_BY_ME_LIMIT}&offset=${offset}
    `,
    headers: {},
  };

  return axios(config)
    .then((response) => response.data.asset_events)
    .catch(function (error) {
      console.log(error);
    });
};

//fetches nfts associated to accountAddress
export const getSingleNft = (contract, tokenId) => {
  var config = {
    method: "get",
    url: `https://api.opensea.io/api/v1/assets?asset_contract_address=${contract}&token_ids=${tokenId}`,
    headers: {},
  };

  return axios(config)
    .then((response) => response.data)
    .catch(function (error) {
      console.log(error);
    });
};
