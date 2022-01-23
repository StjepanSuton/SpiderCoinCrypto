import { useRef, useState } from "react";
import classes from "./PortfolioDataGraphLine.module.scss";
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
function PortfolioDataGraphLine(props: { allFunds: number[][] | null }) {
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
    maintainAspectRatio: true,
    aspectRatio: 3.5,
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
        display: false,
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
      tooltip: {
        padding: 6,
        caretSize: 7,
        displayColors: false,

        enabled: true,
        titleFont: {
          weight: "0",
        },
        boxWidth: 0.0001,
      },
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

  const c: any = useRef(null);
  const [days, setDays] = useState(30);

  const funds =
    props.allFunds &&
    props.allFunds.slice(
      props.allFunds.length - days >= 0 ? props.allFunds.length - days : 0
    );
  const data = {
    labels: funds?.map((date, i) => {
      return new Date(date[0])
        .toLocaleString()
        .slice(0, 10)
        .replace(/[, ]+/g, " ")
        .trim();
    }),
    datasets: [
      {
        label: "$",
        data: funds?.map((price) => {
          return price[1];
        }),
        backgroundColor: function () {
          let canvas = c.current.children[0];
          let ctx = canvas.getContext("2d");
          let color = ctx.createLinearGradient(0, 0, 0, 400);
          color.addColorStop(1, "#00288428");
          color.addColorStop(0.5, "#0028847e");
          color.addColorStop(0, "#002884e7");

          return color;
        },
        borderColor: "#002884",
        fill: true,
      },
    ],
  };

  return (
    <div>
      <div>
        <div className={classes.buttonbox}>
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
            onClick={() => setDays(10000)}
            className={days === 10000 ? classes.rightactive : classes.right}
          >
            Max
          </button>
        </div>
        <div ref={c}>
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioDataGraphLine;
