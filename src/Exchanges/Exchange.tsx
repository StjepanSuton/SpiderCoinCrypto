import { useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import classes from "./Exchange.module.scss";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
interface Exchanges {
  id: string;
  name: string;
  country: string;
  year_established: number;
  url: string;
  image: string;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  width: 100,
  marginLeft: 16,
  marginRight: 16,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 300 : 900],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#4c7233" : "#308fe8",
  },
}));

function Exchange(props: Exchanges) {

  let navigate = useNavigate();
  
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  useEffect(() => {
    let source = axios.CancelToken.source();
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false
  `,
        {
          cancelToken: source.token,
          timeout: 5000,
        }
      )
      .then((response) =>
        setBtcPrice(response.data.market_data.current_price.usd)
      )
      .catch((error) => console.log(error));
    return () => {
      setBtcPrice(null);
      source.cancel("Canceling in cleanup");
    };
  }, []);

  const getLink = (): void => {
    window.location.href = props.url;
  };

  return (
    <TableRow className={classes.row} onClick={getLink} key={props.id}>
      <TableCell align="center">
        <span className={classes.rank}>{props.trust_score_rank}</span>
      </TableCell>

      <TableCell align="left">
        <div className={classes["name-container"]}>
          <img className={classes.image} src={props.image} />
          <span className={classes.name}>{props.name}</span>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className={classes["trust-container"]}>
          <span className={classes.numbers}>1</span>
          <BorderLinearProgress
            variant="determinate"
            value={props.trust_score * 10}
          />{" "}
          <span className={classes.numbers}>10</span>
        </div>
      </TableCell>
      <TableCell align="right">
        <span className={classes.numbers}>
          {`${props.trade_volume_24h_btc.toFixed(2)}`}
        </span>
      </TableCell>
      <TableCell align="right">
        <span className={classes.numbers}>
          {btcPrice &&
            `$ ${(
              props.trade_volume_24h_btc_normalized * btcPrice
            ).toLocaleString()}`}
        </span>
      </TableCell>
      <TableCell align="right">
        <span className={classes.numbers}>
          {props.year_established === null
            ? "Unkonown"
            : props.year_established}
        </span>
      </TableCell>
    </TableRow>
  );
}

export default Exchange;
