export const getContractAndTokensFrom = (nfts) => {
  var ids = "";
  for (let i = 0; i < nfts.length; i++) {
    ids += `"${nfts[i].contract}:${nfts[i].token}",`;
  }
  return ids.substring(0, ids.length - 1);
};

export const getContractAndTokensFromMyNfts = (nfts) => {
  var ids = "";
  for (let i = 0; i < nfts.length; i++) {
    ids += `"${nfts[i].asset_contract.address}:${nfts[i].token_id}",`;
  }
  return ids.substring(0, ids.length - 1);
};

export const getContractAndTokensFromCreatedByMe = (nfts) => {
  var ids = "";
  for (let i = 0; i < nfts.length; i++) {
    ids += `"${nfts[i].asset.asset_contract.address}:${nfts[i].asset.token_id}",`;
  }
  return ids.substring(0, ids.length - 1);
};

export const getContractAndTokensDetails = (nft) => {
  var ids = "";

  ids += `"${nft.asset_contract.address}:${nft.token_id}",`;

  return ids.substring(0, ids.length - 1);
};
