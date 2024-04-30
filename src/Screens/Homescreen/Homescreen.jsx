import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Homescreen.css";
import loaderBtn from "../../assets/loaderBtn.svg";
import loaderYellow from "../../assets/loaderYellow.svg";
import menuOn from "../../assets/menuOn.svg";
import menuOff from "../../assets/menuOff.svg";
import copyIcon from "../../assets/Copy.svg";
import closeIcon from "../../assets/CloseIcon.svg";
import SocialLogo from "../../assets/Images/socialLogo.jpg";
import ProfileBg from "../../assets/Images/bgImage.jpg";
import Diam from "../../assets/Images/Diam.png";
import { create } from "ipfs-http-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { minidenticon } from "minidenticons";
import ReactSlider from "react-slider";

import {
  Keypair,
  BASE_FEE,
  TransactionBuilder,
  Operation,
  Asset,
} from "@stellar/stellar-sdk";

import * as StellarSdk from "@stellar/stellar-sdk";

import { Horizon } from "@stellar/stellar-sdk";

import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { FaHeart, FaKey, FaUpload, FaWallet } from "react-icons/fa6";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { URI } from "../CommonComponents/Index";

export const MinidenticonImg = ({
  username,
  saturation,
  lightness,
  ...props
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return <img src={svgURI} alt={username} {...props} />;
};

const Homescreen = ({ imgModal, setImgModal, modalCond, setModalCond }) => {
  const [file, setFile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [infoData, setInfoData] = useState([]);
  const [description, setDescription] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  // const [imgModal, setImgModal] = useState(false);
  const [myFeedData, setMyFeedData] = useState([]);
  const [walletBal, setWalletBal] = useState("");
  // const [publicK, setPublicK] = useState("");
  const [cardModal, setCardModal] = useState(false);
  // const [modalCond, setModalCond] = useState(false);
  const [loader, setLoader] = useState(new Array(infoData.length).fill(false));
  const [setType, setSetType] = useState(null);
  const [navbarToggle, setNavbarToggle] = useState(false);
  const [filterName, setFilterName] = useState("recent");
  const [sortingCriteria, setSortingCriteria] = useState("recent");
  const [isValid, setIsValid] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const location = useLocation();

  const navigateTo = useNavigate();

  const { publicK } = location.state;

  const notify = () =>
    toast.success("Upload Successfully!", {
      toastId: "upload_success",
    });

  const errorMsg = () =>
    toast.error("Something went wrong!", {
      toastId: "Error",
    });

  const alreadyLiked = () =>
    toast.warning("Already liked!", {
      toastId: "liked",
    });

  const responseError = () =>
    toast.error("Response Error!", {
      toastId: "resErr",
    });

  const copyMsg = () =>
    toast.success("Address copied", {
      toastId: "copy_address",
    });

  const client = create({
    host: "54.129.7.190",
    port: 4000,
    protocol: "http",
  });

  const copyData = (value) => {
    navigator.clipboard.writeText(value).catch(() => {});
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
    const fileType = selectedFile.type;
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (
      fileType.startsWith("image/") ||
      ["jpg", "jpeg", "png", "gif"].includes(fileExtension)
    ) {
      setSetType(1);
    } else if (
      fileType.startsWith("video/") ||
      ["mp4", "mov", "avi", "mkv"].includes(fileExtension)
    ) {
      setSetType(2);
    } else if (
      fileType.startsWith("audio/") ||
      ["mp3"].includes(fileExtension)
    ) {
      setSetType(3);
    }
  };

  const handleFileUpload = async () => {
    try {
      setBtnLoader(true);
      let headersList = {
        Accept: "*",
      };
      let formdata = new FormData();
      formdata.append("name", "");
      formdata.append("desc", description);
      formdata.append("user_address", publicK);
      formdata.append("image", file);
      formdata.append("media_type", setType);
      let bodyContent = formdata;
      let reqOptions = {
        url: URI.upload_media,
        method: "POST",
        headers: headersList,
        data: bodyContent,
      };
      let response = await axios.request(reqOptions);
      if (response.status === 200) {
        setFile([]);
        getData();
        notify();
        setDescription("");
        setFile([]);
        setFileName("");
        setBtnLoader(false);
        myFeed(publicK);
      } else {
        setBtnLoader(false);
        responseError;
      }
    } catch {
      setBtnLoader(false);
      errorMsg();
    }
  };

  const handleLike = async (id, destAddress, index) => {
    const updatedLoaders = [...loader];
    updatedLoaders[index] = true;
    setLoader(updatedLoaders);
    const server = new Horizon.Server("https://diamtestnet.diamcircle.io");
    // const sender_secret_key = privateK;
    // const receiverAccountId = destAddress;
    // const senderKeypair = StellarSdk.Keypair.fromSecret(sender_secret_key);
    // const senderPublicKey = senderKeypair.publicKey();
    const sourceAccount = await server.loadAccount(publicK);
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: "Diamante Testnet",
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destAddress,
          asset: StellarSdk.Asset.native(),
          amount: "0.5",
        })
      )
      .setTimeout(0)
      .build();
    const xdr = transaction.toXDR("base64");

    const resp = await window.diam.sign(xdr);

    console.log(resp, "HEREEEEEEEEEEE");
    if (resp.response.successful) {
      console.log("Res>>>>>", resp.response.successful);
      handleLikeCount(id);
      setLoader(new Array(infoData.length).fill(false));
      getBalance(publicK);
    }

    // transaction.sign(StellarSdk.Keypair.fromSecret(sender_secret_key));
    // server
    //   .submitTransaction(transaction)
    //   .then((result) => {
    //     getBalance(publicK);
    //     handleLikeCount(id);
    //     const updatedLoader = [...loader];
    //     updatedLoader[index] = false;
    //     setLoader(updatedLoader);
    //   })
    //   .catch((error) => {
    //     setLoader(false);
    //     errorMsg();
    //   });
  };

  const getData = async () => {
    await axios
      .post(URI.my_feeds)
      .then(async (res) => {
        await axios
          .get("http://54.219.7.190:8080/ipfs/" + res.data.CID)
          .then((res) => {
            if (res.status === 200) {
              setInfoData(res.data.reverse());
            } else {
              responseError();
              setInfoData([]);
            }
          })
          .catch(() => {
            errorMsg();
            setInfoData([]);
          });
      })
      .catch(() => {
        errorMsg();
      });
  };

  const handleLikeCount = (id) => {
    let data = JSON.stringify({
      id: id,
      count: 1,
      public_key: publicK,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: URI.add_like_to_post,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.is_liked) {
            alreadyLiked();
          } else {
            getData();
            myFeed(publicK);
          }
        } else {
          responseError();
        }
      })
      .catch(() => {
        errorMsg();
      });
  };

  const myFeed = async (pubky) => {
    const payload = {
      user_address: pubky,
    };
    await axios
      .post(URI.my_uploads, payload)
      .then((response) => {
        if (response.status === 200) {
          setMyFeedData(response.data.reverse());
        } else {
          setMyFeedData([]);
          responseError();
        }
      })
      .catch(() => {
        errorMsg();
        setMyFeedData([]);
      });
  };

  const getBalance = async (pubKey) => {
    let balance = null;
    try {
      const server = new Horizon.Server("https://diamtestnet.diamcircle.io/");
      const account = await server.accounts().accountId(pubKey).call();
      if (
        account &&
        Array.isArray(account.balances) &&
        account.balances.length > 0
      ) {
        balance = parseFloat(
          account.balances[account.balances.length - 1].balance
        ).toFixed(3);
      }
      setWalletBal(balance);
    } catch (e) {
      balance = 0;
      setWalletBal(balance);
    }
  };
  const fetchDataAndHandleError = async () => {
    try {
      await getBalance(publicK);
      await myFeed(publicK);
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem("wallet_Details");
    const value = localStorage.getItem("wallet_Details");
    console.log("Value", value);
    if (value !== "") {
      navigateTo("/");
    } else {
      errorMsg();
    }
  };

  const handleFilter = (criteria) => {
    setSortingCriteria(criteria);
  };

  const sortData = (data, criteria) => {
    if (criteria === "mostLike") {
      return data.slice().sort((a, b) => b.like_count - a.like_count);
    } else if (criteria === "recent") {
      return data.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const handleSearch = async () => {
    const payload = {
      user_address: searchValue,
    };
    await axios
      .post(URI.my_uploads, payload)
      .then((response) => {
        if (response.status === 200) {
          navigateTo("/friendpost", {
            state: {
              friend_data: response.data,
              publicKey: publicK,
            },
          });
        } else {
          responseError();
        }
      })
      .catch(() => {
        errorMsg();
        setMyFeedData([]);
      });
  };

  const checkSecretKey = (e) => {
    const value_ = e.target.value;
    const valid = StellarSdk.StrKey.isValidEd25519PublicKey(value_);
    setIsValid(valid);
    setSearchValue(value_);
    // setPvtKeyVal(value_);
  };

  // Function to render data based on sorting criteria
  const renderData = () => {
    const sortedData = sortData(infoData, sortingCriteria);
    return sortedData.map((dd, index) => (
      <div className="feed_sec" key={index}>
        <div className="top_feed">
          <MinidenticonImg
            username={dd.user_address}
            saturation="90"
            className="top_feed_img"
          />

          <div>
            {dd.user_address.slice(0, 5) + "....." + dd.user_address.slice(-5)}{" "}
            <abbr
              title="Copy"
              onClick={() => {
                copyData(dd.user_address);
                copyMsg();
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={copyIcon}
                style={{ marginLeft: "3px" }}
                alt="Copy icon"
                height="13"
                width="auto"
              />
            </abbr>
            <br />
            <span className="time_style">
              {new Date(dd.time).toDateString()} &nbsp;
              {new Date(dd.time).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        </div>
        <div className="upload_post_style">{dd.description}</div>
        {dd.image_hash && (
          <div className="upload_img_cont">
            {dd.type === 1 && (
              <img
                src={dd.image_hash}
                alt=""
                // height="auto"
                // width="100%"
                className="upload_img_style"
                style={{ objectFit: "cover" }}
              />
            )}

            {dd.type === 2 && (
              <video controls className="upload_img_style">
                <source src={dd.image_hash} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {dd.type === 3 && (
              // <audio
              //   src={dd.image_hash}
              //   controls
              //   // className="upload_img_style"
              //   autoPlay={false}
              //   onPlay={() => setIsPlaying(true)}
              //   onPause={() => setIsPlaying(false)}
              //   // style={{ width: "80%" }}
              // />

              <audio
                src={dd.image_hash}
                controls
                autoPlay={false}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}
          </div>
        )}

        <div className="like_btn" style={{ position: "relative" }}>
          <div
            title="Like"
            className="normal_like"
            onClick={() => handleLikeCount(dd.id)}
          >
            {/* {loader[index] ? (
              <img src={loaderYellow} alt="" height="20" width="auto" />
            ) : (
              <>
                <FaHeart style={{ color: dd.like_count && "red" }} />
                &nbsp;{dd.like_count}
              </>
            )} */}
            <FaHeart style={{ color: dd.like_count && "red" }} />
            &nbsp;{dd.like_count}
          </div>
          {/* <div
            style={{
              position: "absolute",
              width: "100px",
              top: "-40%",
              left: "55%",
            }}
          >
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
              min={0}
              max={100}
              defaultValue={50} // Set the default value if needed
              renderThumb={(props, state) => (
                <div {...props}>{state.valueNow}</div>
              )}
            />
          </div> */}

          <div
            className="normal_like"
            onClick={() => handleLike(dd.id, dd.user_address, index)}
          >
            {loader[index] ? (
              <img src={loaderYellow} alt="" height="20" width="auto" />
            ) : (
              <>
                &nbsp;
                <img src={Diam} alt="" className="diam_coin" /> &nbsp;
              </>
            )}
          </div>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    getData();
    fetchDataAndHandleError();
  }, []);

  return (
    <div className="homescreen_cont">
      {imgModal && (
        <div className={` ${modalCond ? "modal " : "modal-close"}`}>
          <div
            className={` ${
              modalCond ? "modal-content" : "modal-content-close"
            }`}
          >
            <div className="modal_head_cont">
              <div className="modal_text">
                For every like you give to content on our platform, one DIAM
                will be credited to the creator of the content from your
                account. This is a way to show your appreciation for their work
                and support their continued creativity. Your account will be
                automatically debited for each like you give, so make sure you
                have enough DIAMs in your account to cover your likes. Thank you
                for supporting our community of creators!
              </div>
            </div>
            <div className="modal_banner">
              <div
                onClick={() => {
                  setModalCond(false);
                  setTimeout(() => {
                    setImgModal(false);
                  }, 400);
                }}
                className="modal_close"
              >
                Understood
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`home_top_sec ${imgModal && "blurCls"}`}>
        <div className="top_mid_bar">
          <img src={SocialLogo} alt="" height="40" width="auto" />
          SharePic
        </div>
        <div className="search_cont">
          <input
            className="input_search"
            placeholder="Search user by public key"
            value={searchValue}
            style={{
              border: "1px solid",
              borderColor:
                searchValue === "" ? "#E8E8E8" : isValid ? "#06bf0f" : "red",
            }}
            onChange={(e) => checkSecretKey(e)}
          />
          <button className="search_btn" onClick={() => handleSearch()}>
            Search
          </button>
        </div>
        <div className="mobile_render">
          {navbarToggle ? (
            <>
              <img
                src={menuOff}
                height="30px"
                width="auto"
                alt=""
                className="menu_on_icon"
                onClick={() => setNavbarToggle(false)}
              />
              <div className="nav_bar">
                <div className="nav_content">
                  <div className="nav_public_key">
                    <span>
                      <FaKey style={{ fontSize: "14px" }} />
                      &nbsp;
                    </span>{" "}
                    {publicK.slice(0, 8) + "....." + publicK.slice(-8)} &nbsp;
                    <abbr
                      title="Copy"
                      onClick={() => {
                        copyData(publicK);
                        copyMsg();
                      }}
                    >
                      <img
                        src={copyIcon}
                        style={{ marginLeft: "3px" }}
                        alt="Copy icon"
                        height="15"
                        width="auto"
                      />
                    </abbr>
                  </div>
                  <div className="nav_public_key">
                    <FaWallet style={{ fontSize: "" }} /> &nbsp;
                    <span>Balance: {walletBal}&nbsp;DIAM</span>
                  </div>
                  <div className="nav_public_key logout" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <img
                src={menuOn}
                height="30px"
                width="auto"
                alt=""
                onClick={() => setNavbarToggle(true)}
              />
            </div>
          )}
        </div>
      </div>
      <div className={`home_main_sec ${imgModal && "blurCls"}`}>
        <div className="left_sec">
          <div className="profile_info_sec">
            {/* <img src={ProfileBg} alt="" className="image_sec" /> */}

            <MinidenticonImg
              className="dp_picture"
              username={publicK}
              saturation="90"
              style={{ borderRadius: "20px" }}
            />
            <h3 className="user_name">Public Key</h3>
            <div className="profile_edit">
              <span>
                <FaKey style={{ fontSize: "14px" }} />{" "}
              </span>{" "}
              {publicK.slice(0, 8) + "....." + publicK.slice(-8)}
              <abbr
                title="Copy"
                onClick={() => {
                  copyData(publicK);
                  copyMsg();
                }}
              >
                <img
                  src={copyIcon}
                  style={{ marginLeft: "3px" }}
                  alt="Copy icon"
                  height="15"
                  width="auto"
                />
              </abbr>
            </div>
            <div className="wallet_bal">
              <FaWallet style={{ fontSize: "" }} />
              <span>Balance: {walletBal}&nbsp;DIAM</span>
            </div>
          </div>
          {/* <div className="nav_public_key logout" onClick={handleLogout}>
            Logout
          </div> */}
          <div className="top_performer">
            <div className="top_performer_haed">Top Creators🥳</div>
            <div className="tip_performer_index index_style">
              <div className="first">Rank</div>
              <div className="second">Public address</div>
              <div className="third">Reward</div>
            </div>
            <div className="tip_performer_index">
              <div className="first">1</div>
              <div className="second">GBCJZIT....FQSLF5D</div>
              <div className="third">
                <img src={Diam} alt="" height="15" width="15" /> 5000
              </div>
            </div>
            <div className="tip_performer_index">
              <div className="first">2</div>
              <div className="second">GCH2ZQ7....76C3XLB</div>
              <div className="third">
                <img src={Diam} alt="" height="15" width="15" /> 3000
              </div>
            </div>
            <div className="tip_performer_index">
              <div className="first">3</div>
              <div className="second">GACBUPB....S5AQRYF</div>
              <div className="third">
                <img src={Diam} alt="" height="15" width="15" />
                2000
              </div>
            </div>
            <div className="tip_performer_index">
              <div className="first">4</div>
              <div className="second">GBHU24B....5VOLEZG</div>
              <div className="third">
                <img src={Diam} alt="" height="15" width="15" /> 1000
              </div>
            </div>
            <div className="tip_performer_index">
              <div className="first">5</div>
              <div className="second">GBJGVVV....4VXWBOK</div>
              <div className="third">
                <img src={Diam} alt="" height="15" width="15" />
                700{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="mid_sec">
          <div className="upload_section">
            <MinidenticonImg
              username={publicK}
              saturation="90"
              className="dp_style"
            />
            <div className="post_cont">
              <textarea
                placeholder="Tell your friends about your thoughts.."
                className="post_desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />

              <div className="upload_btn">
                {fileName === "" ? (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                    <div className="upload_image" onClick={handleButtonClick}>
                      <FaUpload />
                      &nbsp; Add media
                    </div>
                  </>
                ) : (
                  <p className="fileName">
                    {fileName.slice(0, 40)} {fileName.length > 50 && "....."}{" "}
                    &nbsp;
                    <span
                      onClick={() => {
                        setFile([]);
                        setFileName("");
                      }}
                    >
                      <FaTimes
                        onClick={() => setFile("")}
                        style={{ color: "red" }}
                      />
                    </span>
                  </p>
                )}

                <button
                  className={`publish_image ${
                    !description && !fileName && "disable_btn"
                  }`}
                  disabled={!description && !fileName}
                  onClick={() => handleFileUpload()}
                >
                  {btnLoader ? (
                    <img src={loaderBtn} alt="" height="20" width="auto" />
                  ) : (
                    <>
                      <FaCloudUploadAlt />
                      &nbsp; Publish
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="filter_btn_cont">
            <button
              className={`filter_btn ${
                filterName === "recent" ? "filter_select" : "filter_unselect"
              }`}
              onClick={() => {
                handleFilter("recent");
                setFilterName("recent");
              }}
            >
              Recent Feeds
            </button>
            <button
              className={`filter_btn ${
                filterName === "mostLike" ? "filter_select" : "filter_unselect"
              }`}
              onClick={() => {
                handleFilter("mostLike");
                setFilterName("mostLike");
              }}
            >
              Most Liked
            </button>
          </div>
          {renderData()}
          {/* {renderData.length !== 0 ? (
            renderData.map((dd, index) => (
              <div className="feed_sec" key={index}>
                <div className="top_feed">
                  <MinidenticonImg
                    username={dd.user_address}
                    saturation="90"
                    height="50px"
                    width="50px"
                    style={{ borderRadius: "20px", border: "1px solid #fff" }}
                  />

                  <div>
                    {dd.user_address.slice(0, 5) +
                      "....." +
                      dd.user_address.slice(-5)}{" "}
                    <abbr
                      title="Copy"
                      onClick={() => {
                        copyData(dd.user_address);
                        copyMsg();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={copyIcon}
                        style={{ marginLeft: "3px" }}
                        alt="Copy icon"
                        height="13"
                        width="auto"
                      />
                    </abbr>
                    <br />
                    <span className="time_style">
                      {new Date(dd.time).toDateString()} &nbsp;
                      {new Date(dd.time).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="upload_post_style">{dd.description}</div>
                {dd.image_hash && (
                  <div className="upload_img_cont">
                    {dd.type === 1 && (
                      <img
                        src={dd.image_hash}
                        alt=""
                        height="250"
                        width="auto"
                        className="upload_img_style"
                        style={{ objectFit: "center" }}
                      />
                    )}

                    {dd.type === 2 && (
                      <video controls style={{ width: "90%" }}>
                        <source src={dd.image_hash} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                <div
                  className="like_btn"
                  onClick={() => handleLike(dd.id, dd.user_address, index)}
                >
                  {loader[index] ? (
                    <img src={loaderYellow} alt="" height="20" width="auto" />
                  ) : (
                    <>
                      <FaHeart style={{ color: dd.like_count && "red" }} />
                      &nbsp;{dd.like_count}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>Nothing to show</div>
          )} */}
        </div>
        <div className="right_sec">
          <h2 className="my_uploads_text">My Uploads</h2>

          {myFeedData.length !== 0 ? (
            myFeedData.map((img, index) => (
              <div className="my_feed_img" key={index}>
                {img.description && (
                  <h3 className="upload_img_desc">{img.description}</h3>
                )}

                {img.type === 1 && (
                  <img
                    src={img.image_hash}
                    alt=""
                    height="auto"
                    width="100%"
                    style={{ objectFit: "center", borderRadius: "5px" }}
                  />
                )}

                {img.type === 2 && (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  >
                    <source src={img.image_hash} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {img.type === 3 && (
                  <audio
                    src={img.image_hash}
                    controls
                    autoPlay={false}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    style={{ width: "80%" }}
                  />
                )}
                <div className="like_btn">
                  <FaHeart style={{ color: "red" }} />
                  {img.like_count}
                </div>
              </div>
            ))
          ) : (
            <div>Nothing to show</div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
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

export default Homescreen;
