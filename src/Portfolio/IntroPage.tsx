import { useEffect, useState } from "react";
import logo1 from "../assets/1.png";
import logo2 from "../assets/2.png";
import logo3 from "../assets/3.png";
import logo4 from "../assets/4.png";
import Portfolio from "./Portfolio";
import classes from "./IntroPage.module.scss";
function IntroPage() {
  return (
    <div>
      (
      <div className={classes.container}>
        <div>
          <h1 className={classes.title}>
            {`Free and Powerful Crypto Portfolio Tracker`}
          </h1>
          <h4 className={classes.subtitle}>
            {`Keep track of your profits, losses and portfolio valuation with our easy
        to use platform.`}
          </h4>
          <button>Get Started</button>
        </div>
        <div className={classes["about-container"]}>
          <div>
            <img src={logo1} alt="logo1" />
            <h2 className={classes["about-title"]}>Real-time price data</h2>
            <h4 className={classes.subtitle}>
              Updating 24/7 using price data from the biggest exchanges
            </h4>
          </div>
          <div>
            <img src={logo2} alt="logo2" />
            <h2 className={classes["about-title"]}>Free to use</h2>
            <h4 className={classes.subtitle}>
              Top notch crypto portfolio tracking at no cost
            </h4>
          </div>
          <div>
            <img src={logo3} alt="logo3" />
            <h2 className={classes["about-title"]}>
              Track your current portfolio balance and profit / loss
            </h2>
            <h4 className={classes.subtitle}>
              Thousands of coins and tokens available.
            </h4>
          </div>
          <div>
            <img src={logo4} alt="logo3" />
            <h2 className={classes["about-title"]}>
              Your data is safe and secure
            </h2>
            <h4 className={classes.subtitle}>
              We take data security and privacy very seriously.
            </h4>
          </div>
          <Portfolio />
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
