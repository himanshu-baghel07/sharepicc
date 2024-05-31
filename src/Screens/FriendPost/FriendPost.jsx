import React, { useMemo } from "react";
import sharePicLogo from "../../assets/sharePicLogo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import copyIcon from "../../assets/Copy.svg";
import { FaHeart } from "react-icons/fa6";
import { minidenticon } from "minidenticons";
import "./FriendPost.css";

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

const FriendPost = () => {
  const location = useLocation();
  const navigateTo = useNavigate();

  const { friend_data, publicKey } = location.state;

  return (
    <div className="homescreen_cont">
      <div className={`home_top_sec `}>
        <div
          className="top_mid_bar"
          onClick={() =>
            navigateTo("/home", {
              state: {
                publicK: publicKey,
              },
            })
          }
        >
          <img src={sharePicLogo} alt="" className="app_logo" />
        </div>
      </div>

      <div className="home_main_sec friend_post_cont">
        {friend_data.length !== 0 ? (
          friend_data.map((dd, index) => (
            <div className="feed_sec" key={index}>
              <div className="top_feed">
                <MinidenticonImg
                  username={dd.user_address}
                  saturation="90"
                  className="top_feed_img"
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
                    <audio
                      src={dd.image_hash}
                      controls
                      // className="upload_img_style"
                      autoPlay={false}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  )}
                </div>
              )}

              <div className="like_btn">
                <div
                  title="Like"
                  className="normal_like"
                  onClick={() => handleLikeCount(dd.id)}
                >
                  <FaHeart style={{ color: dd.like_count && "red" }} />
                  &nbsp;{dd.like_count}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no_data">
            <h4>Nothing to show</h4>{" "}
            <span
              onClick={() =>
                navigateTo("/home", {
                  state: {
                    publicK: publicKey,
                  },
                })
              }
            >
              Go to home
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendPost;
