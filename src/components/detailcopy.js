import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../util/UserContext";
import * as Formatter from "../util/formatter";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
import "../styles/detail.scss";
import * as OpenseaApi from "../api/opensea-api";
import $ from "jquery";
import Preview from "./LevelOneFileChooser";
import PreviewTwo from "./LevelTwoFileChooser";
import * as HashUtil from "../util/hash-util";
import * as parser from "../util/parser";

export default function DetailsViewCopy() {
  // const [id, setId] = useState("0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:10");
  const address = useContext(UserContext);
  const [level, setLevel] = useState("0"); //darkblock level
  const [nft, setNft] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkblocked, setIsDarkblocked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUploadProgress, setFileUploadProgress] = useState("");
  const { contract, token } = useParams();
  const [darkblockDescription, setDarkblockDescription] = useState("");

  const accountAddress = "0x1fa2e96809465732c49f00661d94ad08d38e68df";

  useEffect(() => {
    function previewFile(input) {
      var file = $("input[type=file]").get(0).files[0];

      if (file) {
        var reader = new FileReader();

        reader.onload = function () {
          $("#previewImg").attr("src", reader.result);
        };

        reader.readAsDataURL(file);
      }
    }
    //!TODO Handle the id validation, then init requests

    const fetchDataForNft = async () => {
      try {
        const nft = await OpenseaApi.getSingleNft(contract, token).then(
          (res) => res.assets[0]
        );
        var idsString = parser.getContractAndTokensDetails(nft);
        await verifyNFT(idsString);
        setNft(nft);
        setIsLoaded(true); //load it in ui
      } catch (e) {
        console.log(e);
      }
    };

    fetchDataForNft();

    console.log(`Address : ${address}`);
    console.log(`Redirect Params : ${contract} : ${token}`);
  }, []);

  const verifyNFT = async (ids) => {
    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("ids", ids);

    try {
      const verifyRes = await NodeApi.verifyNFTs(data);
      //handle the response
      var matches = verifyRes.data;
      if (matches) {
        //nft already darkblocked
        setIsDarkblocked(true);
        console.log(`Verify Response : ${JSON.stringify(matches)}`);
      }
    } catch (err) {
      //catch some errors here
      console.log(err);
    }
  };

  const onLevelOneFileChange = (e) => {
    //level two file is picked
    //TODO handle when user cancels the process
    console.log(`Level One Selected`);
    setLevel("one");
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onLevelTwoFileChange = async (e) => {
    //level one file is picked
    //TODO handle when user cancels the process
    console.log(`Level Two Selected`);
    setLevel("two");
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const isNftOwnedByUser = () => {
    if (
      nft.creator.address === accountAddress ||
      nft.owner.address === address
    ) {
      return true;
    }
    return false;
  };

  const onCreateDarkblockClick = async (e) => {
    e.preventDefault();

    //check the owner of the nft
    if (isNftOwnedByUser()) {
      console.log(`Creating Darkblock`);
      initDarkblockCreation();
    } else {
      alert("Please select an nft that you own");
      console.log(`You are not the owner/creator of nft`);
    }
  };

  const initDarkblockCreation = async () => {
    setIsUploading(true);
    console.log(`Init Hashing the file`);
    const fileHash = await HashUtil.hashInChunks(file);
    console.log(`Hash of the file : ${fileHash}`);
    //now sign this hash with eth wallet and attach it to tags

    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("file", file);
    data.append("contract", nft.asset_contract.address);
    data.append("token", nft.token_id);
    data.append("wallet", address); // replace with wallet
    data.append("level", level);
    data.append("token_schema", nft.asset_contract.schema_name);
    data.append("darkblock_description", darkblockDescription);
    data.append("darkblock_hash", fileHash);

    try {
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          console.log(
            `${Formatter.formatBytes(loaded)} of ${Formatter.formatBytes(
              total
            )} | ${percent}%`
          );

          if (percent < 100) {
            var progress = `${Formatter.formatBytes(
              loaded
            )} of ${Formatter.formatBytes(total)} | ${percent}%`;
            setFileUploadProgress(progress);
          }
        },
      };

      NodeApi.postTransaction(data, options).then((data) => {
        //handle the response
        console.log(`Message : ${data.message}`);
      });
    } catch (err) {
      //catch some errors here
      console.log(err);
    }
  };

  const setName = () => {
    if (!nft.name) {
      return nft.collection.name;
    }
    return nft.name;
  };

  const setOwner = () => {
    if (nft.owner.user.username === "NullAddress") {
      if (!nft.creator.user.username) {
        return "No Username";
      }
      return nft.creator.user.username;
    }
    return nft.owner.user.username;
  };

  const setCreator = () => {
    if (nft.creator.user && nft.creator.user.username) {
      //got creator username
      if (nft.creator.user.username === "NullAddress") {
        return "No Username";
      }
      return nft.creator.user.username;
    } else if (nft.owner.user && nft.owner.user.username) {
      //got owner username
      if (nft.owner.user.username === "NullAddress") {
        return "No Username";
      }
      return nft.owner.user.username;
    } else {
      //no owner, no creator
      return "No Username";
    }
  };

  const setEdition = () => {
    if (!nft.asset_contract.nft_version) {
      return "1/1";
    }
    return nft.asset_contract.nft_version;
  };

  const onDarkblockDescriptionChange = (e) => {
    //additional info is being added for darkblock creation
    setDarkblockDescription(e.target.value);
  };

  const levelOneFileSelectionHandler = (files) => {
    console.log(`We have the files in Details : ${files.length}`);
  };

  const levelTwoFileSelectionHandler = (files) => {
    //hook this up with previewtwo
    console.log(`We have the files in Details : ${files.length}`);
  };

  return (
    <div>
      {isLoaded ? (
        // column 1
        <div className="detail-page-container">
          <div className="detail-preview-image ">
            <img
              alt="nft-preview"
              className="nft-detail-preview"
              src={nft.image_url}
            />
          </div>
          <div className="detail-name-container">
            <h1 className="nft-detail-name">{setName()}</h1>
          </div>
          <div>
            <p className="nft-deatil-owner">
              Owned by <span className="owner-color">{setOwner()}</span>
            </p>
          </div>
          <div className="detail-container">
            {" "}
            <div>
              <h1 className="detail-about-nft">About the NFT</h1>
              <div className="about-the-nft">
                <div className="flex-grid-thirds">
                  <div className="col">
                    Creator <span className="about-span">{setCreator()}</span>
                  </div>
                  <div className="col">
                    Date Created{" "}
                    <span className="about-span date-created">
                      {nft.asset_contract.created_date}
                    </span>
                  </div>
                  <div className="col">
                    Edition <span className="about-span">{setEdition()}</span>
                  </div>
                </div>
                <div className="artist-statement">
                  Artist Statement
                  <p className="about-description">{"TBD"}</p>
                </div>
              </div>
              {/* <div>Username : {user.name}</div>
              <div>User Description : {user.description}</div>
              <div>User Image : {user.cover}</div>
              <div>Nfts Created : {nfts.length}</div>
              <div>First Nft Created : {nfts[nfts.length - 1].date}</div>
              <div>Contract Address : {nft.contract}</div>
              <div>Token Id : {nft.tokenId}</div>
              <div>BlockChain : Ethereum</div>
              <div>Created By : {user.name}</div>
              <div>Owned By : {user.name}</div>
              {/* <img src={nftMeta.image.url.PREVIEW} /> */}
              {/* <div>Date Created : {nft.date}</div>{" "} */}
              <div className="chain-info">
                <h1 className="detail-about-nft">Chain Info</h1>
                <div className="chain-content">
                  <div className="chain-flex">
                    <p>Contact Address</p>
                    <span className="chain-span contract-address">
                      {nft.asset_contract.address}
                    </span>
                  </div>
                  <div className="chain-flex">
                    <p>Token Id</p>
                    <span className="chain-span">{nft.token_id}</span>
                  </div>
                  <div className="chain-flex blockchain">
                    <p>BlockChain</p>
                    <span className="chain-span">
                      {nft.asset_contract.schema_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Column 2 */}
            <div className="create-darkblock">
              <form onSubmit={onCreateDarkblockClick}>
                <div>
                  <div className="create-darkblock-container">
                    <h1 className="create-title">Create Darkblock</h1>
                    <p className="create-subtitle">
                      Upload your file and select your Darkblock level.{" "}
                    </p>
                    <p className="create-subtitle">
                      Note: You need the Darkblock Android TV app to view a
                      Darkblock upgrade.
                    </p>
                  </div>
                </div>
                <div className="upgrade-grid">
                  <div>
                    <div className="upgrade-level">
                      <p className="upgrade-number">LEVEL 1</p>
                    </div>
                    <div className="upgrade-title">
                      <span className="upgrade-type">SUPERCHARGED</span>
                      <ul className="upgrade-detail-list">
                        <li>Massive filesize support</li>
                        <li>Stored forever on Arweave</li>
                      </ul>
                    </div>
                    {/* <div className="file-input-one">
                      <p className="file-input-text"><span className="file-span">Upload file </span>or drop here</p>
                      <p className="no-selected">No file selected </p>
                    </div> */}
                    <Preview
                      levelOneFileSelectionHandler={
                        levelOneFileSelectionHandler
                      }
                    />
                    {/* <PreviewTwo
                      fileSelectionHandler={levelTwoFileSelectionHandler}
                    /> */}
                    <div className="custom-file mb-4">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="levelOneFile"
                        onChange={onLevelOneFileChange}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="levelOneFile"
                      >
                        {level === "one" ? fileName : null}
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="upgrade-level">
                      <p className="upgrade-number">LEVEL 2</p>
                    </div>
                    <div className="upgrade-title">
                      <span className="upgrade-type">
                        Protected by Darkblock
                      </span>
                      <ul className="upgrade-detail-list">
                        <li>Software encryption</li>
                        <li>All features of level 1</li>
                      </ul>
                    </div>
                    <PreviewTwo
                      levelTwoFileSelectionHandler={
                        levelTwoFileSelectionHandler
                      }
                    />
                    {/* <div className="file-input-two">
                      <p className="file-input-text"><span className="file-span">Upload file </span>or drop here</p>
                      <p className="no-selected">No file selected </p>
                    </div> */}
                    <div className="custom-file mb-4">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="levelTwoFile"
                        onChange={onLevelTwoFileChange}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="levelTwoFile"
                      >
                        {level === "two" ? fileName : null}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="about-darkblock">About the Darkblock</p>
                  <textarea
                    className="textarea"
                    placeholder="Add a description of the Darkblock or leave empty..."
                    value={darkblockDescription}
                    onChange={onDarkblockDescriptionChange}
                  ></textarea>
                </div>
                <div className="button-container">
                  {isDarkblocked || isUploading ? null : ( //hide the button
                    <input
                      type="submit"
                      value="Create Darkblock"
                      className="create-darkblock-button"
                    />
                  )}

                  {fileUploadProgress > 0 ? (
                    <label>{fileUploadProgress}</label>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
