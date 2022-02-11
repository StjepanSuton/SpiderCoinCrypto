import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./PortfolioDataGraphDonut.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useStore } from "react-redux";
interface Gruops {
  id: string;
  name: string;
  amount_purchased: number;
}

interface Sorted {
  gruopById: Gruops[];
}

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const doughnutOptions = {
  responsive: true,
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      padding: 6,
      caretSize: 7,
      displayColors: true,
      enabled: true,
      titleFont: {
        weight: "bold",
      },
      bodyFont: {
        size: 10,
      },
      boxWidth: 10,
    },
    title: {
      display: false,
    },
  },
};
interface IdsAndPrices {
  id: string;
  name: string;
  amount_purchased: number;
  price: {
    usd: number;
  };
}
function PortfolioDataGraphDonut({ gruopById }: Sorted) {
  const [idsAndPrices, setIdsAndPrices] = useState<IdsAndPrices[]>([]);
  useEffect(() => {
    setIdsAndPrices([]);
    let source = axios.CancelToken.source();
    gruopById.map((coin, i) => {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`,
          {
            cancelToken: source.token,
            timeout: 9000,
          }
        )
        .then((response) => {
          const responseData = response.data;
          //used any so I can get the price
          setIdsAndPrices((prevState: any) => {
            if (prevState.length > 0) {
              return [
                {
                  id: coin.id,
                  name: coin.name,
                  price: Object.values(responseData)[0],
                  amount_purchased: coin.amount_purchased,
                },
                ...prevState,
              ];
            } else {
              return [
                {
                  id: coin.id,
                  name: coin.name,
                  amount_purchased: coin.amount_purchased,
                  price: Object.values(responseData)[0],
                },
              ];
            }
          });
        })

        .catch((error) => console.log(error));
    });

    return () => {
      source.cancel("Canceling in cleanup");
    };
  }, [gruopById]);

  const data = {
    labels: idsAndPrices.map((coin, i) => {
      return coin.name + " $";
    }),
    datasets: [
      {
        label: "$",
        data: idsAndPrices.map((coin, i) => {
          return coin.price.usd * coin.amount_purchased;
        }),

        backgroundColor: [
          "#ff0000a6",
          "#800000b6",
          "#807c00b6",
          "#008009b6",
          "#006980b6",
          "#0b0080b6",
          "#800077b6",
        ],
        borderColor: ["#ffffff"],
      },
    ],
  };

  return (
    <div className={classes.container}>
      <Doughnut data={data} options={doughnutOptions} />
    </div>
  );
}

export default PortfolioDataGraphDonut;
