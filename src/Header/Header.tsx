import { useEffect, useState } from "react";
import logo from "../assets/spider-coin.webp";
import classes from "./Header.module.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import HeaderSearch from "./HeaderSearch";

interface Mdata {
  data: {
    active_cryptocurrencies: number;
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_change_percentage_24h_usd: number;
  };
}

function Header() {
  const [marketdata, setMarketData] = useState<Mdata | null>(null);
  const [exchanges, setExchanges] = useState<number | null>(null);
  useEffect(() => {
    let source = axios.CancelToken.source();
    axios
      .get("https://api.coingecko.com/api/v3/global", {
        cancelToken: source.token,
        timeout: 5000,
      })
      .then((response) => setMarketData(response.data))
      .catch((error) => console.log(error));
    return () => {
      setMarketData(null);
      source.cancel("Canceling in cleanup");
    };
  }, []);

  useEffect(() => {
    let source = axios.CancelToken.source();
    axios
      .get("https://api.coingecko.com/api/v3/exchanges/list", {
        cancelToken: source.token,
        timeout: 5000,
      })
      .then((response) => setExchanges(response.data.length))
      .catch((error) => console.log(error));
    return () => {
      setExchanges(null);
      source.cancel("Canceling in cleanup");
    };
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes["small-container"]}>
        <div className={classes["smaller-container"]}>
          <h6>
            Cryptos:{" "}
            <span>{`${marketdata?.data.active_cryptocurrencies}`}</span>{" "}
          </h6>
          <h6>
            Exchanges: <span>{`${exchanges}`}</span>{" "}
          </h6>
          <h6>
            Market Cap :{" "}
            <span>{`$ ${marketdata?.data.total_market_cap.usd.toLocaleString(
              "en-IN"
            )}`}</span>{" "}
          </h6>
          <h6>
            24h Vol :{" "}
            <span>{`$ ${marketdata?.data.total_volume.usd.toLocaleString()}`}</span>{" "}
          </h6>
          <h6>
            Dominance BTC/ETH:{" "}
            <span>{`${marketdata?.data.market_cap_percentage.btc.toFixed(
              2
            )}%`}</span>{" "}
            <span>{`${marketdata?.data.market_cap_percentage.eth.toFixed(
              2
            )}%`}</span>
          </h6>
        </div>
        <div></div>
      </div>
      <div className={classes["big-container"]}>
        <div>
          <div className={classes["smaller-container"]}>
            <Link className={classes.link} to="/home">
              <img className={classes.image} src={logo} alt="spidercoinn" />
            </Link>
            <Link className={classes.link} to="/cryptocurrencies">
              <h3>Cryptocurrencies</h3>
            </Link>
            <Link className={classes.link} to="/exchanges">
              <h3>Exchanges</h3>
            </Link>
            <Link className={classes.link} to="/portfolio">
              <h3>Portfolio</h3>
            </Link>
            <Link className={classes.link} to="/watchlist">
              <h3>WatchList</h3>
            </Link>
          </div>
        </div>
        <div>
          <HeaderSearch />
        </div>
      </div>
    </div>
  );
}

export default Header;
