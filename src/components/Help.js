import React from "react";
import "../styles/help.scss";
import Footer from "../components/footer";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function Help() {
  return (
    <div className="help-container">
      <div>
        <h1 className="help-title">Help is here.</h1>
        <p>
          We are in beta! Please forgive us for our foibles!
          <br></br>
          <br></br>
          Your feedback will help us make the product better; please visit our
          Discord to give us feedback or ask questions.
        </p>
        <a
          href="http://chat.darkblock.io"
          target="_blank"
          className="help-link"
          rel="noreferrer"
        >
          Go to the Darkblock Discord
        </a>
      </div>
      <div className="faq-section">
        <h1 className="faq-header">FAQ</h1>
        <Accordion className="accordian">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <span className="faq-title">
              What the heck am I supposed to do with Darkblock?
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <p className="faq-answer">
              Darkblock enables you to upgrade your NFT to deliver exclusive
              content to the NFT owner. That content will be initially unlocked
              in our TV App, but in the future we will enable Darkblocks to be
              accessed any way you want to consume that content. Within reason.
              <br></br>
              <br></br>
              Read more about what Darkblock is all about{" "}
              <a
                className="faq-link"
                target="_blank"
                rel="noreferrer"
                href=" https://darkblock.medium.com/darkblock-bridge-to-the-decentralized-digital-frontier-e1ec1eeb5a60"
              >
                here
              </a>
              .
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordian">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <span className="faq-title">
              What types of NFTs do you support?
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <p className="faq-answer">
              We support ERC-721 and ERC-1155 NFTs that have been minted
              on-chain, or lazy-minted (not on-chain yet) using Opensea. More
              standards will be added as demand warrants! If you have any
              demands please hit us up on our Discord.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordian">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <span className="faq-title">What if I can't find my NFT?</span>
          </AccordionSummary>
          <AccordionDetails>
            <p className="faq-answer">
              The Opensea API we use for NFT metadata is less than perfect. And
              we are also less than perfect. Please use this form to enter in
              your NFT's contract address and token id to access it directly. If
              that doesn't work, come punch us in the face (nicely) on our
              Discord with the details and we will investigate asap!
              <br></br>
              <br></br>
              Something broke! What do I do? Please hit us up on our{" "}
              <a
                rel="noreferrer"
                href="http://chat.darkblock.io"
                target="_blank"
                className="faq-link"
              >
                Discord
              </a>{" "}
              to surface any issues and we will fix them asap!
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordian">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <span className="faq-title">What is Test Mode?</span>
          </AccordionSummary>
          <AccordionDetails>
            <p className="faq-answer">
              Test Mode is a way for you to view test Darkblocks of your
              creations in the TV App. They will not be seen by the owners of
              the NFT, only you as the creator will be able to see them. You can
              create multiple test Darkblocks, the TV App will pick up the most
              recent one.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion className="accordian">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <span className="faq-title">Is Darkblock fully decentralized?</span>
          </AccordionSummary>
          <AccordionDetails>
            <p className="faq-answer">
              Not yet. But, like many others, we are working towards full
              decentralization. More details coming soon!
            </p>
          </AccordionDetails>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
}
