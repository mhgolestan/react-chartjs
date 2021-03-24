import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./index.css";

const lineChartOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 6,
        },
        scaleLabel: {
          display: true,
          labelString: "Number of Views",
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: "Months",
        },
      },
    ],
  },
};

const LineChart = ({ filteredData, seriesFilter }) => {
  const [lineChartData, setLineChartData] = useState(null);

  useEffect(() => {
    const seriesLineChartSummary = seriesFilter
      .filter((s) => s.active)
      .map((activeSerie) => {
        const months = {
          Jan: {
            start: "01-01",
            end: "02-1",
            views: 0,
          },
          Feb: {
            start: "02-01",
            end: "03-01",
            views: 0,
          },
          Mar: {
            start: "03-01",
            end: "04-01",
            views: 0,
          },
          Apr: {
            start: "04-01",
            end: "05-01",
            views: 0,
          },
          May: {
            start: "05-01",
            end: "06-01",
            views: 0,
          },
          June: {
            start: "06-01",
            end: "07-01",
            views: 0,
          },
          July: {
            start: "07-01",
            end: "08-01",
            views: 0,
          },
          Aug: {
            start: "08-01",
            end: "09-01",
            views: 0,
          },
          Sep: {
            start: "09-01",
            end: "10-01",
            views: 0,
          },
          Oct: {
            start: "10-01",
            end: "11-01",
            views: 0,
          },
        };

        Object.keys(months).forEach((key) => {
          const month = months[key];

          filteredData
            .filter(
              (d) =>
                d.seriesId === activeSerie.id &&
                d.date.getTime() >= new Date(`2020-${month.start}`) &&
                d.date.getTime() < new Date(`2020-${month.end}`)
            )
            .forEach((d) => {
              month.views += d.views;
            });
        });

        return {
          ...activeSerie,
          views: Object.values(months).map((month) => month.views),
        };
      });

    const newLineChartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
      ],
      datasets: seriesLineChartSummary.map((serie) => {
        let color = "";
        switch (serie.id) {
          case "top-gear":
            color = "red";
            break;
          case "walking-dead":
            color = "blue";
            break;
          case "family-guy":
            color = "green";
            break;
          case "breaking-bad":
            color = "yellow";
            break;
          case "how-i-met-your-mother":
            color = "purple";
            break;
          case "game-of-thrones":
            color = "orange";
            break;

          default:
            break;
        }
        return {
          label: serie.id.replace(/-/g, " "),
          data: serie.views,
          fill: false,
          backgroundColor: color,
          borderColor: color,
        };
      }),
    };

    if (newLineChartData.labels.length)
      setLineChartData({ ...newLineChartData });
  }, [filteredData, seriesFilter]);

  return (
    <div className="line-chart-container">
      {lineChartData && (
        <Line data={lineChartData} options={lineChartOptions} />
      )}
    </div>
  );
};

export default LineChart;
