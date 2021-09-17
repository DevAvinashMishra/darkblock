import React from "react";
import "../styles/detail.scss";
import { useEffect } from "react";
import "../styles/preview.scss";
import silverblock from "../images/silverblock.png";

export default function FileChooser({
  fileSelectionHandlerLevelOne,
  selectedLevel,
}) {
  var levelOneFileSelectionHandler = fileSelectionHandlerLevelOne;

  useEffect(() => {
    // File Upload
    //
    function ekUpload() {
      function Init() {
        var fileSelect = document.getElementById("file-upload"),
          fileDrag = document.getElementById("file-drag");

        fileSelect.addEventListener("change", fileSelectHandler, false);

        // Is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {
          // File Drop
          fileDrag.addEventListener("dragover", fileDragHover, false);
          fileDrag.addEventListener("dragleave", fileDragHover, false);
          fileDrag.addEventListener("drop", fileSelectHandler, false);
        }
      }

      function fileDragHover(e) {
        var fileDrag = document.getElementById("file-drag");

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className =
          e.type === "dragover" ? "hover" : "modal-body file-upload";
      }

      function fileSelectHandler(e) {
        // Fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        fileDragHover(e);

        levelOneFileSelectionHandler(e); //send the files back to details

        // Process all File objects
        for (var i = 0, f; (f = files[i]); i++) {
          parseFile(f);
        }
      }

      // Output
      function output(msg) {
        // Response
        var m = document.getElementById("messages");
        m.innerHTML = msg;
      }

      function parseFile(file) {
        console.log(file.name);
        output("<strong>" + encodeURI(file.name) + "</strong>");

        // var fileType = file.type;
        // console.log(fileType);
        var imageName = file.name;

        var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
        if (isGood) {
          document.getElementById("start").classList.add("hidden");
          document.getElementById("response").classList.remove("hidden");
          document.getElementById("notimage").classList.add("hidden");
          // Thumbnail Preview
          document.getElementById("file-image").classList.remove("hidden");
          document.getElementById("file-image").src = URL.createObjectURL(file);
        } else {
          document.getElementById("file-image").classList.add("hidden");
          document.getElementById("notimage").classList.remove("hidden");
          document.getElementById("start").classList.remove("hidden");
          document.getElementById("response").classList.add("hidden");
          // document.getElementById("file-upload-form").reset();
        }
      }

      // Check for the various File API support.
      if (window.File && window.FileList && window.FileReader) {
        Init();
      } else {
        document.getElementById("file-drag").style.display = "none";
      }
    }

    ekUpload();

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div>
        <div id="file-upload-form" className="uploader uploader-bg">
          {selectedLevel === "one" ? (
            <div className="selected-border "></div>
          ) : null}
          <input
            id="file-upload"
            type="file"
            name="fileUpload"
            accept=".mp4, .png, .jpeg, .gif, .jpg"
            onClick={(event) => {
              event.target.value = null;
            }}
          />
          <img className="silverblock" src={silverblock} alt="silverblock" />
          <label htmlFor="file-upload" id="file-drag">
            <div className="select-file">
              <span className="yellow-text">Upload file</span> or drop here
            </div>
            <img id="file-image" src="#" alt="Preview" className="hidden" />
            <div id="start">
              <div id="notimage" className="hidden">
                Please select an image
              </div>
              {/* <span id="file-upload-btn" className="btn btn-primary">Select a file</span> */}
            </div>
            <div id="response" className="hidden">
              <div id="messages"></div>
              <progress className="progress" id="file-progress" value="0">
                <span>0</span>%
              </progress>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
