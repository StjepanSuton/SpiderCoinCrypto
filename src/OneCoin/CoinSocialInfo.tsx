import React from "react";
import classes from "./CoinSocialInfo.module.scss";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import LinkIcon from "@mui/icons-material/Link";
import HomeIcon from "@mui/icons-material/Home";
import RedditIcon from "@mui/icons-material/Reddit";
interface SocialInfo {
  categories: string[];
  date: string;
  upVote: number;
  downVote: number;
  blockchain_site: string[];
  homepage: string[];
  github: string[];
  reddit: string;
}

function CoinSocialInfo(props: SocialInfo) {
  return (
    <div className={classes["main-container"]}>
      <h2 className={classes.title}>Info:</h2>
      <div className={classes.container}>
        <div className={classes["small-box"]}>
          <h4 className={classes["sub-titles"]}>Category:</h4>
          <h4 className={classes.values}>
            {props.categories[0] === null ? "Unknown" : props.categories[0]}
          </h4>
        </div>
        <div className={classes["small-box"]}>
          <h4 className={classes["sub-titles"]}>Gensesis date:</h4>
          <h4 className={classes.values}>
            {props.date === null ? "Unknown" : props.date}
          </h4>
        </div>
        <div className={classes["small-box"]}>
          <h4 className={classes["sub-titles"]}>Public Sentiment:</h4>
          <h4 className={classes.values}>
            <ThumbUpAltOutlinedIcon sx={{ mr: 1 }} />
            {`${props.upVote}%`}
            <ThumbDownOutlinedIcon sx={{ mr: 1, ml: 1 }} />{" "}
            {`${props.downVote}%`}
          </h4>
        </div>
        <div className={classes["small-box"]}>
          <h4 className={classes["sub-titles"]}>Blokchain site:</h4>
          <a href={props.blockchain_site[0]} className={classes.links}>
            <LinkIcon style={{ fontSize: 20 }} />
            blokchain
          </a>
        </div>
        <div className={classes["small-box"]}>
          <h4 className={classes["sub-titles"]}>Homepage:</h4>
          <a href={props.homepage[0]} className={classes.links}>
            <HomeIcon style={{ fontSize: 20 }} />
            home
          </a>
        </div>
        <div className={classes["small-box"]}>
          <h4 className={classes["sub-titles"]}>Reddit:</h4>
          <a href={props.reddit} className={classes.links}>
            <RedditIcon style={{ fontSize: 20 }} />
            reddit
          </a>
        </div>
      </div>
    </div>
  );
}

export default CoinSocialInfo;
