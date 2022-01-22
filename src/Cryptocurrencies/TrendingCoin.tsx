import classes from "./TrendingCoin.module.scss";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();


  return (
    <motion.div
      onClick={() => navigate(`/cryptocurrencies/${props.coinId}`)}
      whileHover={{ y: -5 }}
      className={classes.container}
    >
      <img className={classes.image} src={props.image} alt="trending coin" />
      <span>
        <h6 className={classes.info}>Name:</h6>
        <h6 className={classes.value}>{props.name}</h6>
      </span>

      <h6 className={classes.info}>Ticker:</h6>
      <h6 className={classes.value}>{props.ticker}</h6>
      <h6 className={classes.info}>Price:</h6>
      <h6 className={classes.value}>
        ${" "}
        {props.btc_price * props.price_btc <= 0.001
          ? "0.00 <"
          : (props.btc_price * props.price_btc).toFixed(2)}
      </h6>
    </motion.div>
  );
}

export default TrendingCoin;
