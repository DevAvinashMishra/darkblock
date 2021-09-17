import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import { UserContext } from "../util/UserContext";
import * as Filter from "../util/filter";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import * as CreatedByMeMapper from "../util/createdbyme-mapper";
import NFTItem from "./NftItem-copy";
import Footer from "../components/footer";
import toparrow from "../images/toparrow.svg";
import Card from "react-bootstrap/Card";
import grey from "../images/grey.svg";
import ReactGa from "react-ga";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
export default function CreatedByMe() {
  const [nfts, setNfts] = useState([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [noNftsFound, setNoNftsFound] = useState(false);
  const address = useContext(UserContext);
  const { account } = useParams();

  const timeOut = async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`Completed in ${t}`);
      }, t);
    });
  };

  useEffect(() => {
    try {
      fetchData(currentPage);
    } catch (e) {
      console.log(e);
    }

    //to disable warning for nfts, patch later

    // eslint-disable-next-line
  }, [account, address, currentPage]);

  const fetchData = async (pageNumber) => {
    //add blanks for loading
    addBlanks(nfts);

    setIsLoaded(false);

    var accountAddress = address;
    if (account) {
      accountAddress = account;
    }

    await timeOut(0);
    var data = await OpenseaApi.getNftsCreatedByUserForPage(
      pageNumber,
      accountAddress
    );

    if (data !== undefined && data.length > 0) {
      if (data.length < 50) {
        setHasMore(false);
      }
      //do the filtering here
      const filteredData = Filter.filterNftsForCreatedByMe(data); //we need to filter the entire updated list
      const mappedNfts = await CreatedByMeMapper.getMappedList(filteredData);

      const updatedNfts = [...nfts, ...mappedNfts];

      const filteredFullList = Filter.removeDupesFromMapped(updatedNfts);

      // console.log(
      //   `Page : ${currentPage} | Reuqest Size : ${
      //     data.length
      //   } | Request-Filtered-Nfts : ${filteredData.length} | Nfts-In-List : ${
      //     nfts.length
      //   } | filtered : ${filteredFullList.length} : | NoOfBlanks : ${
      //     (nfts.length % 4) + 8
      //   } | noOfBlanksInList : ${noOfBlanksInlist(nfts)}`
      // );

      // console.log(`| withoutBlanks : ${withoutBlanks.length}`);

      if (
        filteredFullList.length - noOfBlanksInlist(filteredFullList) ===
          nfts.length - noOfBlanksInlist(nfts) &&
        data.length === 50
      ) {
        //No Nfts added to the main list, request another page
        setCurrentPage(currentPage + 1);
      } else {
        // const withoutBlanks = removeBlanks(filteredFullList);
        const withoutBlanks = removeBlanks(filteredFullList);
        setNfts(withoutBlanks);
        setIsLoaded(true);
        if (currentPage === 1 && withoutBlanks.length === 0) {
          setNoNftsFound(true);
        }
      }
    } else {
      //No data returned in the request
      if (currentPage === 1) {
        setNfts([]); //remove the blanks
        setHasMore(false);
        setNoNftsFound(true);
        setIsLoaded(true);
        ReactGa.event({
          category: "CREATED_BY_ME",
          action: "No Nfts Found For Address " + accountAddress,
          label: "Either account doesnt have any nfts or opensea error",
        });
      }
    }
  };

  const observer = useRef();
  const lastNftRef = useCallback(
    (node) => {
      if (!isLoaded) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoaded, hasMore]
  );

  const addBlanks = (nfts) => {
    var noOfBlanks = (nfts.length % 4) + 8;
    for (let i = 0; i < noOfBlanks; i++) {
      nfts.push(undefined);
    }
    setNfts(nfts);
  };

  const removeBlanks = (nfts) => {
    var noBlanks = nfts.filter(function (el) {
      return el != null;
    });
    return noBlanks;
  };

  const noOfBlanksInlist = (nfts) => {
    var noBlanks = nfts.filter(function (el) {
      return el != null;
    });
    return nfts.length - noBlanks.length;
  };

  // Pagination setup
  // const indexOfLastNft = currentPage * postsPerPage;
  // const indexOfFirstNft = indexOfLastNft - postsPerPage;
  // const currentNftsMeta = nfts.slice(indexOfFirstNft, indexOfLastNft);
  // Change page
  function scrollTop() {
    window.scrollTo(0, 0);
  }
  return (
    <React.Fragment>
      <CssBaseline />
      {/* <Container fixed> */}
      {/* <button>Go to detailsView</button> */}{" "}
      <div className="pagetitle">Created By Me</div>
      <ul
        className="list-group"
        // container
        // spacing={1}
        // style={{ marginTop: 80, justifyContent: "center" }}
        // direction="row"
        // justify="flex-start"
        // alignItems="flex-start"
      >
        {nfts.map((nft, index) => {
          if (nft != null) {
            if (nfts.length === index + 1) {
              return (
                <NFTItem
                  key={index}
                  nft={nfts[nfts.indexOf(nft)]}
                  innerRef={lastNftRef}
                />
              );
            } else {
              return <NFTItem key={index} nft={nfts[nfts.indexOf(nft)]} />;
            }
          } else {
            return (
              <div key={index}>
                <Card>
                  <div className="image-container">
                    <Card.Img
                      className="preview-image"
                      alt="darkblock image"
                      variant="top"
                      src={grey}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title
                      data-testid="nft-title"
                      style={{ width: "100%", backgroundColor: "pink" }}
                      className="nft-title"
                    ></Card.Title>
                    <Card.Text
                      style={{ width: "100%", backgroundColor: "grey" }}
                      className="meta-data card-limit"
                    ></Card.Text>
                    <Card.Text
                      style={{ width: "100%", backgroundColor: "grey" }}
                      className="meta-data card-limit"
                    ></Card.Text>
                  </Card.Body>
                </Card>
              </div>
            );
          }
        })}
        <a onClick={scrollTop} id="scroll" className="to-top" href="#">
          <img src={toparrow} alt="to top" />
        </a>
      </ul>
      {/* {isLoaded === false && currentPage === 1 ? (
        <div className="list-group">
          <Card>
            <div className="image-container">
              <Card.Img
                className="preview-image"
                alt="darkblock image"
                variant="top"
                src={grey}
              />
            </div>
            <Card.Body>
              <Card.Title
                data-testid="nft-title"
                style={{ width: "100%", backgroundColor: "pink" }}
                className="nft-title"
              ></Card.Title>
              <Card.Text className="meta-data card-limit"></Card.Text>
              <Card.Text className="meta-data card-limit"></Card.Text>
            </Card.Body>
          </Card>
        </div>
      ) : null} */}
      {isLoaded === true && noNftsFound === true ? (
        <div className="none-found">
          <h1>We couldn't find any NFTs in your wallet!</h1>
          <p className="none-found-p">
            Start by creating an NFT on any Ethereum based NFT minting site and
            then come back here to create a Darkblock for that NFT. The NFT must
            be minted on-chain, if it is done gasless/lazy (on any other site
            but Opensea) then it may not appear.
          </p>
          <p className="none-found-p">
            Questions or problems? Please come chat with us on our{" "}
            <a
              rel="noreferrer"
              href="https://chat.darkblock.io"
              target="_blank"
            >
              Discord
            </a>
            !
          </p>
        </div>
      ) : null}
      {/* </Container> */}
      <Footer />
    </React.Fragment>
  );
}
