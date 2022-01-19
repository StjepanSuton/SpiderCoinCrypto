import { useState } from "react";
import logo from "../assets/Intro.png";
import TimelineIcon from "@mui/icons-material/Timeline";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import BarChartIcon from "@mui/icons-material/BarChart";
import SecurityIcon from "@mui/icons-material/Security";
import Portfolio from "./Portfolio";
import classes from "./IntroPage.module.scss";
function IntroPage() {
  const [refresh, doRefresh] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const introHandler = (event:boolean) => {
    setShowIntro(event);
  };

  return (
    <div>
      {showIntro && (
        <div className={classes.container}>
          <div className={classes["title-container"]}>
            <div>
              <h2 className={classes.uptitle}>{`Try it out today`}</h2>
              <h1 className={classes.title}>
                {`Free and Powerful Crypto Portfolio Tracker`}
              </h1>
              <h4 className={classes.subtitle}>
                {`Keep track of your profits, losses and portfolio valuation with our easy
        to use platform.`}
              </h4>
            </div>
            <div>
              <button
                onClick={() => doRefresh((prev) => prev + 1)}
                className={classes.button}
              >
                Get Started
              </button>
              <button
                onClick={() => doRefresh((prev) => prev + 1)}
                className={classes.button2}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className={classes["about-container"]}>
            <div>
              <TimelineIcon style={{ color: "#132b56", fontSize: 100 }} />
              <h2 className={classes["about-title"]}>Real-time price data</h2>
              <h4>Updating 24/7 using price data from the biggest exchanges</h4>
            </div>
            <div>
              <MoneyOffIcon style={{ color: "#1a5613", fontSize: 100 }} />
              <h2 className={classes["about-title"]}>Free to use</h2>
              <h4>Top notch crypto portfolio tracking at no cost</h4>
            </div>
            <div>
              <BarChartIcon style={{ color: "#135651", fontSize: 100 }} />
              <h2 className={classes["about-title"]}>Track your portfolio</h2>
              <h4>Thousands of coins and tokens available.</h4>
            </div>
            <div>
              <SecurityIcon style={{ color: "#561351", fontSize: 100 }} />
              <h2 className={classes["about-title"]}>
                Your data is safe and secure
              </h2>
              <h4>We take data security and privacy very seriously.</h4>
            </div>
          </div>
        </div>
      )}
      <Portfolio showIntro={showIntro} introHandler={introHandler} refresh={refresh} />
    </div>
  );
}

export default IntroPage;
