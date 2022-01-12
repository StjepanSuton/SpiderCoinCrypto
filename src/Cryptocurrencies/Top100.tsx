import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import classes from "./Top100.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Coins from "./Coins";
import TodayCap from "./TodayCap";
import TrendingList from "./TrendingList";

function Top100() {
  const [top100, setTop100] = useState([]);
  const [clicked, setClicked] = useState(0);
  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h%2C7d        "
      )
      .then((response) => setTop100(response.data))
      .catch((error) => console.log(error));
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

  const coinList = top100.map((coin: Coin) => (
    <Coins
      id={coin.id}
      key={coin.market_cap_rank}
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
        <TableContainer style={{ overflow: "visible" }}>
          <Table stickyHeader>
            {/*{
              [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
              },
            }*/}
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <h4
                    onClick={() => setClicked(clicked === 0 ? 1 : 0)}
                    className={classes.header}
                  >
                    #
                  </h4>
                </TableCell>
                <TableCell align="left">
                  <h4 className={classes["header-noclick"]}>Coin</h4>
                </TableCell>
                <TableCell align="right">
                  <h4 className={classes["header-noclick"]}>Ticker</h4>
                </TableCell>
                <TableCell align="right">
                  <h4
                    onClick={() => setClicked(clicked === 2 ? 3 : 2)}
                    className={classes.header}
                  >
                    Price
                  </h4>
                </TableCell>
                <TableCell align="right">
                  <h4
                    onClick={() => setClicked(clicked === 4 ? 5 : 4)}
                    className={classes.header}
                  >
                    24h%
                  </h4>
                </TableCell>
                <TableCell align="right">
                  <h4
                    onClick={() => setClicked(clicked === 0 ? 1 : 0)}
                    className={classes.header}
                  >
                    Market Cap
                  </h4>
                </TableCell>
                <TableCell align="center">
                  <h4 className={classes["header-noclick"]}>
                    Circulating Supply
                  </h4>
                </TableCell>
                <TableCell align="center">
                  <h4 className={classes["header-noclick"]}>7 days</h4>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{coinList}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Top100;
