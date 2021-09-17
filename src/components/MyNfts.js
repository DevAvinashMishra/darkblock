import React from "react";
import "../App.scss";
import * as OpenseaApi from "../api/opensea-api";
import NFTItem from "./NftItem";
import { UserContext } from "../util/UserContext";
import * as MyNftsMapper from "../util/my-nfts-mapper";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/footer";
import toparrow from "../images/toparrow.svg";
import Card from "react-bootstrap/Card";
import grey from "../images/grey.svg";
import ReactGa from "react-ga";

export default function MyNfts() {
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
  const [noNftsFound, setNoNftsFound] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [postsPerPage, setPostsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
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
    const fetchData = async (pageNumber) => {
      //add blanks for loading
      addBlanks(nfts);

      setIsLoaded(false);
      var accountAddress = address;
      if (account) {
        accountAddress = account;
      }

      await timeOut(0);
      var data = await OpenseaApi.getNftsForPage(pageNumber, accountAddress);

      if (data !== undefined && data.length > 0) {
        if (data.length < 50) {
          //stop sending requests if we get data less than 50
          setHasMore(false);
        }
        //map and add to the main list
        const mappedNfts = await MyNftsMapper.getMappedList(data);
        const updatedNfts = [...nfts, ...mappedNfts];
        const withoutBlanks = removeBlanks(updatedNfts);
        setNfts(withoutBlanks);
        setIsLoaded(true);
      } else {
        setNfts([]); //remove the blanks
        setHasMore(false);
        setNoNftsFound(true);
        setIsLoaded(true);
        ReactGa.event({
          category: "MY_NFTS",
          action: "No Nfts Found For Address " + accountAddress,
          label: "Either account doesnt have any nfts or opensea error",
        });
      }
    };

    try {
      fetchData(currentPage);

      // fetchAdditionalData();
    } catch (e) {
      console.log(e);
    }

    //to disable warning for nfts, patch later

    // eslint-disable-next-line
  }, [account, address, currentPage]);

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
    for (let i = 0; i < (nfts.length % 4) + 8; i++) {
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

  function scrollTop() {
    window.scrollTo(0, 0);
  }

  return (
    <React.Fragment>
      {/* <button>Go to detailsView</button> */}

      <ul className="list-group">
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
                    <Card.Text className="meta-data card-limit"></Card.Text>
                    <Card.Text className="meta-data card-limit"></Card.Text>
                  </Card.Body>
                </Card>
              </div>
            );
          }
        })}
      </ul>
      <a onClick={scrollTop} id="scroll" className="to-top" href="#">
        <img src={toparrow} alt="to top" />
      </a>

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

      <Footer />
    </React.Fragment>
  );
}
