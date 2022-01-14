import { useEffect, useState } from "react";
import classes from "./ExchangesList.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Exchange from "./Exchange";

interface ExchangeData {
  id: string;
  name: string;
  image: string;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
  country: string;
  year_established: number;
  url: string;
}

function ExchangesList() {
  const [exchangeData, setExchangeData] = useState<ExchangeData[] | null>(null);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/exchanges?per_page=100")
      .then((response) => setExchangeData(response.data))
      .catch((error) => console.log(error));
  }, []);

  
  const exchangeList =
    exchangeData &&
    exchangeData.map((exchange, i) => (
      <Exchange
        key={exchange.id}
        id={exchange.id}
        name={exchange.name}
        country={exchange.country}
        year_established={exchange.year_established}
        url={exchange.url}
        image={exchange.image}
        trust_score={exchange.trust_score}
        trust_score_rank={exchange.trust_score_rank}
        trade_volume_24h_btc={exchange.trade_volume_24h_btc}
        trade_volume_24h_btc_normalized={exchange.trade_volume_24h_btc}
      />
    ));

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>
        Top Cryptocurrency Exchanges Ranking by Trust Score
      </h2>
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
                <h4>#</h4>
              </TableCell>
              <TableCell align="left">
                <h4>Name</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Trust Score</h4>
              </TableCell>
              <TableCell align="right">
                <h4>Trade Volume btc</h4>
              </TableCell>
              <TableCell align="right">
                <h4>Trade Volume Normalized</h4>
              </TableCell>
              <TableCell align="right">
                <h4>Year Established</h4>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{exchangeList}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ExchangesList;
