import React from "react";
import "../styles/detail.scss";
import { useEffect } from "react";
import "../styles/preview.scss";
import goldblock from "../images/goldblock.png";
import $ from "jquery";

export default function FileChooser({
  fileSelectionHandlerLevelTwo,
  selectedLevel,
}) {
  var levelTwoFileSelectionHandler = fileSelectionHandlerLevelTwo;

  useEffect(() => {
    $(document).ready(function () {
      $('input[type="file"]').change(function (event) {
        var _size = this.files[0].size;
        var fSExt = new Array("Bytes", "KB", "MB", "GB"),
          i = 0;
        while (_size > 900) {
          _size /= 1024;
          i++;
        }
        var exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
        document.getElementById("size").innerHTML = exactSize;
      });
    });

    function ekUploadtwo() {
      function Init() {
        var fileSelect = document.getElementById("file-uploadtwo"),
          fileDrag = document.getElementById("file-dragtwo");

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
        var fileDrag = document.getElementById("file-dragtwo");

        e.stopPropagation();
        e.preventDefault();

        fileDrag.className =
          e.type === "dragover" ? "hover" : "modal-body file-uploadtwo";
      }

      function fileSelectHandler(e) {
        // Fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Cancel event and hover styling
        fileDragHover(e);

        levelTwoFileSelectionHandler(e); //send the files back to details

        // Process all File objects
        for (var i = 0, f; (f = files[i]); i++) {
          parseFile(f);
        }
      }

      // Output
      function output(msg) {
        // Response
        var m = document.getElementById("messagestwo");
        m.innerHTML = msg;
      }

      function parseFile(file) {
        console.log(file.name);
        output("<span>" + encodeURI(file.name) + "</span>");

        // var fileType = file.type;
        // console.log(fileType);
        var imageName = file.name;

        var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
        if (isGood) {
          document.getElementById("starttwo").classList.add("hidden");
          document.getElementById("responsetwo").classList.remove("hidden");
          document.getElementById("notimagetwo").classList.add("hidden");
          // Thumbnail Preview
          document.getElementById("file-imagetwo").classList.remove("hidden");
          document.getElementById("file-imagetwo").src =
            URL.createObjectURL(file);
        } else {
          document.getElementById("file-imagetwo").classList.add("hidden");
          document.getElementById("notimagetwo").classList.remove("hidden");
          document.getElementById("starttwo").classList.remove("hidden");
          document.getElementById("responsetwo").classList.add("hidden");
          // document.getElementById("file-upload-form").reset();
        }
      }

      // Check for the various File API support.
      if (window.File && window.FileList && window.FileReader) {
        Init();
      } else {
        document.getElementById("file-dragtwo").style.display = "none";
      }
    }
    ekUploadtwo();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <p className="upload-title">File Upload</p>
      <div className="upload-grid">
        <div>
          <div className="file-formats">
            <p style={{ marginTop: 0 }}>Suppported File Formats:</p>
            <p>jpg, png, gif, mov, mp4, bmp</p>
            <p>Max file size 350MB</p>
          </div>

          <label htmlFor="file-uploadtwo" id="file-dragtwo">
            <span id="file-upload-btn" className="file-select-btn">
              Select a file
            </span>
          </label>
          <div
            style={{ display: "flex", alignItems: "center" }}
            id="responsetwo"
            className="hidden"
          >
            <div id="messagestwo">
              <span className="No-file-selected">No File Selected</span>
            </div>
            <span id="size" />
          </div>
        </div>
        <div id="file-upload-formtwo" className="uploadertwo uploader-bgtwo">
          {selectedLevel === "two" ? (
            // <div className="selected-bordertwo"></div> //old code
            <div className="uploadertwo"></div>
          ) : null}
          <input
            id="file-uploadtwo" //maybe not change this one
            type="file"
            name="fileUpload"
            accept=".mp4, .png, .jpeg, .gif, .jpg"
            onClick={(event) => {
              event.target.value = null;
            }}
          />
          <img className="goldblock" src={goldblock} alt="silverblock" />
          <span className="preview-text">
            <label className="preview-lable"> Preview</label>
          </span>
          <label htmlFor="file-uploadtwo" id="file-dragtwo">
            {/* <div className="select-file">
              <span className="yellow-text">Upload file</span> or drop here
            </div> */}
            <img id="file-imagetwo" src="#" alt="Preview" className="hidden" />
            <div id="starttwo">
              <div id="notimagetwo" className="hidden">
                Please select an image
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
