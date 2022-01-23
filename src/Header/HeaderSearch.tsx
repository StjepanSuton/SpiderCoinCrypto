import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./HeaderSearch.module.scss";
import axios from "axios";
import HelpIcon from "@mui/icons-material/Help";
import Popover from "@mui/material/Popover";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
interface CoinsSimple {
  id: string;
  symbol: string;
  name: string;
  image: {
    small: string;
  };
  market_cap_rank: number;
}

function HeaderSearch() {
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

  const navigate = useNavigate();

  const [inputValueSearch, setInputValueSearch] = useState("");
  const [focusSearch, setFocusSearch] = useState(false);
  const [resultSearch, setResultSearch] = useState(false);
  const [coinName, setCoinName] = useState<CoinsSimple | null>(null);
  useEffect(() => {
    let source = axios.CancelToken.source();
    if (inputValueSearch.length > 2)
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${inputValueSearch}?tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
          {
            cancelToken: source.token,
            timeout: 5000,
          }
        )
        .then((response) => {
          setCoinName(response.data);
          setResultSearch(true);
        })
        .catch((error) => setResultSearch(false));
    return () => {
      source.cancel("Canceling in cleanup");
    };
  }, [inputValueSearch]);

  const outFocusSearch = () => {
    setTimeout(() => {
      setFocusSearch(false);
    }, 300);
    setInputValueSearch("");
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFocusSearch(true);
    setInputValueSearch(e.target.value);
  };

  const getLink = (): void => {
    if (coinName) navigate(`/cryptocurrencies/${coinName?.id}`);
  };

  return (
    <div className={classes.container} onBlur={outFocusSearch}>
      <div className={classes["small-container"]}>
        <SearchIcon />
        <motion.input
          transition={{ duration: 0.5 }}
          whileFocus={{ width: 250 }}
          className={classes.input}
          value={inputValueSearch}
          onChange={handleUserInput}
          placeholder="Search crypto by id"
          type="text"
        ></motion.input>
        <div className={classes.helper}>
          <button type="button" aria-describedby={id} onClick={handleClick}>
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
              Due to the limitations of the API the "Coin id" must be typed in
              correctly. For the list of supported ids visit the link:{" "}
              <Link target="_blank" to={"/allcoinslist"}>
                AllCoinsList
              </Link>
            </p>
          </Popover>
        </div>
      </div>
      {focusSearch &&
        (resultSearch === true ? (
          <div
            key={coinName?.image.small}
            onClick={getLink}
            className={classes["small-container2"]}
          >
            <div className={classes["small-container3"]}>
              <img
                className={classes.image}
                src={coinName?.image.small}
                alt="coin"
              />
              <h4 className={classes.title}>{coinName?.name}</h4>
            </div>
            <h6 className={classes.rank}>{`# ${coinName?.market_cap_rank}`}</h6>
          </div>
        ) : (
          <div className={classes["small-container2"]}>
            <h4 className={classes.title}>No coin under that id</h4>
          </div>
        ))}
    </div>
  );
}

export default HeaderSearch;
