export const filterNftsForCreatedByMe = (nfts) => {
  // if the event_type="created" OR event_type="transfer"
  //AND form_account.address is 0x0000000000000000000000000000000000000000
  var filteredNfts = [];
  for (let i = 0; i < nfts.length; i++) {
    if (
      nfts[i].event_type === "created" ||
      (nfts[i].event_type === "transfer" &&
        nfts[i].from_account.address ===
          "0x0000000000000000000000000000000000000000")
    ) {
      if (!nfts[i].asset) {
        //skip over the collections
        console.log(`This one is a collection : ${i}`);
        continue;
      }
      filteredNfts.push(nfts[i]);
    }
  }

  var uniqueNfts = [];

  //filter out duplicates
  try {
    uniqueNfts = removeDupes(filteredNfts);
  } catch (e) {
    console.log(e);
  }
  return uniqueNfts;
};

export const removeDupes = (nfts) => {
  var uniqueArr = nfts.reduce(function (accumulator, current) {
    if (checkIfAlreadyExist(current)) {
      return accumulator;
    } else {
      return accumulator.concat([current]);
    }

    function checkIfAlreadyExist(currentVal) {
      return accumulator.some(function (item) {
        return (
          item.asset.asset_contract.address ===
            currentVal.asset.asset_contract.address &&
          item.asset.token_id === currentVal.asset.token_id
        );
      });
    }
  }, []);
  return uniqueArr;
};

const addBlanks = (nfts) => {
  for (let i = 0; i < (nfts.length % 4) + 8; i++) {
    nfts.push(undefined);
  }
  return nfts;
};

const removeBlanks = (nfts) => {
  var noBlanks = nfts.filter(function (el) {
    return el != null;
  });
  return noBlanks;
};

export const removeDupesFromMapped = (nfts) => {
  //remove blanks here
  const noBlanks = removeBlanks(nfts);
  var uniqueArr = noBlanks.reduce(function (accumulator, current) {
    if (checkIfAlreadyExist(current)) {
      return accumulator;
    } else {
      return accumulator.concat([current]);
    }

    function checkIfAlreadyExist(currentVal) {
      return accumulator.some(function (item) {
        return (
          item.contract === currentVal.contract &&
          item.token === currentVal.token
        );
      });
    }
  }, []);
  //add it back here
  return addBlanks(uniqueArr);
};
