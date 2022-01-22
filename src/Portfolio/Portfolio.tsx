import { useEffect, useState } from "react";
import classes from "./Portfolio.module.scss";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import PortfolioData from "./PortfolioData";
import HelpIcon from "@mui/icons-material/Help";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
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

interface GroupedCoin {
  id: string;
  name: string;
  image: string;
  amount_purchased: number;
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

function Portfolio(props: {
  refresh: number;
  showIntro: boolean;
  introHandler(event: boolean): void;
}) {
  //Modal settings
  const phone = useMediaQuery("(max-width:550px)");

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: phone === true ? 300 : 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
  };

  //Popover Settings
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseed = () => {
    setAnchorEl(null);
  };
  const opened = Boolean(anchorEl);
  const id = opened ? "simple-popover" : undefined;
  //Form Data
  const [inputValue, setInputValue] = useState("");
  const [amountValue, setAmountValue] = useState(1);
  const [dateValue, setDateValue] = useState("");
  //SearchedCoin Results
  const [searchedCoin, setSetSearchedCoin] = useState<SearchedCoin | null>(
    null
  );
  //Group by Id
  const [gruopById, setGroupById] = useState<GroupedCoin[]>([]);

  const [purchasePrice, setPurchasePrice] = useState(0);
  const [result, setResult] = useState(false);
  //Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (props.refresh === 0) return;
    setOpen(true);
  }, [props.refresh]);

  //PurchasedCoins
  const [purchasedCoins, setPurchasedCoins] = useState<PurchasedCoin[]>([]);
  useEffect(() => {
    if (purchasedCoins.length > 0) props.introHandler(false);
  }, [purchasedCoins, props.introHandler]);
  //Loading
  const [loading, setLoading] = useState(false);

  //Get data for searched Coin
  useEffect(() => {
    let source = axios.CancelToken.source();
    if (inputValue.length < 4 || inputValue.length > 35) {
      return;
    } else {
      setLoading(true);
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${inputValue}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
          {
            cancelToken: source.token,
            timeout: 5000,
          }
        )
        .then((response) => {
          setSetSearchedCoin(response.data);
          setResult(true);
        })
        .catch((error) => setResult(false));
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    return () => {
      setSetSearchedCoin(null);
      source.cancel("Canceling in cleanup");
    };
  }, [inputValue]);

  //Get Price for searched Coin on a ceratin date
  useEffect(() => {
    let source = axios.CancelToken.source();
    if (dateValue === "") {
      return;
    } else {
      //getting the right date format
      const date = dateValue.split(/\-/);
      const rightDateFormat = [date[2], date[1], date[0]].join("-");
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${inputValue}/history?date=${rightDateFormat}&localization=false`,
          {
            cancelToken: source.token,
            timeout: 5000,
          }
        )
        .then((response) => {
          setPurchasePrice(response.data.market_data.current_price.usd);
        })
        .catch((error) => console.log(error));
    }
    return () => {};
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
        if (gruopById.length > 0) {
          if (gruopById.find((element) => element.id === coin.id)) {
            const grouped = gruopById.map((c, i) => {
              if (c.name === coin.name) {
                return {
                  id: c.id,
                  name: c.name,
                  image: searchedCoin.image.small,
                  amount_purchased: c.amount_purchased + coin.amount_purchased,
                };
              } else {
                return c;
              }
            });
            setGroupById(grouped);
          } else {
            setGroupById((prevState) => {
              return [
                {
                  id: coin.id,
                  name: coin.name,
                  image: searchedCoin.image.small,
                  amount_purchased: coin.amount_purchased,
                },
                ...prevState,
              ];
            });
          }
        } else {
          setGroupById([
            {
              id: coin.id,
              name: coin.name,
              image: searchedCoin.image.small,
              amount_purchased: coin.amount_purchased,
            },
          ]);
        }
      }
    } else {
      console.log("Bad");
    }
  };

  const clearAllfunds = () => {
    setGroupById([]);
    setPurchasedCoins([]);
    props.introHandler(true);
  };

  return (
    <div>
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
              <div className={classes.helper}>
                <button
                  type="button"
                  aria-describedby={id}
                  onMouseEnter={handleClick}
                >
                  <HelpIcon />
                </button>
                <Popover
                  id={id}
                  open={opened}
                  anchorEl={anchorEl}
                  onClose={handleCloseed}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <p className={classes.paragraph}>
                    <button className={classes.x} onClick={handleCloseed}>
                      x
                    </button>
                    Due to the limitations of the API the "Coin id" must be
                    typed in correctly. For the list of supported ids visit the
                    link:
                    <Link to={"/allcoinslist"}>AllCoinsList</Link>
                  </p>
                </Popover>
              </div>
              <label className={classes.label}>Coin id:</label>

              <div className={classes["small-container"]}>
                <input
                  className={classes.input}
                  onBlur={(e) =>
                    setInputValue(e.target.value.toLocaleLowerCase().trim())
                  }
                  type="search"
                  required
                ></input>
                {loading && <CircularProgress size={20} color="inherit" />}
              </div>
              {inputValue && result === false ? (
                <h6 className={classes.error}>Unsupported id</h6>
              ) : (
                ""
              )}
              {inputValue && result === true ? (
                <h6 className={classes.success}>Supported id</h6>
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
              {dateValue && Date.parse(dateValue) > Date.now() ? (
                <h6 className={classes.error}>
                  You cannot buy from the future
                </h6>
              ) : (
                ""
              )}
              <button className={classes.button}>Submit </button>
            </form>
          </Box>
        </Fade>
      </Modal>
      {props.showIntro === false ? (
        <PortfolioData
          clearAllfunds={clearAllfunds}
          gruopById={gruopById}
          handleOpen={handleOpen}
          purchasedCoins={purchasedCoins}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Portfolio;
