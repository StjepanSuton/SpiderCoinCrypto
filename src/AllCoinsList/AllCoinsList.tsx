import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./AllCoinsList.module.scss";
interface Coin {
  id: string;
  name: string;
  symbol: string;
}

function AllCoinsList() {
  const [allCoins, setAllCoins] = useState<Coin[] | null>(null);
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  //https://api.coingecko.com/api/v3/coins/list?include_platform=false

  useEffect(() => {
    let source = axios.CancelToken.source();
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/list?include_platform=false`,
        {
          cancelToken: source.token,
          timeout: 5000,
        }
      )
      .then((response) => setAllCoins(response.data))
      .catch((error) => console.log(error));
    return () => {
      setAllCoins(null);
      source.cancel("Canceling in cleanup");
    };
  }, []);

  const formHandler: React.FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSearchTerm(value);
    setValue("");
  };

  const listAllCoins =
    allCoins &&
    allCoins
      ?.filter((coin) => {
        if (searchTerm === "") {
          return;
        } else if (coin.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return coin;
        }
      })
      .map((coin) => (
        <div key={coin.id} className={classes["coin-container"]}>
          <div>
            <h6 className={classes.subtitle}>Name:</h6>
            <h6> {coin.name}</h6>
          </div>
          <div>
            <h6 className={classes.subtitle}>Symbol:</h6>
            <h6>{coin.symbol}</h6>
          </div>
          <div>
            <h6 className={classes.subtitle}>Id:</h6>
            <h6>{coin.id}</h6>
          </div>
        </div>
      ));

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>List of all supported cryptocurencies</h2>
      <form onSubmit={formHandler}>
        <input
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Search crypto by name"
          type="text"
        ></input>
        <button>Search</button>
      </form>
      {searchTerm === "" ? (
        <h4>
          Type something in the input field and click "Search" to search for
          your wanted coin
        </h4>
      ) : (
        <div className={classes["list-container"]}>{listAllCoins}</div>
      )}
    </div>
  );
}

export default AllCoinsList;
