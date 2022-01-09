import { useEffect, useState } from "react";
import logo from "../assets/spider-coin.webp";
import classes from "./Header.module.scss";
import axios from "axios";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Link } from "react-router-dom";
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
    axios
      .get("https://api.coingecko.com/api/v3/global")
      .then((response) => setMarketData(response.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/exchanges/list")
      .then((response) => setExchanges(response.data.length))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes["small-container"]}>
        <div className={classes["smaller-container"]}>
          <h6>{`Cryptos: ${marketdata?.data.active_cryptocurrencies} `}</h6>
          <h6>{`Exchanges: ${exchanges} `}</h6>
          <h6>{`Market Cap : $ ${marketdata?.data.total_market_cap.usd.toLocaleString(
            "en-IN"
          )} `}</h6>
          <h6>{`24h Vol: $ ${marketdata?.data.total_volume.usd.toLocaleString(
            "en-IN"
          )} `}</h6>
          <h6>{`Dominance: BTC: ${marketdata?.data.market_cap_percentage.btc.toFixed(
            2
          )}% ETH: ${marketdata?.data.market_cap_percentage.eth.toFixed(
            2
          )}% `}</h6>
        </div>
        <div>
          <DarkModeIcon />
        </div>
      </div>
      <span className={classes.border}></span>
      <div className={classes["big-container"]}>
        <div>
          <div className={classes["smaller-container"]}>
            <Link className={classes.link} to="/home">
              <img className={classes.image} src={logo} alt="spidercoinn" />
            </Link>
            <Link className={classes.link} to="/cryptocurrencies">
              <h3>Cryptocurrencies</h3>
            </Link>
            <Link className={classes.link} to="/Exchanges">
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
          <TextField
            label="Search"
            margin="normal"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { fontSize: 12 } }} // font size of input label
          />
        </div>
      </div>
      <span className={classes.border}></span>
    </div>
  );
}

export default Header;
