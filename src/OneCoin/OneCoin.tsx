import { useEffect, useState } from "react";
import classes from "./OneCoin.module.scss";
import axios from "axios";
import parse from "html-react-parser";
import { useParams } from "react-router-dom";
import CoinGeneralInfo from "./CoinGeneralInfo";
import CoinSocialInfo from "./CoinSocialInfo";
import OneCoinGraph from "./OneCoinGraph";
import CoinQuickStats from "./CoinQuickStats";

interface CoinData {
  categories: string[];
  market_cap_rank: number;
  description: {
    en: string;
  };
  genesis_date: string;
  image: {
    small: string;
  };
  links: {
    blockchain_site: string[];
    homepage: string[];
    subreddit_url: string;
    repos_url: {
      github: string[];
    };
  };
  market_data: {
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    ath: {
      usd: number;
    };
    atl: {
      usd: number;
    };
    current_price: {
      usd: number;
    };
    fully_diluted_valuation: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    circulating_supply: number;
    max_supply: number;
    total_supply: number;
  };
  name: string;

  sentiment_votes_down_percentage: number;
  sentiment_votes_up_percentage: number;
  symbol: string;
}

function OneCoin() {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false`)
      .then((response) => setCoinData(response.data))
      .catch((error) => console.log(error));
    setLoading(false);
  }, [id]);

  const generalInfo = coinData && (
    <CoinGeneralInfo
      rank={coinData?.market_cap_rank}
      image={coinData?.image.small}
      name={coinData?.name}
      ticker={coinData?.symbol}
      price={coinData?.market_data.current_price.usd}
      percentage24h={coinData?.market_data.price_change_percentage_24h}
      low24h={coinData?.market_data.low_24h.usd}
      high24h={coinData?.market_data.high_24h.usd}
      marketCap={coinData?.market_data.market_cap.usd}
      totalVolume={coinData?.market_data.total_volume.usd}
      fullyDiluted={coinData?.market_data.fully_diluted_valuation.usd}
      circulatingSupply={coinData?.market_data.circulating_supply}
      totalSupply={coinData?.market_data.total_supply}
      maxSupply={coinData?.market_data.max_supply}
    />
  );

  const socialInfo = coinData && (
    <CoinSocialInfo
      categories={coinData?.categories}
      date={coinData?.genesis_date}
      upVote={coinData?.sentiment_votes_up_percentage}
      downVote={coinData?.sentiment_votes_down_percentage}
      blockchain_site={coinData?.links.blockchain_site}
      homepage={coinData?.links.homepage}
      github={coinData?.links.repos_url.github}
      reddit={coinData.links.subreddit_url}
    />
  );

  const quickstats = coinData && (
    <CoinQuickStats
      marketCap={coinData.market_data.market_cap.usd}
      tradingVolume={coinData.market_data.total_volume.usd}
      low24h={coinData.market_data.low_24h.usd}
      high24h={coinData.market_data.high_24h.usd}
      rank={coinData.market_cap_rank}
      ath={coinData.market_data.ath.usd}
      atl={coinData.market_data.atl.usd}
      ticker={coinData.symbol}
    />
  );

  return (
    <div className={classes.container}>
      <div className={classes["general-info"]}>
        {generalInfo}
        {socialInfo}
        <OneCoinGraph />
        {quickstats}
      </div>
    </div>
  );
}

export default OneCoin;
