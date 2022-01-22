import classes from "./WatchList.module.scss";
import TrendingList from "../Cryptocurrencies/TrendingList";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useSelector, useDispatch } from "react-redux";
import { addCoinToWatchList, RootState } from "../store/WatchListStore";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import CoinWatchList from "./CoinWatchList";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: {
    small: string;
  };
  market_cap_rank: number;
  market_data: {
    sparkline_7d: {
      price: number[];
    };
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_supply: number;
    circulating_supply: number;
    price_change_percentage_24h: number;
  };
}

function WatchList() {
  const tablet = useMediaQuery("(max-width:1024px)");
  const phone = useMediaQuery("(max-width:1024px)");

  const CoinsList = useSelector((state: RootState) => state.coins);
  const [getCoins, setGetCoins] = useState<CoinData[]>([]);
  const [clicked, setClicked] = useState(0);
  useEffect(() => {
    let source = axios.CancelToken.source();
    setGetCoins([]);
    CoinsList.map((coin, i) => {
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`,
          {
            cancelToken: source.token,
            timeout: 5000,
          }
        )
        .then((response) => {
          const responseData: CoinData = response.data;
          setGetCoins((prevState: CoinData[]) => {
            return [responseData, ...prevState];
          });
        })
        .catch((error) => console.log(error));
    });
  }, [CoinsList]);

  useMemo(() => {
    const sorted = getCoins;
    switch (clicked) {
      case 0:
        sorted.sort(
          (a: CoinData, b: CoinData) => a.market_cap_rank - b.market_cap_rank
        );
        setGetCoins(sorted);
        break;
      case 1:
        sorted.sort(
          (a: CoinData, b: CoinData) => b.market_cap_rank - a.market_cap_rank
        );
        setGetCoins(sorted);
        break;
      case 2:
        sorted.sort(
          (a: CoinData, b: CoinData) =>
            a.market_data.current_price.usd - b.market_data.current_price.usd
        );
        setGetCoins(sorted);
        break;
      case 3:
        sorted.sort(
          (a: CoinData, b: CoinData) =>
            b.market_data.current_price.usd - a.market_data.current_price.usd
        );
        setGetCoins(sorted);
        break;
      case 4:
        sorted.sort(
          (a: CoinData, b: CoinData) =>
            a.market_data.price_change_percentage_24h -
            b.market_data.price_change_percentage_24h
        );
        setGetCoins(sorted);
        break;
      case 5:
        sorted.sort(
          (a: CoinData, b: CoinData) =>
            b.market_data.price_change_percentage_24h -
            a.market_data.price_change_percentage_24h
        );
        setGetCoins(sorted);
        break;
    }
  }, [getCoins, clicked]);

  const coinListing = getCoins.map((coin, i) => (
    <CoinWatchList
      id={coin.id}
      key={coin.market_cap_rank}
      image={coin.image.small}
      symbol={coin.symbol}
      name={coin.name}
      current_price={coin.market_data.current_price.usd}
      market_cap={coin.market_data.market_cap.usd}
      market_cap_rank={coin.market_cap_rank}
      price_change_percentage_24h={coin.market_data.price_change_percentage_24h}
      circulating_supply={coin.market_data.circulating_supply}
      total_supply={coin.market_data.total_supply}
      sparkline_in_7d={coin.market_data.sparkline_7d}
    />
  ));

  return (
    <div className={classes.container}>
      <TableContainer style={{ overflow: "visible" }}>
        <Table
          stickyHeader
          style={{ overflow: "visible", position: "relative", zIndex: 0 }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <BookmarkBorderOutlinedIcon />
              </TableCell>
              <TableCell align="center">
                <h4
                  onClick={() => setClicked(clicked === 0 ? 1 : 0)}
                  className={classes.header}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {clicked === 1 ? (
                    <ArrowDropUpIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  ) : (
                    <ArrowDropDownIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  )}
                  #
                </h4>
              </TableCell>
              <TableCell align="left">
                <h4 className={classes["header-noclick"]}>Coin</h4>
              </TableCell>
              {tablet === true ? (
                ""
              ) : (
                <TableCell align="right">
                  <h4 className={classes["header-noclick"]}>Ticker</h4>
                </TableCell>
              )}
              <TableCell align="right">
                <h4
                  onClick={() => setClicked(clicked === 2 ? 3 : 2)}
                  className={classes.header}
                >
                  {clicked === 3 ? (
                    <ArrowDropUpIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  ) : (
                    <ArrowDropDownIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  )}
                  Price
                </h4>
              </TableCell>
              <TableCell align="right">
                <h4
                  onClick={() => setClicked(clicked === 4 ? 5 : 4)}
                  className={classes.header}
                >
                  {clicked === 5 ? (
                    <ArrowDropUpIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  ) : (
                    <ArrowDropDownIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  )}
                  24h%
                </h4>
              </TableCell>
              <TableCell align="right">
                <h4
                  onClick={() => setClicked(clicked === 0 ? 1 : 0)}
                  className={classes.header}
                >
                  {clicked === 1 ? (
                    <ArrowDropUpIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  ) : (
                    <ArrowDropDownIcon
                      style={{ fontSize: tablet === true ? 15 : 20 }}
                    />
                  )}
                  Market Cap
                </h4>
              </TableCell>
              {tablet === true ? (
                ""
              ) : (
                <TableCell align="center">
                  <h4 className={classes["header-noclick"]}>
                    Circulating Supply
                  </h4>
                </TableCell>
              )}
              {tablet === true ? (
                ""
              ) : (
                <TableCell align="center">
                  <h4 className={classes["header-noclick"]}>7 days</h4>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>{getCoins.length > 0 ? coinListing : ""}</TableBody>
        </Table>
        {getCoins.length <= 0 ? (
          <h1 className={classes.nocoins}>
            <BookmarkBorderOutlinedIcon style={{ fontSize: 40 }} /> Looks like
            your watchlist is empty add some coins to your watchlist first
          </h1>
        ) : (
          ""
        )}
      </TableContainer>
    </div>
  );
}

export default WatchList;
