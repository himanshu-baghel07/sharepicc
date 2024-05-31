import React, { useState } from "react";
import "./Onboarding.css";
import { useNavigate } from "react-router-dom";
import sharePicLogo from "../../assets/sharePicLogo.svg";
import bannerImg from "../../assets/bannerOnboard.png";
import { ToastContainer, toast } from "react-toastify";

const Onboarding = () => {
  const navigate = useNavigate();
  const [link, setLink] = useState("");

  const extentionNotFound = () =>
    toast.error("Please install DIAM wallet extension!", {
      toastId: "extentionNotFound",
    });

  const handleConnect = () => {
    if (window.diam) {
      if (window.diam && window.diam.sign) {
        window.diam.connect().then((res) => {
          if (res.status === 200) {
            navigate("/home", {
              state: {
                publicK: res.message[0],
              },
            });
          }
        });
      }
    } else {
      extentionNotFound();
      setLink(
        "https://chromewebstore.google.com/detail/diam-wallet/oakkognifoojdbfjaccegangippipdmn?hl=en-GB&utm_source=ext_sidebar"
      );
    }
  };

  return (
    <div className="onboard_cont">
      <div className="topbar">
        <div className="topbar_cont">
          <img src={sharePicLogo} alt="" className="app_logo" />
        </div>

        <div className="topbar_cont second_cont"></div>
      </div>
      <div className="onboard_main">
        <div className="left_onboard">
          <img src={bannerImg} alt="" className="banner_image" />
        </div>
        <div className="right_onboard">
          <h1>
            Let's <br />
            Connect and <br /> <span className="share_text">Share </span>
            <br />
            Your World
          </h1>
          <button className="create_btn" onClick={() => handleConnect()}>
            Connect DIAM Wallet
          </button>
          {link && (
            <a href={link} alt="" className="extention_link">
              Download DIAM Wallet
            </a>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Onboarding;
