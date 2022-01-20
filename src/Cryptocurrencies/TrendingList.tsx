import { useState, useEffect } from "react";
import classes from "./TrendingList.module.scss";
import axios from "axios";
import { motion } from "framer-motion";
import TrendingCoin from "./TrendingCoin";
import CircularProgress from "@mui/material/CircularProgress";
import { truncate } from "fs";
interface Trending {
  coins: [
    {
      item: {
        id: string;
        small: string;
        market_cap_rank: number;
        name: string;
        price_btc: number;
        symbol: string;
      };
    }
  ];
}

function TrendingList() {
  const [trending, setTrending] = useState<Trending | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();
    axios
      .get("https://api.coingecko.com/api/v3/search/trending", {
        cancelToken: source.token,
        timeout: 5000,
      })
      .then((response) => {
        setTrending(response.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
    return () => {
      setTrending(null);
      source.cancel("Canceling in cleanup");
    };
  }, []);

  const [btcPrice, setBtcPrice] = useState(0);

  useEffect(() => {
    let source = axios.CancelToken.source();
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`,
        {
          cancelToken: source.token,
          timeout: 5000,
        }
      )
      .then((response) => setBtcPrice(response.data.bitcoin.usd))
      .catch((error) => console.log(error));
    return () => {
      setBtcPrice(0);
      source.cancel("Canceling in cleanup");
    };
  }, []);

  const trendingList = trending?.coins.map((coin, i) => (
    <TrendingCoin
      key={coin.item.id}
      coinId={coin.item.id}
      image={coin.item.small}
      market_cap_rank={coin.item.market_cap_rank}
      name={coin.item.name}
      price_btc={coin.item.price_btc}
      ticker={coin.item.symbol}
      btc_price={btcPrice}
    />
  ));

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Todays tredning coins</h2>
      {loading === true ? (
        <CircularProgress />
      ) : (
        <motion.div className={classes.slider}>{trendingList}</motion.div>
      )}
    </div>
  );
}

export default TrendingList;
