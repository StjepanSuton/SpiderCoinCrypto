import { useCallback } from "react";
import classes from "./CoinGeneralInfo.module.scss";

import { styled } from "@mui/material/styles";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useSelector, useDispatch } from "react-redux";
import { addCoinToWatchList, RootState } from "../store/WatchListStore";
interface GeneralInfo {
  id: string;
  rank: number;
  image: string;
  name: string;
  ticker: string;
  price: number;
  percentage24h: number;
  low24h: number;
  high24h: number;
  marketCap: number;
  totalVolume: number;
  fullyDiluted: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  width: 300,
  marginLeft: 16,
  marginRight: 16,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 300 : 900],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#2d3339" : "#308fe8",
  },
}));

function CoinGeneralInfo(props: GeneralInfo) {
  const showBookmark = useSelector((state: RootState) => state.coins);
  const dispatch = useDispatch();
  const onAddCoin = useCallback(() => {
    dispatch(addCoinToWatchList(props.id));
  }, [dispatch]);
  return (
    <div>
      <h4 className={classes.rank}>{`Rank: #${props.rank}`}</h4>
      <div className={classes["first-box"]}>
        <img className={classes.image} src={props.image} />
        <h2 className={classes.name}>{props.name}</h2>
        {showBookmark.find((item) => item === props.id) ? (
          <BookmarkIcon style={{ fontSize: 32 }} onClick={onAddCoin} />
        ) : (
          <BookmarkBorderOutlinedIcon
            style={{ fontSize: 32 }}
            onClick={onAddCoin}
          />
        )}
      </div>
      <div className={classes["second-box"]}>
        <h1 className={classes.price}>{`$${props.price.toLocaleString("en-IN", {
          maximumSignificantDigits: 6,
          maximumFractionDigits: 0,
        })}`}</h1>
        <h4
          className={
            props.percentage24h >= 0
              ? classes["percentage-positive"]
              : classes["percentage-negative"]
          }
        >{`${props.percentage24h.toFixed(2)}%`}</h4>
      </div>
      <div className={classes["second-box"]}>
        <h6 className={classes.lowhigh}>{`$${props.low24h.toLocaleString(
          "en-IN",
          {
            maximumSignificantDigits: 6,
            maximumFractionDigits: 0,
          }
        )}`}</h6>
        <BorderLinearProgress
          variant="determinate"
          value={
            -(
              ((props.high24h - props.price) / (props.high24h - props.low24h)) *
                100 -
              100
            )
          }
        />
        <h6 className={classes.lowhigh}>{`$${props.high24h.toLocaleString(
          "en-IN",
          {
            maximumSignificantDigits: 6,
            maximumFractionDigits: 0,
          }
        )}`}</h6>
      </div>
      <div className={classes["market-info"]}>
        <div className={classes.ingrid}>
          <h4 className={classes["ingrid-info"]}>Market Cap</h4>
          <h4 className={classes["ingrid-value"]}>{`$${
            props.marketCap === null
              ? "No data avaliable"
              : props.marketCap.toLocaleString()
          }`}</h4>
        </div>
        <div className={classes.ingrid}>
          <h4 className={classes["ingrid-info"]}> Circulating supply</h4>
          <h4
            className={classes["ingrid-value"]}
          >{`${props.circulatingSupply}`}</h4>
        </div>
        <div className={classes.ingrid}>
          <h4 className={classes["ingrid-info"]}>24 Hour Trading Vol</h4>
          <h4 className={classes["ingrid-value"]}>{`$${
            props.totalVolume === null
              ? "No data avaliable"
              : props.totalVolume.toLocaleString()
          }`}</h4>
        </div>
        <div className={classes.ingrid}>
          <h4 className={classes["ingrid-info"]}>Total supply</h4>
          <h4 className={classes["ingrid-value"]}>{`${
            props.totalSupply === null ? "No data avaliable" : props.totalSupply
          }`}</h4>
        </div>
        <div className={classes.ingrid}>
          <h4 className={classes["ingrid-info"]}>Fully Diluted Valuation</h4>
          <h4 className={classes["ingrid-value"]}>
            {props.fullyDiluted === undefined
              ? "No data avaliable"
              : `$${props.fullyDiluted.toLocaleString()}`}
          </h4>
        </div>
        <div className={classes.ingrid}>
          <h4 className={classes["ingrid-info"]}>Max supply</h4>
          <h4 className={classes["ingrid-value"]}>{`${
            props.maxSupply === null ? "No data avaliable" : props.maxSupply
          }`}</h4>
        </div>
      </div>
    </div>
  );
}

export default CoinGeneralInfo;
