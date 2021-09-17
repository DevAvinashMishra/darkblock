import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import "../App.scss";
import search from "../images/searchlabel.svg";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import closebutton from "../images/closebutton.svg";
import ReactGa from "react-ga";

class SearchModal extends Component {
  state = {
    isOpen: false,
    contract: "",
    token: "",
    error: "",
    allGood: false,
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () =>
    this.setState({ isOpen: false, contract: "", token: "", error: "" });

  componentDidMount() {
    this.handleContractChange = this.handleContractChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  handleValidation() {
    let contract = this.state.contract;
    let token = this.state.token;
    let error = this.state.error;
    let formIsValid = true;

    if (!contract) {
      formIsValid = false;
      error = "Contract Address Cannot be empty";
    }

    if (!token) {
      formIsValid = false;
      error = "Token Cannot be empty";
    }

    if (!contract && !token) {
      formIsValid = false;
      error = "Contract Address and Token Cannot be empty";
    }

    this.setState({ error: error });
    return formIsValid;
  }

  onSearchSubmit() {
    if (this.handleValidation()) {
      //redirect user to details page
      console.log(`Good to go`);
      ReactGa.event({
        category: "FIND_MY_NFT",
        action: "Search Pressed",
        label:
          "Searched for contract: " +
          this.state.contract +
          " | token: " +
          this.state.token,
      });
      // this.setState({ allGood: true });
      this.props.history.push(
        `/details/${this.state.contract}/${this.state.token}`
      );
      this.closeModal();
    } else {
      //form has errors
      console.log(`Form has errors`);
    }
  }

  handleContractChange(e) {
    let contract = e.target.value;
    this.setState({ contract: contract });
  }
  handleTokenChange(e) {
    let token = e.target.value;
    this.setState({ token: token });
  }

  render() {
    return (
      <>
        <div>
          <img
            className="search-button"
            onClick={this.openModal}
            src={search}
            alt="search button"
          />
        </div>
        <Modal
          style={{ marginTop: "100px" }}
          show={this.state.isOpen}
          onHide={this.closeModal}
        >
          <Modal.Header>
            <img
              className="close-button"
              src={closebutton}
              alt="close"
              onClick={this.closeModal}
            />
            <Modal.Title></Modal.Title>
            <Modal.Title>
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
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                onChange={this.handleContractChange}
                value={this.state.contract}
              />
            </div>
          </Modal.Body>
          <Modal.Body>
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
                onChange={this.handleTokenChange}
                value={this.state.token}
              />
            </div>
          </Modal.Body>
          <Modal.Body>
            <label className="error-label">{this.state.error}</label>
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
                onClick={this.closeModal}
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: "16px", cursor: "pointer" }}
                onClick={this.onSearchSubmit}
              >
                Search
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default withRouter(SearchModal);
