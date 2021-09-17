import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import search from "../images/searchlabel.svg";
import "../App.scss";
import closebutton from "../images/closebutton.svg";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import ReactGa from "react-ga";
import { useHistory } from "react-router-dom";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    padding: 40,
    outline: "none",
    border: "none",
    borderRadius: "4px",
  },
}));

export default function SimpleModal() {
  const classes = useStyles();
  let history = useHistory();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [isOpen, setIsOpen] = useState(false);
  const [contract, setContract] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setContract("");
    setToken("");
    setError("");
  };

  const handleValidation = () => {
    let formIsValid = true;

    if (!contract) {
      formIsValid = false;
      setError("Contract Address Cannot be empty");
    }

    if (!token) {
      formIsValid = false;
      setError("Token Cannot be empty");
    }

    if (!contract && !token) {
      formIsValid = false;
      setError("Contract Address and Token Cannot be empty");
    }

    return formIsValid;
  };

  const onSearchSubmit = () => {
    if (handleValidation()) {
      //redirect user to details page
      console.log(`Good to go`);
      ReactGa.event({
        category: "FIND_MY_NFT",
        action: "Search Pressed",
        label: "Searched for contract: " + contract + " | token: " + token,
      });
      // this.setState({ allGood: true });
      history.push(`/details/${contract}/${token}`);
      handleClose();
    } else {
      //form has errors
      console.log(`Form has errors`);
    }
  };

  const handleContractChange = (e) => {
    let contract = e.target.value;
    setContract(contract);
  };
  const handleTokenChange = (e) => {
    let token = e.target.value;
    setToken(token);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <img
        className="close-button"
        src={closebutton}
        alt="close"
        onClick={handleClose}
      />
      <div>
        <div>
          <div className="findmy-title">Find My NFT</div>
          <div
            style={{
              textAlign: "center",
              color: "#565555",
              marginBottom: "24px",
            }}
          >
            Enter NFT contract address and token ID to find a specific NFT
          </div>
        </div>
        <div className="search-bar">
          <p
            style={{
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "700",
              marginTop: "0px",
            }}
          >
            Contract Address
          </p>
          <input
            className="input-search"
            type="text"
            placeholder="Enter Contract Address"
            onChange={handleContractChange}
            value={contract}
          />
        </div>
        <div style={{ marginBottom: "24px" }} className="search-bar">
          <p
            style={{
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "700",
              marginTop: "16px",
            }}
          >
            Token ID
          </p>
          <input
            className="input-search"
            type="text"
            placeholder="Enter Token Id"
            onChange={handleTokenChange}
            value={token}
          />
        </div>
        <label className="error-label">{error}</label>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "40px",
            marginRight: "40px",
          }}
        >
          <Button
            className="cancel-button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            style={{ marginLeft: "16px", cursor: "pointer" }}
            onClick={onSearchSubmit}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <img
        className="search-button"
        onClick={handleOpen}
        src={search}
        alt="search button"
      />
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
