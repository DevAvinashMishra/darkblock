import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../util/UserContext";
import * as Formatter from "../util/formatter";
import * as NodeApi from "../api/node-api";
import { useParams } from "react-router-dom";
import "../styles/detail.scss";
import * as OpenseaApi from "../api/opensea-api";
import * as HashUtil from "../util/hash-util";
import * as MetamaskUtil from "../util/metamask-util";
import Darkblock from "./DarkblockStates";
import * as DetailsMeMapper from "../util/details-mapper";
import * as FileSupportHandler from "../util/file-support-handler";
import * as TestModeUtil from "../util/test-mode-util";
import ReactGa from "react-ga";
import Footer from "../components/footer";

export default function DetailsView() {
  // const [id, setId] = useState("0xcdeff56d50f30c7ad3d0056c13e16d8a6df6f4f5:10");
  const address = useContext(UserContext);
  const [selectedLevel, setSelectedLevel] = useState("0"); //darkblock level
  const [nft, setNft] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUploadProgress, setFileUploadProgress] = useState("");
  const { contract, token } = useParams();
  const [darkblockDescription, setDarkblockDescription] = useState("");
  const [noNftFound, setNoNftFound] = useState(false);

  // const accountAddress = "0xc02bdb850930e943f6a6446f2cc9c4f2347c03e7";

  useEffect(() => {
    //!TODO Handle the id validation, then init requests

    const fetchDataForNft = async () => {
      try {
        const nft = await OpenseaApi.getSingleNft(contract, token).then(
          (res) => res.assets[0]
        );
        if (nft) {
          const mappedNft = await DetailsMeMapper.getMappedNft(nft);
          setNft(mappedNft);
          setIsLoaded(true); //load it in ui
        } else {
          //no Nft Found
          console.log(`Nft Not Found`);
          setNoNftFound(true);
          setIsLoaded(true);
          ReactGa.event({
            category: "DETAILS_PAGE",
            action: "NFT Not Found",
            label: "Searched for contract: " + contract + " | token: " + token,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };

    try {
      fetchDataForNft();
    } catch (e) {
      console.log(e);
    }
  }, [contract, token]);

  const onCreateDarkblockClick = async (e) => {
    e.preventDefault();

    ReactGa.event({
      category: "DARKBLOCK_CREATION",
      action: "Pressed Create Darkblock " + testModeAppendWithEvent(),
      label: "Attempt to create level " + selectedLevel + " darkblock",
    });

    //check the owner of the nft
    if (nft.is_owned_by_user === true) {
      console.log(`Creating Darkblock`);
      initDarkblockCreation();
    } else {
      alert("Please select an nft that you own");
      console.log(`You are not the owner/creator of nft`);
    }
  };

  const testModeAppendWithEvent = () => {
    if (TestModeUtil.isTestModeOn()) {
      return "In Test-Mode";
    } else {
      return "";
    }
  };

  const initDarkblockCreation = async () => {
    setIsUploading(true);

    console.log(`Init Hashing the file`);
    const fileHash = await HashUtil.hashInChunks(file);
    //now sign this hash with eth wallet and attach it to tags

    const signedHash = await MetamaskUtil.signTypedData(fileHash);

    const data = new FormData(); //we put the file and tags inside formData and send it across
    data.append("file", file);
    data.append("contract", nft.contract);
    data.append("token", nft.token);
    data.append("wallet", address); // replace with wallet
    data.append("level", selectedLevel);
    data.append("token_schema", nft.blockchain);
    data.append("darkblock_description", darkblockDescription);
    data.append("darkblock_hash", signedHash);
    if (TestModeUtil.isTestModeOn()) {
      data.append("transaction_type", "test-mode");
    } else {
      console.log(`Test mode off `);

      data.append("transaction_type", "normal-mode");
    }

    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(
          `Uploading File : ${Formatter.formatBytes(
            loaded
          )} of ${Formatter.formatBytes(total)} | ${percent}%`
        );

        if (percent < 100) {
          var progress = `${Formatter.formatBytes(
            loaded
          )} of ${Formatter.formatBytes(total)} | ${percent}%`;
          setFileUploadProgress(progress);
        }
      },
    };

    NodeApi.postTransaction(data, options)
      .then((response) => {
        //handle the response
        //TODO handle the isCompleted with the status code

        if (response.status === 200) {
          setIsUploading(false);
          setIsUploadCompleted(true);
          console.log(`Message : ${data.message}`);
          ReactGa.event({
            category: "DARKBLOCK_CREATION",
            action:
              "Level " +
              selectedLevel +
              " Darkblock Creation Success " +
              testModeAppendWithEvent(),
            label: "Attempt to create darkblock was successful",
          });
        }
      })
      .catch((err) => {
        //post transaction error
        console.log(err);
        setIsUploading(false);
        setIsError(true);
        ReactGa.event({
          category: "DARKBLOCK_CREATION",
          action:
            "Level " +
            selectedLevel +
            " Darkblock Creation Failed " +
            testModeAppendWithEvent() +
            " : " +
            err,
          label: "Attempt to create darkblock failed",
        });
      });
  };

  const onDarkblockDescriptionChange = (e) => {
    //additional info is being added for darkblock creation
    setDarkblockDescription(e.target.value);
  };

  const levelOneFileSelectionHandler = async (e) => {
    // document.getElementById("file-upload-form").style.border ="2px solid #FFC324";
    //level one file is picked
    //TODO handle when user cancels the process

    const isFileSupported = FileSupportHandler.isFileFormatSupported(e);

    if (isFileSupported === true) {
      console.log(`Level One Selected`);
      setSelectedLevel("one");
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const levelTwoFileSelectionHandler = async (e) => {
    //level two file is picked
    //TODO handle when user cancels the process
    const isFileSupported = FileSupportHandler.isFileFormatSupported(e);

    if (isFileSupported === true) {
      console.log(`Level Two Selected`);
      setSelectedLevel("two");
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const resetDarkblockCreation = async (e) => {
    setIsError(false);
  };

  const redirectOwnerToOpensea = () => {
    window.open(`https://opensea.io/${nft.owner}`);
  };

  const redirectCreatorToOpensea = () => {
    window.open(`https://opensea.io/${nft.creator}`);
  };

  const redirectAddress = () => {
    window.open(`https://opensea.io/assets/${nft.contract}/${nft.token}`);
  };

  let kk =
    nft.creator?.length >= 10
      ? nft.creator?.substring(nft.creator?.length - 3)
      : nft.creator;
  let ll =
    nft.contract?.length >= 10
      ? nft.contract?.substring(nft.contract?.length - 3)
      : nft.contract;
  let tt =
    nft.token?.length >= 10
      ? nft.token.substring(nft.token?.length - 3)
      : nft.token;
  return (
    <>
      <div className="detail-background">
        {isLoaded === true && noNftFound === false ? (
          <div className="detail-page-container">
            <div className="detail-preview-image ">
              <img
                alt="nft-preview"
                className="nft-detail-preview"
                src={nft.image}
              />
            </div>
            <div className="detail-name-container">
              <span className="nft-detail-name">{nft.name}</span>
            </div>
            <div>
              <p className="nft-deatil-owner">
                <span className="wonedBy"> Owned by</span>
                <span
                  className="owner-link"
                  onClick={redirectOwnerToOpensea}
                  rel="noreferrer"
                >
                  <span className="owner-color">{nft.owner}</span>
                </span>
              </p>
            </div>
            <div className="detail-container">
              {" "}
              <div>
                <div className="detail-about-header">
                  <div className="detail-about-nft">About the NFT</div>
                </div>
                <div className="about-the-nft">
                  <div className="flex-grid-thirds">
                    <div className="col">
                      <span className="creater-title-details"> Creator</span>{" "}
                      <span
                        onClick={redirectCreatorToOpensea}
                        rel="noreferrer"
                        className="creator-link tooltip"
                      >
                        <span className="tooltiptext">{nft.creator}</span>
                        {/* <span className="about-span ch-limit">{nft.creator}</span>
                    </span> */}
                        <span className="about-span ch-limit">
                          {" "}
                          {nft.creator?.lenght != 10
                            ? nft.creator.substring(0, 6) + "....." + kk
                            : nft.creator}{" "}
                        </span>
                      </span>
                    </div>
                    <div className="col">
                      <span className="create-title-details">Date Created</span>
                      <span className="about-span date-created">
                        {nft.nft_date_created}
                      </span>
                    </div>
                    <div className="col">
                      <span className="create-title-details">Edition</span>{" "}
                      <span className="about-span">{nft.edition}</span>
                    </div>
                  </div>
                  <div className="artist-statement">
                    <span className="create-title-details">
                      Artist Statement
                    </span>
                    <p className="about-description">{nft.nft_description}</p>
                  </div>
                </div>
                <div className="chain-info">
                  <h1 className="detail-about-nft">Chain Info</h1>
                  <div className="chain-content">
                    <div className="chain-flex">
                      <p className="contract-address-title">Contract Address</p>
                      <div className="tooltip">
                        <span
                          className="owner-link contract-link"
                          onClick={redirectAddress}
                          rel="noreferrer"
                        >
                          {/* <span className="tooltiptext tooltip-contract">
                          {nft.contract}
                        </span> */}
                          <div className="chain-span contract-address">
                            {/* <span>{nft.contract}</span> */}
                            <span>
                              {nft.contract?.lenght != 10
                                ? nft.contract.substring(0, 6) + "....." + ll
                                : nft.contract}
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="chain-flex">
                      <p className="contract-address-title">Token Id</p>
                      {/* <span className="chain-span">{nft.token}</span> */}
                      <span className="chain-span">
                        {nft.token?.lenght != 10
                          ? nft.token.substring(0, 6) + "....." + tt
                          : nft.token}
                      </span>
                    </div>
                    <div className="chain-flex blockchain">
                      <p className="contract-address-title">BlockChain</p>

                      <span className="chain-span">{nft.blockchain}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Darkblock
                levelOneFileSelectionHandler={levelOneFileSelectionHandler}
                levelTwoFileSelectionHandler={levelTwoFileSelectionHandler}
                nft={nft}
                createDarkblockHandle={onCreateDarkblockClick}
                isUploading={isUploading}
                isUploadCompleted={isUploadCompleted}
                fileName={fileName}
                selectedLevel={selectedLevel}
                darkblockDescription={darkblockDescription}
                onDarkblockDescriptionChange={onDarkblockDescriptionChange}
                isError={isError}
                resetDarkblockCreation={resetDarkblockCreation}
              />
            </div>
          </div>
        ) : null}
        {noNftFound === true ? (
          <div className="no-nft">
            <label>
              <h1 className="no-nft-title">NFT not found</h1>
              <span style={{ color: "#565555" }}>
                An NFT with the contract address
              </span>
              <br></br>
              <span
                style={{ fontWeight: "700", color: "#565555" }}
              >{`${contract}`}</span>
              <br></br>
              <br></br>
              <span style={{ color: "#565555" }}>
                and Token ID
              </span> <br></br>{" "}
              <span
                style={{ color: "#565555", fontWeight: "700" }}
              >{`${token}`}</span>
              <br></br>
              <br></br>
              <span style={{ color: "#565555" }}>
                Please see the help page if you are having problems!<br></br>
                <span>
                  <a
                    style={{
                      color: "#E8AB0C",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                    href="/help"
                  >
                    Get Help
                  </a>
                </span>
              </span>
            </label>
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  );
}
