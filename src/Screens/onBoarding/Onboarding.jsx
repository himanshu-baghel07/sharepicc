import React, { useEffect, useState } from "react";
import "./Onboarding.css";
import { useNavigate } from "react-router-dom";
import eyeVisible from "../../assets/eyeVisible.svg";
import eyeSlash from "../../assets/eyeSlash.svg";
import loaderBtn from "../../assets/loaderBtn.svg";
import Copy from "../../assets/Copy.svg";
import * as StellarSdk from "@stellar/stellar-sdk";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import SocialLogo from "../../assets/Images/socialLogo.jpg";
import axios from "axios";
import { checkSecretKey, decrypt, encrypt } from "../CommonComponents/Common";

const Onboarding = ({ setImgModal, setModalCond }) => {
  const [currentPage, setCurrentPage] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [togglePass, setTogglePass] = useState(false);
  const [toggleConfPass, setToggleConfPass] = useState(false);
  const [publicAdd, setPublicAdd] = useState("");
  const [privateAdd, setPrivateAdd] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();

  const togglePassVisiblity = () => {
    setTogglePass(togglePass ? false : true);
  };

  const toggleConfPassVisiblity = () => {
    setToggleConfPass(toggleConfPass ? false : true);
  };

  const onCopyText = () => {
    toast.info("Public address copied", {
      toastId: "publicAddr",
    });
  };

  const onCopyPvt = () => {
    toast.info("Secret address copied", {
      toastId: "secretAdd",
    });
  };

  const pinNotMatched = () => {
    toast.warning("Passowrd not match with confirm password", {
      toastId: "pass",
    });
  };

  const errorShowWrong = () => {
    toast.warning("Something went wrong", {
      toastId: "error",
    });
  };

  const handlePassword = (e) => {
    setPass(e.target.value);
    setConfPass("");
  };

  const handleConfPassword = (e) => {
    setConfPass(e.target.value);
  };

  const ValidatePin = () => {
    if (pass === confPass) {
      createWalletClick();
    } else {
      pinNotMatched();
    }
  };

  const handlePassCheck = () => {
    if (pass === confPass) {
      importWallet();
    } else {
      pinNotMatched();
    }
  };

  const handleConnect = () => {
    if (window.diam && window.diam.sign) {
      // window.diam
      //   .sign(
      //     "AAAAAgAAAADL06pQBWGdmvxlH5NzW6Moxah7QyT1t6DFcr1RKS2dMwAAAGQAAoCnAAAACwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAEAAAAAy9OqUAVhnZr8ZR+Tc1ujKMWoe0Mk9begxXK9USktnTMAAAAAAAAAAAcnDgAAAAAAAAAAAA=="
      //   )
      //   .then((res) => console.log(res));
      window.diam.connect().then((res) => {
        if (res) {
          console.log("Response>>>>>", res);
          navigate("/home", {
            state: {
              publicK: res[0],
            },
          });
        }
      });
      // window.diam.sign();
    } else {
      console.log("NAAAAAAAAA");
    }
  };

  // const createWallet = async () => {
  //   try {
  //     const keypair = StellarSdk.Keypair.random();
  //     setPublicAdd(keypair.publicKey());
  //     setPrivateAdd(keypair.secret());
  //     setCurrentPage("create_wallet");
  //   } catch {}
  // };

  // const importWallet = () => {
  //   const text = encrypt(privateAdd, pass);
  //   localStorage.setItem("wallet_Details", text);
  //   setPass("");
  //   setCurrentPage("login_wallet");
  // };

  // const createWalletClick = async () => {
  //   setBtnLoader(true);
  //   await axios
  //     .get(`https://friendbot.diamcircle.io/?addr=${publicAdd}`)
  //     .then((response) => {
  //       if (response.status === 200) {
  //         setBtnLoader(false);
  //         setCurrentPage("login_wallet");
  //       } else {
  //         errorShowWrong();
  //       }
  //       setBtnLoader(false);
  //       const text = encrypt(privateAdd, pass);
  //       localStorage.setItem("wallet_Details", text);
  //       setPass("");
  //     })
  //     .catch(() => {
  //       errorShowWrong();
  //       setBtnLoader(false);
  //     });
  // };

  // const handleLogin = () => {
  //   try {
  //     const getVal = localStorage.getItem("wallet_Details");
  //     console.log("Wallet_details", getVal);
  //     const val = decrypt(getVal, pass);
  //     console.log("Get Value", val);
  //     if (val) {
  //       console.log("Checking");
  //       setImgModal(true);
  //       setModalCond(true);
  //       // setTimeout(() => {

  //       // }, 400);
  //       navigate("/home", {
  //         state: {
  //           privateK: val,
  //         },
  //       });
  //     } else {
  //       console.log("Checking 2");
  //       errorShowWrong();
  //     }
  //   } catch (error) {
  //     console.log("Checking 3");
  //     errorShowWrong();
  //   }
  // };

  // useEffect(() => {
  //   const getVal = localStorage.getItem("wallet_Details");
  //   if (getVal) {
  //     setCurrentPage("login_wallet");
  //   }
  // }, []);

  // const createWalletPage = () => {
  //   return (
  //     <div className="sign_up_sec">
  //       <h2>Create Wallet</h2>
  //       <div className="input_cont">
  //         <label className="label_style">Public Address</label>
  //         <div className="intput_box_style">
  //           <input
  //             className="input_style"
  //             value={publicAdd.slice(0, 10) + "....." + publicAdd.slice(-10)}
  //             onPaste={(event) => event.preventDefault()}
  //             onCopy={(event) => event.preventDefault()}
  //             readOnly
  //           />
  //           <CopyToClipboard text={publicAdd} onCopy={onCopyText}>
  //             <img
  //               src={Copy}
  //               alt=""
  //               height="20"
  //               width="auto"
  //               style={{ cursor: "pointer" }}
  //             />
  //           </CopyToClipboard>
  //         </div>
  //       </div>
  //       <div className="input_cont">
  //         <label className="label_style">Secret Address</label>
  //         <div className="intput_box_style">
  //           <input
  //             className="input_style"
  //             value={privateAdd.slice(0, 10) + "....." + privateAdd.slice(-10)}
  //             onPaste={(event) => event.preventDefault()}
  //             onCopy={(event) => event.preventDefault()}
  //             readOnly
  //           />
  //           <CopyToClipboard text={privateAdd} onCopy={onCopyPvt}>
  //             <img
  //               src={Copy}
  //               alt=""
  //               height="20"
  //               width="auto"
  //               style={{ cursor: "pointer" }}
  //             />
  //           </CopyToClipboard>
  //         </div>
  //       </div>
  //       <div className="input_cont">
  //         <label className="label_style">Password</label>
  //         <div className="intput_box_style">
  //           <input
  //             className="input_style"
  //             type={togglePass ? "text" : "password"}
  //             value={pass}
  //             maxLength={15}
  //             minLength={8}
  //             onChange={handlePassword}
  //             onPaste={(event) => event.preventDefault()}
  //             onCopy={(event) => event.preventDefault()}
  //           />
  //           <img
  //             src={togglePass ? eyeVisible : eyeSlash}
  //             alt=""
  //             height="20"
  //             width="auto"
  //             style={{ cursor: "pointer" }}
  //             onClick={togglePassVisiblity}
  //           />
  //         </div>
  //       </div>
  //       <div className="input_cont">
  //         <label className="label_style">Confirm Password</label>
  //         <div className="intput_box_style">
  //           <input
  //             className="input_style"
  //             type={toggleConfPass ? "text" : "password"}
  //             value={confPass}
  //             maxLength={15}
  //             minLength={8}
  //             onChange={handleConfPassword}
  //             onPaste={(event) => event.preventDefault()}
  //             onCopy={(event) => event.preventDefault()}
  //           />
  //           <img
  //             src={toggleConfPass ? eyeVisible : eyeSlash}
  //             alt=""
  //             height="20"
  //             width="auto"
  //             style={{ cursor: "pointer" }}
  //             onClick={toggleConfPassVisiblity}
  //           />
  //         </div>
  //       </div>
  //       <button className="create_wallet_btn" onClick={() => ValidatePin()}>
  //         {btnLoader ? (
  //           <img src={loaderBtn} alt="" height="20" width="auto" />
  //         ) : (
  //           <>Create Wallet</>
  //         )}
  //       </button>
  //     </div>
  //   );
  // };

  // const importWalletPage = () => {
  //   return (
  //     <div className="sign_up_sec">
  //       <h2>Import Wallet</h2>
  //       <div className="input_cont">
  //         <label className="label_style">Private Address</label>
  //         <div
  //           className="intput_box_style"
  //           style={{
  //             borderColor:
  //               privateAdd === "" ? "#E8E8E8" : isValid ? "#06bf0f" : "red",
  //           }}
  //         >
  //           <input
  //             className="input_style"
  //             value={privateAdd}
  //             placeholder="Enter Private address"
  //             onChange={(e) => checkSecretKey(e, setIsValid, setPrivateAdd)}
  //           />
  //           {/* <CopyToClipboard text={privateAdd} onCopy={onCopyText}>
  //             <img
  //               src={Copy}
  //               alt=""
  //               height="20"
  //               width="auto"
  //               style={{ cursor: "pointer" }}
  //             />
  //           </CopyToClipboard> */}
  //         </div>
  //       </div>

  //       <div className="input_cont">
  //         <label className="label_style">Password</label>
  //         <div className="intput_box_style">
  //           <input
  //             className="input_style"
  //             type={togglePass ? "text" : "password"}
  //             value={pass}
  //             maxLength={15}
  //             minLength={8}
  //             onChange={handlePassword}
  //             onPaste={(event) => event.preventDefault()}
  //             onCopy={(event) => event.preventDefault()}
  //           />
  //           <img
  //             src={togglePass ? eyeVisible : eyeSlash}
  //             alt=""
  //             height="20"
  //             width="auto"
  //             style={{ cursor: "pointer" }}
  //             onClick={togglePassVisiblity}
  //           />
  //         </div>
  //       </div>
  //       <div className="input_cont">
  //         <label className="label_style">Confirm Password</label>
  //         <div className="intput_box_style">
  //           <input
  //             className="input_style"
  //             type={toggleConfPass ? "text" : "password"}
  //             value={confPass}
  //             maxLength={15}
  //             minLength={8}
  //             onChange={handleConfPassword}
  //             onPaste={(event) => event.preventDefault()}
  //             onCopy={(event) => event.preventDefault()}
  //           />
  //           <img
  //             src={toggleConfPass ? eyeVisible : eyeSlash}
  //             alt=""
  //             height="20"
  //             width="auto"
  //             style={{ cursor: "pointer" }}
  //             onClick={toggleConfPassVisiblity}
  //           />
  //         </div>
  //       </div>

  //       <button className="create_wallet_btn" onClick={() => handlePassCheck()}>
  //         {btnLoader ? (
  //           <img src={loaderBtn} alt="" height="20" width="auto" />
  //         ) : (
  //           <>Import Wallet</>
  //         )}
  //       </button>
  //     </div>
  //   );
  // };

  // const loginWalletPage = () => {
  //   return (
  //     <div className="sign_up_sec">
  //       <h2>Login Wallet</h2>

  //       <div className="input_cont login_input_cont">
  //         <label className="label_style">Password</label>
  //         <div className="intput_box_style">
  //           <input
  //             className="input_style"
  //             type={togglePass ? "text" : "password"}
  //             value={pass}
  //             maxLength={15}
  //             minLength={8}
  //             onChange={handlePassword}
  //             onPaste={(event) => event.preventDefault()}
  //             onCopy={(event) => event.preventDefault()}
  //           />
  //         </div>
  //       </div>

  //       <button className="create_wallet_btn" onClick={() => handleLogin()}>
  //         Login
  //       </button>
  //     </div>
  //   );
  // };

  // const currentSec = () => {
  //   if (currentPage === "create_wallet") return createWalletPage();
  //   else if (currentPage === "import_wallet") return importWalletPage();
  //   else if (currentPage === "login_wallet") return loginWalletPage();
  // };

  return (
    <div className="onboard_cont">
      <div className="topbar">
        <div className="topbar_cont">
          <img src={SocialLogo} alt="" height="40" width="auto" />
          SharePic
        </div>

        <div className="topbar_cont second_cont">
          <button className="create_btn" onClick={() => handleConnect()}>
            Connect
          </button>
          {/* <button
            className="import_btn"
            onClick={() => setCurrentPage("import_wallet")}
          >
            Import Wallet
          </button> */}
        </div>
      </div>
      {/* <div className="mainbar">{currentSec()}</div> */}
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
