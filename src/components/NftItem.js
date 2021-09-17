import React from "react";
import { Link } from "react-router-dom";
import "../App.scss";
import Card from "react-bootstrap/Card";
import noImage from "../resources/static/assets/uploads/no_image.png";
import * as DetailsMeMapper from "../util/details-mapper";
import * as OpenseaApi from "../api/opensea-api";
import { Grid } from "@material-ui/core";

const NFTITem = ({ nft, innerRef }) => {
  return (
    <Grid xs={12} md={6} lg={4}>
      <div className="nft-item" ref={innerRef}>
        <Link to={"/details/" + nft.contract + "/" + nft.token}>
          <Card>
            <div className="image-container">
              {/* {nft.animation_url ? (
              <video
                loop
                autoPlay
                muted
                alt="darkblockimage"
                poster={nft.image}
                className="preview-image"
                src={nft.animation_url}
              />
            ) : (
              <img
                loop
                autoPlay
                alt="darkblockimage"
                className="preview-image"
                variant="top"
                src={nft.image}
              />
            )} */}
              <Card.Img
                alt="darkblock image"
                className="preview-image"
                variant="top"
                src={nft.image ? nft.image : noImage}
              />
            </div>
            <Card.Body>
              <div>{nft.edition}</div>
              <Card.Title data-testid="nft-title" className="nft-title">
                {nft.name}
              </Card.Title>
              <Card.Text
                // style={{ color: "#9a9a9a", fontSize: "10px", lineHeight: "12px" }}
                className="meta-data1 card-limit"
              >
                <div className="created-by-title">Created By</div>
                <div className="meta-bold">{nft.creator}</div>
              </Card.Text>
              <Card.Text
                // style={{ color: "#9a9a9a", fontSize: "10px", lineHeight: "12px" }}
                className="meta-data1 card-limit"
              >
                <div className="created-by-title">Owned By</div>{" "}
                <div className="meta-bold">{nft.owner}</div>
              </Card.Text>
              <Card.Text className="meta-data db-box">
                <div style={{ textAlign: "left" }}>
                  <div className="Metadata">
                    <span class="Edition">Edition</span>
                    <span className="edition-span">1/1</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {nft.is_darkblocked ? (
                    <span className="isdarkblock">
                      Protected By <span className="db-bold">Darkblock</span>
                    </span>
                  ) : (
                    <span className="nodarkblock">No Darkblock Found</span>
                  )}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Link>
        <br></br>
      </div>
    </Grid>
  );
};

export default NFTITem;
