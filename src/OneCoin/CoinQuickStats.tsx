import React from "react";
import classes from "./CoingQuickStats.module.scss";

interface QuickStats {
  ticker: string;
  marketCap: number;
  tradingVolume: number;
  low24h: number;
  high24h: number;
  rank: number;
  ath: number;
  atl: number;
}

function CoinQuickStats(props: QuickStats) {
  return (
    <div className={classes.big}>
      <div className={classes.container}>
        <h2
          className={classes.title}
        >{`${props.ticker.toLocaleUpperCase()} Market Stats:`}</h2>
        <div className={classes["small-container"]}>
          <h4 className={classes.subtitle}>Symbol:</h4>
          <h4 className={classes.value}>{`${props.ticker}`}</h4>
        </div>
        <div className={classes["small-container"]}>
          <h4 className={classes.subtitle}>All time high:</h4>
          <h4 className={classes.value}>{`$ ${
            props.ath &&
            props.ath.toLocaleString("en-IN", {
              maximumSignificantDigits: 6,
              maximumFractionDigits: 0,
            })
          }`}</h4>
        </div>
        <div className={classes["small-container"]}>
          <h4 className={classes.subtitle}>All time low:</h4>
          <h4 className={classes.value}>{`$ ${
            props.atl &&
            props.atl.toLocaleString("en-IN", {
              maximumSignificantDigits: 6,
              maximumFractionDigits: 0,
            })
          }`}</h4>
        </div>
        <div className={classes["small-container"]}>
          <h4 className={classes.subtitle}>24h low/high</h4>
          <h4 className={classes.value}>{`$ ${
            props.low24h &&
            props.low24h.toLocaleString("en-IN", {
              maximumSignificantDigits: 6,
              maximumFractionDigits: 0,
            })
          }/${
            props.high24h &&
            props.high24h.toLocaleString("en-IN", {
              maximumSignificantDigits: 6,
              maximumFractionDigits: 0,
            })
          } `}</h4>
        </div>
        <div className={classes["small-container"]}>
          <h4 className={classes.subtitle}>Market Cap:</h4>
          <h4 className={classes.value}>{`$ ${
            props.marketCap &&
            props.marketCap.toLocaleString("en-IN", {
              maximumSignificantDigits: 6,
              maximumFractionDigits: 0,
            })
          }`}</h4>
        </div>
        <div className={classes["small-container"]}>
          <h4 className={classes.subtitle}>Trading Volume:</h4>
          <h4 className={classes.value}>{`$ ${
            props.tradingVolume &&
            props.tradingVolume.toLocaleString("en-IN", {
              maximumSignificantDigits: 6,
              maximumFractionDigits: 0,
            })
          }`}</h4>
        </div>
        <div className={classes["small-container"]}>
          <h4 className={classes.subtitle}>Rank:</h4>
          <h4 className={classes.value}>{`${
            props.rank &&
            props.rank.toLocaleString("en-IN", {
              maximumSignificantDigits: 6,
              maximumFractionDigits: 0,
            })
          }`}</h4>
        </div>
      </div>
    </div>
  );
}

export default CoinQuickStats;
