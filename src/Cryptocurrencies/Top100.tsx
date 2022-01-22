import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import classes from "./Top100.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CircularProgress from "@mui/material/CircularProgress";
import Coins from "./Coins";
import TodayCap from "./TodayCap";
import TrendingList from "./TrendingList";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Coin {
  id: string;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  sparkline_in_7d: {
    price: number[];
  };
}

function Top100() {
  const tablet = useMediaQuery("(max-width:1024px)");
  const phone = useMediaQuery("(max-width:1024px)");

  const [top100, setTop100] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    let source = axios.CancelToken.source();
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h%2C7d",
        {
          cancelToken: source.token,
          timeout: 5000,
        }
      )
      .then((response) => {
        setTop100(response.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));

    return () => {
      setTop100([]);
      source.cancel("Canceling in cleanup");
    };
  }, []);
  useMemo(() => {
    const sorted = top100;
    switch (clicked) {
      case 0:
        sorted.sort(
          (a: Coin, b: Coin) => a.market_cap_rank - b.market_cap_rank
        );
        setTop100(sorted);
        break;
      case 1:
        sorted.sort(
          (a: Coin, b: Coin) => b.market_cap_rank - a.market_cap_rank
        );
        setTop100(sorted);
        break;
      case 2:
        sorted.sort((a: Coin, b: Coin) => a.current_price - b.current_price);
        setTop100(sorted);
        break;
      case 3:
        sorted.sort((a: Coin, b: Coin) => b.current_price - a.current_price);
        setTop100(sorted);
        break;
      case 4:
        sorted.sort(
          (a: Coin, b: Coin) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h
        );
        setTop100(sorted);
        break;
      case 5:
        sorted.sort(
          (a: Coin, b: Coin) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        );
        setTop100(sorted);
        break;
    }
  }, [top100, clicked]);

  const coinList = top100.map((coin: Coin, i) => (
    <Coins
      id={coin.id}
      key={coin.id + i}
      image={coin.image}
      symbol={coin.symbol}
      name={coin.name}
      current_price={coin.current_price}
      market_cap={coin.market_cap}
      market_cap_rank={coin.market_cap_rank}
      price_change_percentage_24h={coin.price_change_percentage_24h}
      circulating_supply={coin.circulating_supply}
      total_supply={coin.total_supply}
      sparkline_in_7d={coin.sparkline_in_7d}
    />
  ));

  return (
    <div>
      <div className={classes.container}>
        <TrendingList />
        <TodayCap />
        {loading === true ? (
          <CircularProgress />
        ) : (
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
              <TableBody>{coinList}</TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

export default Top100;
