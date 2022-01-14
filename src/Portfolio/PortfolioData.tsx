import { useEffect, useState, useMemo } from "react";
import axios from "axios";

interface Coin {
  id: string;
  name: string;
  date_purchased: number;
  differenceInDays: number;
  amount_purchased: number;
  image: string;
  purchase_price: number;
}

interface PurchasedCoin {
  purchasedCoins: Coin[];
}

interface CoinPrices {
  id: string;
  coinName: string;
  coinId: string;
  pricesAndDates: number[][];
}

function PortfolioData(props: PurchasedCoin) {
  const [sortedCoins, setSortedCoins] = useState<Coin[]>();
  const [coinsPrices, setCoinsPrices] = useState<CoinPrices[] | null>(null);
  const [sortedCoinsPrices, setSortedCoinsPrices] = useState<
    CoinPrices[] | null
  >(null);
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
    if (sortedCoins !== undefined && sortedCoins?.length > 0) {
      setCoinsPrices(null);
      sortedCoins.map((coin, i) => {
        axios
          .get(
            `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${coin.differenceInDays}&interval=daily`
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
  console.log(allFunds);
  return <div></div>;
}

export default PortfolioData;
