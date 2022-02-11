import { useEffect, useState } from "react";
import classes from "./PortfolioData.module.scss";
import axios from "axios";
import PortfolioDataGraphLine from "./PortfolioDataGraphLine";
import PortfolioDataGraphDonut from "./PortfolioDataGraphDonut";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface Coin {
  id: string;
  name: string;
  date_purchased: number;
  differenceInDays: number;
  amount_purchased: number;
  image: string;
  purchase_price: number;
}

interface Gruops {
  id: string;
  name: string;
  image: string;
  amount_purchased: number;
}

interface CoinPrices {
  id: string;
  coinName: string;
  coinId: string;
  pricesAndDates: number[][];
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

function PortfolioData(props: {
  gruopById: Gruops[];
  purchasedCoins: Coin[];
  handleOpen(): void;
  clearAllfunds(): void;
}) {
  //Modal settings
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openModalAdd = () => {
    props.handleOpen();
  };

  const clearAssets = () => {
    props.clearAllfunds();
  };

  const [sortedCoins, setSortedCoins] = useState<Coin[]>([]);
  const [coinsPrices, setCoinsPrices] = useState<CoinPrices[] | null>(null);
  const [sortedCoinsPrices, setSortedCoinsPrices] = useState<
    CoinPrices[] | null
  >(null);
  //All invested money
  const [allFunds, setAllFunds] = useState<number[][] | null>(null);
  //Sort recived Coin Data
  useEffect(() => {
    const sorted = props.purchasedCoins.sort((a, b) => {
      return a.date_purchased - b.date_purchased;
    });
    setSortedCoins(sorted);
  }, [props.purchasedCoins]);

  //Add prices and date range from purchase to today
  useEffect(() => {
    let source = axios.CancelToken.source();
    if (sortedCoins !== undefined && sortedCoins?.length > 0) {
      setCoinsPrices(null);
      sortedCoins.map((coin, i) => {
        axios
          .get(
            `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${coin.differenceInDays}&interval=daily`,
            {
              cancelToken: source.token,
              timeout: 9000,
            }
          )
          .then((response) => {
            const responsePrices: number[][] = response.data.prices;
            const responsePricesMultyplied = responsePrices.map((price, i) => {
              return [price[0], price[1] * coin.amount_purchased];
            });
            setCoinsPrices((prevState) => {
              if (prevState) {
                return [
                  {
                    id: coin.id,
                    coinName: coin.name,
                    coinId: coin.id,
                    pricesAndDates: responsePricesMultyplied,
                  },
                  ...prevState,
                ];
              } else {
                return [
                  {
                    id: coin.id,
                    coinName: coin.name,
                    coinId: coin.id,
                    pricesAndDates: responsePricesMultyplied,
                  },
                ];
              }
            });
          })
          .catch((error) => console.log(error));
        return []; //usless to remove warning
      });
    }
    return () => {
      source.cancel("Canceling in cleanup");
    };
  }, [sortedCoins]);

  //Sort all purchased and Prices
  useEffect(() => {
    let sorted: any = [];
    if (coinsPrices)
      sorted = coinsPrices.sort((a: CoinPrices, b: CoinPrices) => {
        return b.pricesAndDates.length - a.pricesAndDates.length;
      });
    setSortedCoinsPrices(sorted);
  }, [coinsPrices]);

  //Add prices together
  useEffect(() => {
    let longestHold: number[][];
    if (
      sortedCoinsPrices !== undefined &&
      sortedCoinsPrices !== null &&
      sortedCoinsPrices.length > 0
    ) {
      longestHold = sortedCoinsPrices[0].pricesAndDates;
      setAllFunds(longestHold);
      if (sortedCoinsPrices.length > 1) {
        for (let i = 1; sortedCoinsPrices.length > i; i++) {
          let indexOfMatchingDate = longestHold.findIndex(
            (element) =>
              element[0] === sortedCoinsPrices[i].pricesAndDates[0][0]
          );
          //if it is bought today
          if (indexOfMatchingDate === -1) {
            indexOfMatchingDate = longestHold.length - 1;
          }

          const addingfunds = longestHold.map((data, j) => {
            if (j >= indexOfMatchingDate) {
              return [
                data[0],
                data[1] +
                  sortedCoinsPrices[i].pricesAndDates[
                    j - indexOfMatchingDate
                  ][1],
              ];
            } else {
              return data;
            }
          });
          longestHold = addingfunds;

          setAllFunds(longestHold);
        }
      }
    } else {
      return;
    }
  }, [sortedCoinsPrices]);

  const ModalContainer = (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h2 className={classes.title} id="modal-modal-title">
          Are you sure you want to clear all your data
        </h2>
        <button className={classes["button-clear"]} onClick={clearAssets}>
          Yes
        </button>
        <button className={classes["button-add"]} onClick={handleClose}>
          Cancel
        </button>
      </Box>
    </Modal>
  );

  const yourAssets = props.gruopById.map((coin, i) => (
    <TableRow key={coin.name + i + i}>
      <TableCell align="left">
        <div className={classes["name-image"]}>
          <img src={coin.image} alt={coin.name} />
          <h6>{coin.name}</h6>
        </div>
      </TableCell>
      <TableCell align="right">
        <h6>{coin.amount_purchased}</h6>
      </TableCell>
    </TableRow>
  ));

  const assetHistory = sortedCoins?.map((coin, i) => (
    <TableRow key={coin.date_purchased + i}>
      <TableCell align="left">
        <div className={classes["name-image"]}>
          <img src={coin.image} alt={coin.name} />
          <h4>{coin.name}</h4>
        </div>
      </TableCell>
      <TableCell align="right">
        <h6>{`${coin.amount_purchased.toLocaleString()}`}</h6>
      </TableCell>
      <TableCell align="right">
        <h6>{`${new Date(coin.date_purchased)
          .toLocaleString()
          .slice(0, 10)
          .replace(/[, ]+/g, " ")
          .trim()}`}</h6>
      </TableCell>
      <TableCell align="right">
        <h6>{`$${coin.purchase_price.toLocaleString()}`}</h6>
      </TableCell>
    </TableRow>
  ));

  return (
    <div>
      {allFunds && (
        <div className={classes.container}>
          <div>
            {ModalContainer}
            <div className={classes["small-container"]}>
              <div>
                <h4>Current Balance:</h4>
                <h1>{`$${allFunds[
                  allFunds.length - 1
                ][1].toLocaleString()}`}</h1>
              </div>
              <div>
                <button
                  className={classes["button-add"]}
                  onClick={openModalAdd}
                >
                  Add another asset
                </button>
                <button
                  className={classes["button-clear"]}
                  onClick={handleOpen}
                >
                  Clear all funds
                </button>
              </div>
            </div>
            <div className={classes["graph-container"]}>
              <div className={classes.line}>
                <h4>Assets history</h4>
                <div>
                  <PortfolioDataGraphLine allFunds={allFunds} />
                </div>
              </div>
              <div className={classes["purchase-history"]}>
                <h4>All assets</h4>
                <TableContainer>
                  <Table
                    sx={{
                      [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <TableHead></TableHead>
                    <TableBody>{yourAssets}</TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className={classes["table-container"]}>
                <h4 className={classes.subtitle}>Purchase history</h4>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell  align="left">
                          <h4 className={classes.table}>Name</h4>
                        </TableCell>
                        <TableCell align="right">
                          <h4 className={classes.table}>Amount Purchased</h4>
                        </TableCell>
                        <TableCell align="right">
                          <h4 className={classes.table}>Date Purchased</h4>
                        </TableCell>
                        <TableCell align="right">
                          <h4 className={classes.table}>Purchase Price</h4>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{assetHistory}</TableBody>
                  </Table>
                </TableContainer>
              </div>
              {sortedCoinsPrices && (
                <div className={classes.diversity}>
                  <h4>Portfolio diversity</h4>
                  <div className={classes.graph}>
                    <PortfolioDataGraphDonut gruopById={props.gruopById} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioData;
