import React from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  EmailIcon
} from "react-share";

const ShareButtons = () => {
  const divContent = document.getElementById("offer-letter")?.innerText || "Check this out!";
  
  // This URL will be shared on social platforms
  const shareUrl = window.location.href;

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      <FacebookShareButton url={shareUrl} quote={divContent}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <WhatsappShareButton url={shareUrl} title={divContent}>
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      <TwitterShareButton url={shareUrl} title={divContent}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>

      <EmailShareButton url={shareUrl} subject="Check this out" body={divContent}>
        <EmailIcon size={40} round />
      </EmailShareButton>
    </div>
  );
};

export default ShareButtons;
