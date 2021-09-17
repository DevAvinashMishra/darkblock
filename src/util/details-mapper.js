//fields we need for ui + logic
//{name, creator, owner, contract, token, }
import * as NodeApi from "../api/node-api";
import * as parser from "./parser";

/**
 * @param  {CreatedByMe} nfts
 * Maps nfts to locally used objects for consistency
 *
 *
 */

const NO_USERNAME = localStorage.getItem("accountAddress");
const NULL_USERNAME = "NullAddress";
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const getMappedNft = async (nft) => {
  var id = parser.getContractAndTokensDetails(nft);
  const verifyRes = await NodeApi.getDarkblockedNftFrom(id);

  var nftId = "";
  var darkblockDescription = "";
  var dateCreated = "";
  var encryptionLevel = "";

  var darkblockedNft;
  if (verifyRes !== undefined && verifyRes.data) {
    darkblockedNft = verifyRes.data;
    //attach darblock data with it
    nftId = !darkblockedNft[0] ? "" : darkblockedNft[0].value;
    darkblockDescription = !darkblockedNft[1] ? "" : darkblockedNft[1].value;
    dateCreated = !darkblockedNft[2] ? "" : darkblockedNft[2].value;
    encryptionLevel = !darkblockedNft[3] ? "" : darkblockedNft[3].value;
  }

  var mappedNft = {
    name: getName(nft),
    creator: getCreator(nft),
    owner: getOwner(nft),
    contract: getContract(nft),
    token: getToken(nft),
    image: getImage(nft),
    animation_url: getAnimationUrl(nft),
    edition: getEdition(nft),
    nft_description: getDescription(nft),
    darkblock_description: darkblockDescription,
    blockchain: nft.asset_contract.schema_name,
    is_darkblocked: darkblockedNft ? true : false,
    is_owned_by_user: checkIfNftOwnedByUser(nft),
    nftId: nftId,
    nft_date_created: nft.asset_contract.created_date,
    darkblock_date_created: dateCreated,
    encryptionLevel: encryptionLevel === "AES-256" ? "two" : "one",
  };
  return mappedNft;
};

const checkIfNftOwnedByUser = (nft) => {
  // const accountAddress = "0x1fa2e96809465732c49f00661d94ad08d38e68df";
  const loggedInAccount = localStorage.getItem("accountAddress");

  if (nft.creator.address === loggedInAccount) {
    return true;
  } else {
    return false;
  }
};

//TODO need to optimize or find a work-around
// const getIsDarkblocked = (darkblockedNfts, nft) => {
//   return darkblockedNfts.includes(`${getContract(nft)}:${getToken(nft)}`);
// };

const getContract = (nft) => {
  return nft.asset_contract.address;
};

const getImage = (nft) => {
  return nft.image_url;
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
  return nft.name;
};

const getDescription = (nft) => {
  if (!nft.description) {
    return "";
  }
  return nft.description;
};

const getOwner = (nft) => {
  if (nft.owner) {
    //got owner
    if (nft.owner.user) {
      if (
        !nft.owner.user.username ||
        nft.owner.user.username === NULL_USERNAME
      ) {
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

        //we only have the creator in this case, no owner, no last_sale
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
    //got creator
    if (nft.creator.user) {
      if (
        !nft.creator.user.username ||
        nft.creator.user.username === NULL_USERNAME
      ) {
        //creator username not set
        return nft.creator.address;
      }
      return nft.creator.user.username;
    } else {
      //we have the owner, but the user is null, also got the address
      if (nft.creator.address !== NULL_ADDRESS) {
        return nft.creator.address;
      }
    }
  } else {
    //no owner, no creator
    return NO_USERNAME;
  }
};

const getCreator = (nft) => {
  if (nft.creator) {
    //got creator
    if (nft.creator.user) {
      if (
        !nft.creator.user.username ||
        nft.creator.user.username === NULL_USERNAME
      ) {
        //the username of owner is not set
        return nft.creator.address;
      }
      return nft.creator.user.username;
    } else {
      //we have the owner, but the user is null, also got the address
      if (nft.creator.address !== NULL_ADDRESS) {
        return nft.creator.address;
      }
    }
  } else if (nft.owner) {
    //got owner
    if (nft.owner.user) {
      if (
        !nft.owner.user.username ||
        nft.owner.user.username === NULL_USERNAME
      ) {
        //owner username not set
        return nft.owner.address;
      }
      return nft.owner.user.username;
    } else {
      //we have the owner, but the user is null, also got the address
      if (nft.owner.address !== NULL_ADDRESS) {
        return nft.owner.address;
      }
    }
  } else {
    //no owner, no creator
    return NO_USERNAME;
  }
};

const getEdition = (nft) => {
  if (!nft.asset_contract.nft_version) {
    return "1/1";
  }
  return nft.asset_contract.nft_version;
};
