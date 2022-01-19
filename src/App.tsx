import Top100 from "./Cryptocurrencies/Top100";
import classes from "./App.module.scss";
import Header from "./Header/Header";
import { Routes, Route } from "react-router-dom";
import OneCoin from "./OneCoin/OneCoin";
import { useSelector } from "react-redux";
import ExchangesList from "./Exchanges/ExchangesList";
import IntroPage from "./Portfolio/IntroPage";
import WatchList from "./WatchList/WatchList";

function App() {
  return (
    <div className={classes.container}>
      <Header />
      <Routes>
        <Route path={"/cryptocurrencies/"} element={<Top100 />} />
        <Route path={`/cryptocurrencies/:id`} element={<OneCoin />} />
        <Route path={"/exchanges/"} element={<ExchangesList />} />
        <Route path={`/portfolio`} element={<IntroPage />} />
        <Route path={`/watchlist`} element={<WatchList />} />
      </Routes>
    </div>
  );
}

export default App;
