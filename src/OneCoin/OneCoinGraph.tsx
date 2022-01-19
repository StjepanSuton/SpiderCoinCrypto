import { useState, useEffect, useRef } from "react";
import classes from "./OneCoinGraph.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ChartData {
  market_caps: number[][];
  prices: number[][];
  total_volumes: number[][];
}

function OneCoinGraph() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

  const options = {
    responsive: true,
    elements: {
      point: {
        radius: 1,
        hitRadius: 20,
      },
    },
    filler: {
      propagate: true,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      pointRadius: 0,
      legend: {
        display: false,
      },
      interaction: {
        mode: "index",
        intersect: false,
      },

      title: {
        display: false,
      },
    },
  };

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [days, setDays] = useState(30);
  const [category, setCategory] = useState(0);
  const { id } = useParams();
  const c: any = useRef(null);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${
          days <= 31 ? "hourly" : "daily"
        }`
      )
      .then((response) => setChartData(response.data))
      .catch((error) => console.log(error));
  }, [id, days]);
  const data = {
    labels:
      chartData && category === 0
        ? chartData?.prices.map((date, i) => {
            return new Date(date[0])
              .toLocaleString()
              .substring(0, date[0].toLocaleString().length - 10);
          })
        : chartData?.market_caps.map((date, i) => {
            return new Date(date[0])
              .toLocaleString()
              .substring(0, date[0].toLocaleString().length - 10);
          }),
    datasets: [
      {
        label: "Price in USD",
        data:
          chartData && category === 0
            ? chartData?.prices.map((price, i) => {
                return price[1];
              })
            : chartData?.market_caps.map((price, i) => {
                return price[1];
              }),
        borderColor:
          chartData &&
          chartData?.prices[0][1] >=
            chartData?.prices[chartData.prices.length - 1][1]
            ? "#ea3942d5"
            : "rgba(75, 179, 31, 0.818)",
        backgroundColor:
          chartData &&
          chartData?.prices[0][1] >=
            chartData?.prices[chartData.prices.length - 1][1]
            ? function () {
                let canvas = c.current.children[0];
                let ctx = canvas.getContext("2d");
                let color = ctx.createLinearGradient(0, 0, 0, 400);
                color.addColorStop(1, "#ea394213");
                color.addColorStop(0.5, "#ea39426e");
                color.addColorStop(0, "#ea3943");

                return color;
              }
            : function () {
                let canvas = c.current.children[0];
                let ctx = canvas.getContext("2d");
                let color = ctx.createLinearGradient(0, 0, 0, 400);
                color.addColorStop(1, "rgba(75, 179, 31, 0.112)");
                color.addColorStop(0.5, "rgba(75, 179, 31, 0.455)");
                color.addColorStop(0, "rgb(76, 179, 31)");

                return color;
              },

        fill: true,
      },
    ],
  };

  return (
    <div>
      <div className={classes.buttonbox}>
        <div>
          <button
            onClick={() => setCategory(0)}
            className={category === 0 ? classes.leftactive : classes.left}
          >
            Price
          </button>
          <button
            onClick={() => setCategory(1)}
            className={category === 1 ? classes.rightactive : classes.right}
          >
            MarketCap
          </button>
        </div>
        <div>
          <button
            onClick={() => setDays(7)}
            className={days === 7 ? classes.leftactive : classes.left}
          >
            7d
          </button>
          <button
            onClick={() => setDays(30)}
            className={days === 30 ? classes.active : classes.button}
          >
            30d
          </button>
          <button
            onClick={() => setDays(90)}
            className={days === 90 ? classes.active : classes.button}
          >
            90d
          </button>
          <button
            onClick={() => setDays(180)}
            className={days === 180 ? classes.active : classes.button}
          >
            180d
          </button>
          <button
            onClick={() => setDays(365)}
            className={days === 365 ? classes.rightactive : classes.right}
          >
            1y
          </button>
        </div>
      </div>
      <div ref={c}>
        <Line options={options} data={data} />;
      </div>
    </div>
  );
}

export default OneCoinGraph;
