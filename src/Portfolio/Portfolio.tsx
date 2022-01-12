import { useEffect, useState } from "react";
import classes from "./Portfolio.module.scss";
import axios from "axios";

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
  amount_purchased: number;
  prices_by_dates: number[];
}

function Portfolio() {
  const [inputValue, setInputValue] = useState("");
  const [focus, setFocus] = useState(false);
  const [result, setResult] = useState(false);
  const [searchedCoin, setSearchedCoin] = useState<SearchedCoin | null>(null);

  const [show1, setShow1] = useState<any>();
  const [show2, setShow2] = useState<any>();
  const [value, setValue] = useState<any>(0);
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${inputValue}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      )
      .then((response) => {
        setSearchedCoin(response.data);
        setResult(true);
      })
      .catch((error) => setResult(false));
  }, [inputValue]);

  const outFocus = () => {
    setTimeout(() => {
      setFocus(false);
    }, 300);
    setInputValue("");
  };

  const handleUserInput = (e: any) => {
    //prevent to many Api calls
    if (e.target.value.length < 2) return;
    else {
      setInputValue(e.target.value);
      setFocus(true);
    }
  };

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/tether/market_chart?vs_currency=usd&days=${days}&interval=daily`
      )
      .then((response) => {
        setShow1(response.data.prices);
      })
      .catch((error) => console.log(error));
  }, [days]);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=90&interval=daily`
      )
      .then((response) => {
        setShow2(response.data.prices);
      })
      .catch((error) => console.log(error));
  }, [days]);

  const getsomething = (e: any) => {
    setValue(Date.parse(new Date(e.target.value).toString()));
  };

  //razlika u danima od danas i upisanog dana
  useEffect(() => {
    if (value !== 0) {
      setDays(
        Math.floor(
          (Date.parse(new Date().toString()) / 1000 - value / 1000) / 86400
        )
      );
    }
  }, [value]);
  /*
  console.log(
    show2 &&
      (show2 !== undefined
        ? show2.findIndex((element: any) => element[0] === show1[0][0])
        : "")
  );
  console.log(
    show2 &&
      show2[
        show2 !== undefined
          ? show2.findIndex((element: any) => element[0] === show1[0][0])
          : ""
      ]
  );
*/
  return (
    <div>
      <input
        onClick={handleUserInput}
        type="text"
        placeholder="Search crypto by id"
      ></input>
      <button>Search</button>
      {focus &&
        (result === true ? (
          <div className={classes["small-container2"]}>
            <div className={classes["small-container3"]}>
              <img
                className={classes.image}
                src={searchedCoin?.image.small}
                alt="coin"
              />
              <h4 className={classes.title}>{searchedCoin?.name}</h4>
            </div>
            <h6
              className={classes.rank}
            >{`# ${searchedCoin?.market_cap_rank}`}</h6>
          </div>
        ) : (
          <div className={classes["small-container2"]}>
            <h4 className={classes.title}>No coin under that id</h4>
          </div>
        ))}
      <input onChange={getsomething} type="date"></input>
    </div>
  );
}

export default Portfolio;
