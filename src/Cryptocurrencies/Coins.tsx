import { useCallback } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import classes from "./Coins.module.scss";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Doughnut, Line } from "react-chartjs-2";
import { lineOptions, doughnutOptions } from "./GraphOptions";
import { Link, useNavigate } from "react-router-dom";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useSelector, useDispatch } from "react-redux";
import { addCoinToWatchList, RootState } from "../store/WatchListStore";
interface Coin {
  id: string;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  sparkline_in_7d: {
    price: number[];
  };
}

function Coins(props: Coin) {
  const showBookmark = useSelector((state: RootState) => state.coins);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const getLink = (): void => {
    navigate(`/cryptocurrencies/${props.id}`);
  };

  const onAddCoin = useCallback(() => {
    dispatch(addCoinToWatchList(props.id));
  }, [props.id]);

  return (
    <TableRow className={classes.row} key={props.market_cap_rank}>
      <TableCell align="center">
        {showBookmark.find((item) => item === props.id) ? (
          <BookmarkIcon onClick={onAddCoin} />
        ) : (
          <BookmarkBorderOutlinedIcon onClick={onAddCoin} />
        )}
      </TableCell>
      <TableCell align="center">
        {" "}
        <span className={classes.symbol}>{props.market_cap_rank}</span>
      </TableCell>
      <TableCell onClick={getLink} align="left">
        <div className={classes["coin-container"]}>
          <img className={classes.image} src={props.image} alt={props.image} />
          {props.name}
        </div>
      </TableCell>
      <TableCell align="right">
        <Link
          to={`/cryptocurrencies/${props.symbol}`}
          className={classes.symbol}
        >
          <span>{props.symbol}</span>
        </Link>
      </TableCell>
      <TableCell align="right">
        <span className={classes.numbers}>
          {`$ ${props.current_price.toLocaleString("en-GB", {
            maximumSignificantDigits: 6,
            maximumFractionDigits: 0,
          })}`}
        </span>
      </TableCell>
      <TableCell align="right">
        {" "}
        <span
          className={
            props.price_change_percentage_24h >= 0
              ? classes["percentage-positive"]
              : classes["percentage-negative"]
          }
        >
          {" "}
          {props.price_change_percentage_24h >= 0 ? (
            <ArrowDropUpIcon />
          ) : (
            <ArrowDropDownIcon />
          )}
          {`${props.price_change_percentage_24h
            .toFixed(2)
            .replace(/-(?=\d)/, "")}%`}
        </span>
      </TableCell>
      <TableCell align="right">
        <span className={classes.numbers}>{`$ ${props.market_cap.toLocaleString(
          "en-GB"
        )}`}</span>
      </TableCell>
      <TableCell style={{ padding: 0 }} size="small" align="center">
        <Doughnut
          style={{
            maxWidth: 150,
            maxHeight: 50,
            marginTop: 5,
            display: "unset",
          }}
          options={doughnutOptions}
          data={{
            labels: [
              "Circ",
              props.total_supply - props.circulating_supply <= 0
                ? []
                : "Supply",
            ],
            datasets: [
              {
                label: "",
                data: [
                  props.circulating_supply,
                  props.total_supply - props.circulating_supply <= 0
                    ? []
                    : props.total_supply - props.circulating_supply,
                ],
                backgroundColor: [
                  "rgba(255, 99, 133, 0.359)",
                  "rgba(54, 163, 235, 0.441)",
                ],
                borderColor: [
                  "rgba(255, 99, 133, 0.359)",
                  "rgba(54, 163, 235, 0.441)",
                ],
              },
            ],
          }}
        />
      </TableCell>
      <TableCell style={{ padding: 0 }} size="small" align="center">
        <Line
          style={{
            maxWidth: 150,
            maxHeight: 50,
            display: "unset",
          }}
          options={lineOptions}
          data={{
            labels: props.sparkline_in_7d.price.map((_, i) => {
              return i;
            }),
            datasets: [
              {
                label: "",
                data: props.sparkline_in_7d.price.map((price) => {
                  return price;
                }),
                borderColor:
                  props.sparkline_in_7d.price[0] >
                  props.sparkline_in_7d.price[
                    props.sparkline_in_7d.price.length - 1
                  ]
                    ? "#ea3943"
                    : "rgb(46, 150, 1)",
              },
            ],
          }}
        />
      </TableCell>
    </TableRow>
  );
}

export default Coins;
