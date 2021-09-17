//fields we need for ui + logic
//{name, creator, owner, contract, token, image}
import * as NodeApi from "../api/node-api";
import * as parser from "../util/parser";

/**
 * @param  {MyNfts} nfts
 * Maps nfts to locally used objects for consistency,
 *
 *
 */

const NO_USERNAME_FOUND = localStorage.getItem("accountAddress");
const NULL_USERNAME = "NullAddress";
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const getMappedList = async (nfts) => {
  var ids = parser.getContractAndTokensFromMyNfts(nfts);
  const darkblockedNfts = await NodeApi.getDarkblockedNftsFrom(ids);
  var mappedNfts = [];
  for (let i = 0; i < nfts.length; i++) {
    //
    var nft = {
      name: getName(nfts[i]),
      creator: getCreator(nfts[i]),
      owner: getOwner(nfts[i]),
      contract: getContract(nfts[i]),
      token: getToken(nfts[i]),
      image: getImage(nfts[i]),
      // animation_url: getAnimationUrl(nfts[i]),
      is_darkblocked:
        darkblockedNfts !== undefined && darkblockedNfts.length > 0
          ? getIsDarkblocked(darkblockedNfts, nfts[i])
          : false,
    };
    mappedNfts.push(nft);
  }

  return mappedNfts;
};

//TODO need to optimize or find a work-around
const getIsDarkblocked = (darkblockedNfts, nft) => {
  return darkblockedNfts.includes(`${getContract(nft)}:${getToken(nft)}`);
};

const getContract = (nft) => {
  return nft.asset_contract.address;
};

const getImage = (nft) => {
  return nft.image_preview_url;
};

const getAnimationUrl = (nft) => {
  if (nft.animation_url) {
    return nft.animation_url;
  }
  return "";
};

const getToken = (nft) => {
  return nft.token_id;
};

const getName = (nft) => {
  if (!nft.name) {
    return nft.collection.name;
  }
  return `${nft.name}`;
};

const getOwner = (nft) => {
  if (nft.owner) {
    if (nft.owner.user) {
      //got owner
      if (
        !nft.owner.user.username ||
        nft.owner.user.username === NULL_USERNAME
      ) {
        //the username of owner is not set
        if (nft.owner.address === NULL_ADDRESS && nft.last_sale) {
          if (
            nft.last_sale.transaction &&
            nft.last_sale.transaction.from_account
          ) {
            if (
              nft.last_sale.transaction.from_account.user &&
              nft.last_sale.transaction.from_account.user.username
            ) {
              return nft.last_sale.transaction.from_account.user.username;
            }
            return nft.last_sale.transaction.from_account.address;
          }
        }
        if (
          nft.owner.address === NULL_ADDRESS &&
          nft.creator &&
          nft.creator.user
        ) {
          //got owner
          if (
            nft.creator.user.username &&
            nft.creator.user.username !== NULL_USERNAME
          ) {
            return nft.creator.user.username;
          }
          //if owner address is null, we set the creator (in this case from_account)
          return nft.creator.address;
        }
        //the username of owner is not set
        return nft.owner.address;
      }
      return nft.owner.user.username;
    } else {
      //we have the owner, but the user is null, also got the address
      if (nft.owner.address !== NULL_ADDRESS) {
        return nft.owner.address;
      }
    }
  } else if (nft.creator) {
    if (nft.creator.user) {
      //got from_account info
      if (
        !nft.creator.user.username ||
        nft.creator.user.username === NULL_USERNAME
      ) {
        //creator username not set
        return nft.creator.address;
      }
      return nft.creator.user.username;
    }
  } else {
    //no owner, no creator
    return NO_USERNAME_FOUND;
  }
};

const getCreator = (nft) => {
  if (nft.creator) {
    if (nft.creator.user) {
      //got creator
      if (
        !nft.creator.user.username ||
        nft.creator.user.username === NULL_USERNAME
      ) {
        //the username of creator is not set
        return nft.creator.address;
      }
      return nft.creator.user.username;
    }
  } else if (nft.owner) {
    if (nft.owner.user) {
      //got owner info
      if (
        !nft.owner.user.username ||
        nft.owner.user.username === NULL_USERNAME
      ) {
        //owner username not set
        return nft.owner.address;
      }
      return nft.owner.user.username;
    }
  } else {
    //no owner, no creator
    return NO_USERNAME_FOUND;
  }
};
