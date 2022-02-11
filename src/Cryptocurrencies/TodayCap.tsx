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
    let source = axios.CancelToken.source();
    axios
      .get("https://api.coingecko.com/api/v3/global", {
        cancelToken: source.token,
        timeout: 9000,
      })
      .then((response) => setCap(response.data))
      .catch((error) => console.log(error));
    return () => {
      setCap(null);
      source.cancel("Canceling in cleanup");
    };
  }, []);
  return (
    <div className={classes.container}>
      <h2 className={classes.header}>
        Today's Cryptocurrency Prices by CoinSpider
      </h2>
      <h4 className={classes.subheader}>
        The global crypto market cap is{" "}
        <span>
          $ {cap && JSON.stringify(cap?.data.total_market_cap.usd).slice(0, 1)}.
          {cap && JSON.stringify(cap?.data.total_market_cap.usd).slice(1, 3)}T
        </span>
        , a{" "}
        <span
          className={
            cap && cap?.data.market_cap_change_percentage_24h_usd >= 0
              ? classes["percentage-positive"]
              : classes["percentage-negative"]
          }
        >
          {cap?.data.market_cap_change_percentage_24h_usd
            .toFixed(2)
            .replace(/-(?=\d)/, "")}
          %{" "}
          {cap && cap?.data.market_cap_change_percentage_24h_usd >= 0
            ? "increase"
            : "decrease"}
        </span>{" "}
        over the last day
      </h4>
    </div>
  );
}

export default TodayCap;
