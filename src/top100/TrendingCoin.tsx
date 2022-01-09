import { useEffect, useState } from "react";
import classes from "./TrendingCoin.module.scss";
import axios from "axios";
interface Trending {
  coinId: string;
  image: string;
  market_cap_rank: number;
  name: string;
  price_btc: number;
  ticker: string;
  btc_price: number;
}

function TrendingCoin(props: Trending) {
  return (
    <div className={classes.container}>
      <img className={classes.image} src={props.image} alt="trending coin" />
      <span>
        <h6 className={classes.info}>Name:</h6>
        <h6>{props.name}</h6>
      </span>

      <h6 className={classes.info}>Ticker:</h6>
      <h6>{props.ticker}</h6>
      <h6 className={classes.info}>Price:</h6>
      <h6>{`$ ${(props.btc_price * props.price_btc).toFixed(2)}`}</h6>
    </div>
  );
}

export default TrendingCoin;
