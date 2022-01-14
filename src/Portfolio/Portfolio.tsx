import { useCallback, useEffect, useState } from "react";
import classes from "./Portfolio.module.scss";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import axios from "axios";
import PortfolioData from "./PortfolioData";

interface SearchedCoin {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
  };
  image: {
    small: string;
  };
  market_cap_rank: number;
}

interface PurchasedCoin {
  id: string;
  name: string;
  date_purchased: number;
  differenceInDays: number;
  amount_purchased: number;
  image: string;
  purchase_price: number;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

function Portfolio() {
  //Form Data
  const [inputValue, setInputValue] = useState("");
  const [amountValue, setAmountValue] = useState(1);
  const [dateValue, setDateValue] = useState("");
  //SearchedCoin Results
  const [searchedCoin, setSetSearchedCoin] = useState<SearchedCoin | null>(
    null
  );
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [result, setResult] = useState(false);
  //Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //PurchasedCoins
  const [purchasedCoins, setPurchasedCoins] = useState<PurchasedCoin[]>([]);

  //Get data for searched Coin
  useEffect(() => {
    if (inputValue.length < 4 || inputValue.length > 15) {
      return;
    } else {
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${inputValue}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        )
        .then((response) => {
          setSetSearchedCoin(response.data);
          setResult(true);
        })
        .catch((error) => setResult(false));
    }
  }, [inputValue]);

  //Get Price for searched Coin on a ceratin date
  useEffect(() => {
    if (dateValue === "") {
      return;
    } else {
      //getting the right date format
      const date = dateValue.split(/\-/);
      const rightDateFormat = [date[2], date[1], date[0]].join("-");
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${inputValue}/history?date=${rightDateFormat}&localization=false`
        )
        .then((response) => {
          setPurchasePrice(response.data.market_data.current_price.usd);
        })
        .catch((error) => console.log(error));
    }
  }, [inputValue, dateValue]);


  //Form handeling
  const handleFormSubimt: React.FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const amount = amountValue;
    const date = dateValue;
    if (result === true && amount > 0 && Date.parse(date) <= Date.now()) {
      console.log("Form sucesfully submited");
      setOpen(false);
      setInputValue("");
      setAmountValue(1);
      setDateValue("");
      if (searchedCoin) {
        //How many days passed from purchase till todays Date
        const differenceInDays = Math.floor(
          (Date.parse(new Date().toString()) / 1000 - Date.parse(date) / 1000) /
            86400
        );
        const coin: PurchasedCoin = {
          id: searchedCoin?.id,
          name: searchedCoin?.name,
          amount_purchased: amountValue,
          date_purchased: Date.parse(date),
          differenceInDays: differenceInDays,
          image: searchedCoin.image.small,
          purchase_price: purchasePrice,
        };
        setPurchasedCoins((prevState) => {
          return [coin, ...prevState];
        });
      }
    } else {
      console.log("Bad");
    }
  };

  return (
    <div>
      <button onClick={handleOpen}>modal</button>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form onSubmit={handleFormSubimt} className={classes.form}>
              <label className={classes.label}>Coin id:</label>
              <input
                className={classes.input}
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value.toLocaleLowerCase().trim())
                }
                type="search"
                required
              ></input>
              {inputValue && result === false ? (
                <h6 className={classes.error}>Unsupported id</h6>
              ) : (
                ""
              )}
              <label className={classes.label}>Amount purchased:</label>
              <input
                className={classes.input}
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.valueAsNumber)}
                type="number"
              ></input>
              {amountValue <= 0 ? (
                <h6 className={classes.error}>Amount cant be 0</h6>
              ) : (
                ""
              )}
              <label className={classes.label}>Date Purchased:</label>
              <input
                className={classes.input}
                onChange={(e) => setDateValue(e.target.value)}
                type="date"
              ></input>
              <button className={classes.button}>Submit </button>
            </form>
          </Box>
        </Fade>
      </Modal>
      <PortfolioData purchasedCoins={purchasedCoins} />
    </div>
  );
}

export default Portfolio;
