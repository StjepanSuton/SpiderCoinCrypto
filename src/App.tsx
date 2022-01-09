import Top100 from "./top100/Top100";
import classes from "./App.module.scss";
import Header from "./header/Header";
import { Routes, Route, useParams } from "react-router-dom";
import OneCoin from "./OneCoin/OneCoin";
import { useSelector } from "react-redux";

function App() {
  const coinLinks = useSelector((state) => state);

  return (
    <div className={classes.container}>
      <Header />
      <Routes>
        <Route path="/cryptocurrencies/" element={<Top100 />} />
        <Route path={`/cryptocurrencies/:id`} element={<OneCoin />} />
      </Routes>
    </div>
  );
}

export default App;
