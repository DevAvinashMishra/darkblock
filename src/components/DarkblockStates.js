import React, { useEffect, useState } from "react";
import "../styles/preview.scss";
import "../styles/detail.scss";
import * as DateUtil from "../util/date";
import FileChooserSilver from "./FileChooserSilver";
import FileChooserGold from "./FileChooserGold";
import goldblock from "../images/goldblock.png";
import silverblock from "../images/silverblock.png";
import loading from "../images/loading.mp4";
import $ from "jquery";
import * as TestModeUtil from "../util/test-mode-util";
import cube from "../images/Cube.svg";

export default function DarkblockStates({
  levelOneFileSelectionHandler,
  levelTwoFileSelectionHandler,
  nft,
  createDarkblockHandle,
  isUploading,
  isUploadCompleted,
  fileName,
  selectedLevel,
  darkblockDescription,
  onDarkblockDescriptionChange,
  isError,
  resetDarkblockCreation,
  darkblockCreationProgressMsg,
  // darkblockCreationProgress,
}) {
  var levelOneFileSelectionHandlerMiddle = levelOneFileSelectionHandler;
  var levelTwoFileSelectionHandlerMiddle = levelTwoFileSelectionHandler;

  var createDarkblockClickHandle = createDarkblockHandle;

  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    //Test-Mode Temporary Setup
    const listener = (event) => {
      if (event.code === "F8") {
        event.preventDefault();
        handleTestModeToggle();
      }
    };
    document.addEventListener("keydown", listener);

    $(document).on("change", ".test-label", function () {
      if ($(".test-label").is(":checked")) {
        $(".create-darkblock").css(
          "box-shadow",
          "0px 1px 39px 6px rgba(79, 238, 200, 0.58)"
        );
        $(".create-title").css("color", "#24FF89");
        $(".file-select-btn").css("color", "#24FF89");
        $(".create-darkblock-button").css(
          "background",
          "linear-gradient(180deg, #24FF89 0%, #24FFD8 100%)"
        );
        $(".selected-bordertwo").css("border", "2px solid #24ff89");
      } else {
        $(".create-darkblock").css("box-shadow", "none");
        $(".create-title").css("color", "#ffffff");
        $(".file-select-btn").css("color", "#FFC324");
        $(".selected-bordertwo").css("border", "2px solid #ffc324");
        $(".create-darkblock-button").css("background", "#ffc324");
      }
    });
    $(".label").click(function () {
      var checked = $("input", this).is(":checked");
      $("span", this).text(
        checked ? "Create Darkblock" : "Create A Test Darkblock"
      );
    });

    // var cb = document.getElementById("switch");
    // var label = document.getElementById("change-text");
    // cb.addEventListener(
    //   "click",
    //   function (evt) {
    //     if (cb.checked) {
    //       label.innerHTML = "Create a Test Darkblock";
    //     } else {
    //       label.innerHTML = "Create Darkblock";
    //     }
    //   },
    //   false
    // );
    //!TODO Handle the id validation, then init requests

    setIsTestMode(TestModeUtil.setTestModeDefault());

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  const handleTestModeToggle = async () => {
    // setIsTestMode(!isTestMode);
    var testModeSession = sessionStorage.getItem("test-mode");

    if (testModeSession) {
      if (testModeSession === "true") {
        sessionStorage.setItem("test-mode", false);
        setIsTestMode(false);
        console.log(`Test-Mode turned off`);
      } else {
        sessionStorage.setItem("test-mode", true);
        setIsTestMode(true);
        console.log(`Test-Mode turned on`);
      }
    } else {
      sessionStorage.setItem("test-mode", true);
    }
  };

  // const address = useContext(UserContext);

  // ui states for the block
  // darkblocked true - already darkblocked (state 0)
  // darkblocked false, own false - ask the owner      (state 1)
  // darkblocked false, own true - create darkblock    (state 2)

  // no file selected
  $(document).ready(function () {
    $("input:file").change(function () {
      if ($(this).val()) {
        $("input:submit").attr("disabled", false);
      }
    });
  });

  return (
    <div>
      {/* state 0 */}
      {/* there is a darkblock */}
      {nft.is_darkblocked === true ? (
        <div>
          {nft.encryptionLevel === "one" ? (
            <div>
              <div className="create-darkblock darkblock-found">
                <div className="dbfound-level">
                  {/* <label className="dbfound-label">Level 2</label> */}
                </div>

                <h1 className="dbfound-title">Protected by Darkblock</h1>
                <div className="dbfound">
                  <div className="dbfound-content">
                    <img
                      className="gold-block"
                      src={goldblock}
                      alt="gold block"
                    />
                  </div>
                  <div className="dbfound-content">
                    <h5 className="dbfound-subtitle">Description</h5>
                    <p className="dbfound-text">
                      {nft.darkblock_description
                        ? nft.darkblock_description
                        : "No Description Found"}
                    </p>

                    <h5 className="dbfound-subtitle">Date Created</h5>
                    <p className="dbfound-text">
                      {DateUtil.getFormattedDateFromMillis(
                        nft.darkblock_date_created
                      )}
                    </p>
                    <p className="dbfound-text">
                      {" "}
                      To view this Darkblock you need the Darkblock Android TV
                      app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="create-darkblock darkblock-found">
                <div className="dbfound-level">
                  {/* <label className="dbfound-label">Level 2</label> */}
                </div>

                <h1 className="dbfound-title">Protected by Darkblock</h1>
                <div className="dbfound">
                  <div className="dbfound-content">
                    <img
                      className="gold-block"
                      src={goldblock}
                      alt="gold block"
                    />
                  </div>
                  <div className="dbfound-content">
                    <h5 className="dbfound-subtitle">Description</h5>
                    <p className="dbfound-text">
                      {nft.darkblock_description
                        ? nft.darkblock_description
                        : "No Description Found"}
                    </p>

                    <h5 className="dbfound-subtitle">Date Created</h5>
                    <p className="dbfound-text">
                      {DateUtil.getFormattedDateFromMillis(
                        nft.darkblock_date_created
                      )}
                    </p>
                    <p className="dbfound-text">
                      {" "}
                      To view this Darkblock you need the Darkblock Android TV
                      app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {/* state 1 */}
      {/* no darkblock found */}
      {nft.is_darkblocked === false && nft.is_owned_by_user === false ? (
        <div>
          <div className="create-darkblock no-darkblock">
            <h1>No Darkblock Found</h1>
            <p>
              No Darkblock has been detected for this NFT. Only the creator of
              the NFT can create Darkblocks. Please contact the creator of the
              NFT to request a Darkblock for this NFT.
            </p>
          </div>
        </div>
      ) : null}
      {/* state 2 */}
      {/* darkblock-creation in progress */}
      {nft.is_darkblocked === false &&
      nft.is_owned_by_user === true &&
      isUploading === true &&
      isUploadCompleted === false &&
      isError === false ? (
        <div>
          <div>
            <div className="create-darkblock">
              <div className="loading-content">
                <h1 className="loading-title">
                  Your Darkblock is being created...
                </h1>
                <div className="loading-container">
                  <div className="loading-animation">
                    <video autoPlay playsInline loop>
                      <source src={loading} type="video/mp4" />
                    </video>
                  </div>

                  {/* test progress */}

                  <div id="progressBar">
                    <div id="progressBarFull"></div>
                  </div>

                  <p className="progress-text">
                    {darkblockCreationProgressMsg}
                  </p>

                  <p className="loading-text-container">
                    Please DO NOT close this page until this process is
                    finished. Depending on the file size and your internet
                    connection the upload time may take up to a few minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {nft.is_darkblocked === false &&
      nft.is_owned_by_user === true &&
      isUploading === false &&
      isUploadCompleted === true &&
      isError === false ? (
        <div>
          {selectedLevel === "one" ? (
            <div>
              <div>
                <div className="create-darkblock">
                  <div className="upload-success">
                    <img
                      className="success-image"
                      src={silverblock}
                      alt="block"
                    />
                    <div className="loading-content">
                      <h1>
                        Your{" "}
                        <span className="success-yellow">Supercharged</span>{" "}
                        Darkblock has been created
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <div className="create-darkblock">
                  <div className="upload-success">
                    <img
                      className="success-image"
                      src={goldblock}
                      alt="block"
                    />
                    <div className="loading-content">
                      <h1>
                        Your <span className="success-yellow">Protected</span>{" "}
                        Darkblock has been created
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
      {/* state 3 */}
      {/* create darkblock */}
      {nft.is_darkblocked === false &&
      nft.is_owned_by_user === true &&
      isUploading === false &&
      isUploadCompleted === false &&
      isError === false ? (
        <div>
          <div className="create-darkblock">
            <form onSubmit={createDarkblockClickHandle}>
              <div>
                <div className="create-darkblock-container">
                  {/* <h1 className="create-title">Create Darkblock</h1> */}
                  <label
                    style={{ pointerEvents: "none" }}
                    id="change-text"
                    className="create-title"
                    htmlFor="switch"
                  >
                    <span>Create Darkblock</span>
                  </label>
                  <ul className="db-list">
                    <li>
                      Darkblock encryption. You need the Darkblock Android TV
                      app to view a Darkblock
                    </li>
                    <li>Large file size support (350MB)</li>
                    <li>Stored forever on Arweave</li>
                  </ul>
                </div>
              </div>
              <FileChooserGold
                fileSelectionHandlerLevelTwo={
                  levelTwoFileSelectionHandlerMiddle
                }
                selectedLevel={selectedLevel}
              />
              {/* <div className="upgrade-grid">
                <div>
                  <div className="upgrade-level">
                    <p className="upgrade-number">LEVEL 1</p>
                  </div>
                  <div className="upgrade-title">
                    <span className="upgrade-type">Supercharged</span>
                    <ul className="upgrade-detail-list">
                      <li>Large filesize support (350MB)</li>
                      <li>Stored forever on Arweave</li>
                    </ul>
                  </div>

                  <FileChooserSilver
                    fileSelectionHandlerLevelOne={
                      levelOneFileSelectionHandlerMiddle
                    }
                    selectedLevel={selectedLevel}
                  />
                </div>
                <div>
                  <div className="upgrade-level">
                    <p className="upgrade-number">LEVEL 2</p>
                  </div>
                  <div className="upgrade-title">
                    <span className="upgrade-type">Protected by Darkblock</span>
                    <ul className="upgrade-detail-list">
                      <li>Software encryption</li>
                      <li>All features of level 1</li>
                    </ul>
                  </div>

                  <FileChooserGold
                    fileSelectionHandlerLevelTwo={
                      levelTwoFileSelectionHandlerMiddle
                    }
                    selectedLevel={selectedLevel}
                  />
                </div>
              </div> */}
              <div className="about-darkblock-main">
                <div className="firstBock">
                  <p className="about-darkblock">About the Darkblock</p>
                  <textarea
                    className="textarea"
                    placeholder="Add a description of the Darkblock (optional)"
                    value={darkblockDescription}
                    onChange={onDarkblockDescriptionChange}
                  ></textarea>
                </div>
                <div className="text-start secondBlock">
                  <div class="Creator-Settings">Creator Settings</div>
                  <div class="cretor-setting-details">
                    Test Darkblocks are only visible to the NFT creator. They
                    allow the creator to preview their creation on the Darkblock
                    TV app. New test blocks can be created, but each new one
                    overwites the previous one so only one is viewable at a
                    time.
                  </div>
                  <div className="button-container">
                    <span className="Vector" />
                    {isUploading ? null : (
                      <input
                        type="submit"
                        value="Create Darkblock"
                        className="create-darkblock-button"
                        id="darkblock-submit"
                        disabled
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="db-grid">
                {/* <div className="test-mode">
                  <p style={{ marginTop: "0" }} className="about-darkblock">
                    Creator Settings
                  </p>
                  <div className="checkbox-container">
                    <div className="testmode-label">
                      <input
                        className="test-label"
                        type="checkbox"
                        checked={isTestMode}
                        onChange={handleTestModeToggle}
                        id="switch"
                      />
                      <label
                        className="test-label"
                        id="text-change"
                        htmlFor="switch"
                      >
                        Toggle
                      </label>
                      <span style={{ marginLeft: "16px" }}>
                        Create Test Darkblock
                      </span>
                    </div>
                    <div>
                      <p className="testmode-text">
                        Test Darkblocks are only visible to the NFT creator.
                        They allow the creator to preview their creation on the
                        Darkblock TV app. New test blocks can be created, but
                        each new one overwites the previous one so only one is
                        viewable at a time.
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* state 4 */}
      {/* darkblock creation failed */}
      {nft.is_darkblocked === false &&
      nft.is_owned_by_user === true &&
      isUploading === false &&
      isUploadCompleted === false &&
      isError === true ? (
        <div className="create-darkblock">
          <div className="creation-error">
            <h1>
              Oops... <br></br>
              Something went wrong
            </h1>
            <p>
              An error occurred. <br></br>Please try again.
            </p>
            <button
              className="login-button error-button"
              onClick={resetDarkblockCreation}
            >
              Restart Darkblock Creation Process
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
