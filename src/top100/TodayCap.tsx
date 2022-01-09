import { useEffect, useState } from "react";
import classes from "./TodayCap.module.scss";
import axios from "axios";

interface Payload {
  data: {
    total_market_cap: {
      usd: number;
    };
    market_cap_change_percentage_24h_usd: number;
  };
}

function TodayCap() {
  const [cap, setCap] = useState<Payload | null>(null);
  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/global")
      .then((response) => setCap(response.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className={classes.container}>
      <h1 className={classes.header}>
        Today's Cryptocurrency Prices by CoinSpider
      </h1>
      <h3 className={classes.subheader}>
        The global crypto market cap is{" "}
        <span>
          $ {cap && JSON.stringify(cap?.data.total_market_cap.usd).slice(0, 2)}T
        </span>
        , a{" "}
        <span
          className={
            cap && cap?.data.market_cap_change_percentage_24h_usd >= 0
              ? classes["percentage-positive"]
              : classes["percentage-negative"]
          }
        >
          {" "}
          {cap?.data.market_cap_change_percentage_24h_usd.toFixed(2)}%{" "}
          {cap && cap?.data.market_cap_change_percentage_24h_usd >= 0
            ? "increase"
            : "decrease"}
        </span>{" "}
        over the last day
      </h3>
    </div>
  );
}

export default TodayCap;
