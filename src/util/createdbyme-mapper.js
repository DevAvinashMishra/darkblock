//fields we need for ui + logic
//{name, creator, owner, contract, token, }
import * as NodeApi from "../api/node-api";
import * as parser from "../util/parser";

/**
 * @param  {CreatedByMe} nfts
 * Maps nfts to locally used objects for consistency
 *
 *
 */

const NO_USERNAME_FOUND = localStorage.getItem("accountAddress");
const NULL_USERNAME = "NullAddress";
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const getMappedList = async (nfts) => {
  var ids = parser.getContractAndTokensFromCreatedByMe(nfts);
  const darkblockedNfts = await NodeApi.getDarkblockedNftsFrom(ids);

  var mappedNfts = [];
  for (let i = 0; i < nfts.length; i++) {
    var nft = {
      name: getName(nfts[i]),
      creator: getCreator(nfts[i]),
      owner: getOwner(nfts[i]),
      contract: getContract(nfts[i]),
      token: getToken(nfts[i]),
      image: getImage(nfts[i]),
      is_darkblocked:
        darkblockedNfts !== undefined && darkblockedNfts.length > 0
          ? getIsDarkblocked(darkblockedNfts, nfts[i])
          : false,
    };
    // console.log(JSON.stringify(nft));
    mappedNfts.push(nft);
  }

  return mappedNfts;
};

//TODO need to optimize or find a work-around
const getIsDarkblocked = (darkblockedNfts, nft) => {
  return darkblockedNfts.includes(`${getContract(nft)}:${getToken(nft)}`);
};

const getContract = (nft) => {
  return nft.asset.asset_contract.address;
};

const getImage = (nft) => {
  return nft.asset.image_preview_url;
};

const getToken = (nft) => {
  return nft.asset.token_id;
};

const getName = (nft) => {
  if (!nft.asset.name) {
    return nft.asset.collection.name;
  }
  return `${nft.asset.name}`;
};

const getOwner = (nft) => {
  if (nft.asset.owner) {
    if (nft.asset.owner.user) {
      //got owner
      if (
        !nft.asset.owner.user.username ||
        nft.asset.owner.user.username === NULL_USERNAME
      ) {
        //if the username is null, or NullAddress
        if (nft.asset.owner.address === NULL_ADDRESS && nft.from_account.user) {
          //got owner
          if (
            nft.from_account.user.username &&
            nft.from_account.user.username !== NULL_USERNAME
          ) {
            return nft.from_account.user.username;
          }
          //if owner address is null, we set the creator (in this case from_account)
          if (nft.from_account.address === NULL_ADDRESS && nft.to_account) {
            if (
              nft.to_account.user &&
              nft.to_account.user.username &&
              nft.to_account.user.username !== NULL_USERNAME
            ) {
              return nft.to_account.user.username;
            }
            return nft.to_account.address;
          }
          return nft.from_account.address;
        }
        //the username of owner is not set
        return nft.asset.owner.address;
      }
      return nft.asset.owner.user.username;
    } else {
      //we have the owner, but the user is null, also got the address
      if (nft.asset.owner.address !== NULL_ADDRESS) {
        return nft.asset.owner.address;
      }
    }
  } else if (nft.from_account) {
    if (nft.from_account.user) {
      //got from_account info
      if (
        !nft.from_account.user.username ||
        nft.from_account.user.username === NULL_USERNAME
      ) {
        //creator username not set
        return nft.from_account.adress;
      }
      return nft.from_account.user.username;
    }
  } else {
    //no owner, no creator
    return NO_USERNAME_FOUND;
  }
};

const getCreator = (nft) => {
  if (!nft.from_account) {
    //creator is missing in all of em, use from_account
    if (nft.event_type === "transfer") {
      if (
        !nft.to_account.user.username ||
        nft.to_account.user.username === NULL_USERNAME
      ) {
        //creator username not set
        return nft.to_account.address;
      }
      return nft.to_account.user.username;
    }
  } else if (nft.from_account) {
    if (nft.from_account.user) {
      //got from_account info
      if (
        !nft.from_account.user.username ||
        nft.from_account.user.username === NULL_USERNAME
      ) {
        if (nft.from_account.address === NULL_ADDRESS) {
          return localStorage.getItem("accountAddress");
        }
        //creator username not set
        return nft.from_account.address;
      }
      return nft.from_account.user.username;
    }
  } else {
    return NO_USERNAME_FOUND;
  }
};
