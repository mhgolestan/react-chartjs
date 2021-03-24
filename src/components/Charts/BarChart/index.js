import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./index.css";

const initialData = {
  labels: [],
  datasets: [
    {
      label: "# of TV views",
      data: [],
      backgroundColor: "rgb(255, 99, 132)",
    },
    {
      label: "# of Desktop views",
      data: [],
      backgroundColor: "rgb(54, 50, 150)",
    },
    {
      label: "# of Tablet views",
      data: [],
      backgroundColor: "rgb(54, 162, 235)",
    },
    {
      label: "# of Mobile views",
      data: [],
      backgroundColor: "rgb(75, 192, 192)",
    },
  ],
};

const barChartOptions = {
  scales: {
    yAxes: [
      {
        stacked: true,
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
          labelString: "Series Names",
        },
      },
    ],
  },
};

const BarChart = ({ filteredData, seriesFilter }) => {
  const [barChartData, setBarChartData] = useState(initialData);

  useEffect(() => {
    const activeSeriesData = seriesFilter
      .filter((s) => s.active)
      .map((activeSerie) => {
        let tv = 0;
        filteredData
          .filter((d) => d.seriesId === activeSerie.id && d.screen === "tv")
          .forEach((d) => {
            tv += d.views;
          });

        let desktop = 0;
        filteredData
          .filter(
            (d) => d.seriesId === activeSerie.id && d.screen === "desktop"
          )
          .forEach((d) => {
            desktop += d.views;
          });

        let tablet = 0;
        filteredData
          .filter((d) => d.seriesId === activeSerie.id && d.screen === "tablet")
          .forEach((d) => {
            tablet += d.views;
          });

        let mobile = 0;
        filteredData
          .filter((d) => d.seriesId === activeSerie.id && d.screen === "mobile")
          .forEach((d) => {
            mobile += d.views;
          });

        return {
          ...activeSerie,
          views: { tv, desktop, tablet, mobile },
        };
      });

    const newBarChartData = {
      labels: activeSeriesData.map((s) => s.id.replace(/-/g, " ")),
      datasets: [
        {
          label: "# of TV views",
          data: activeSeriesData.map((s) => s.views.tv),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "# of Desktop views",
          data: activeSeriesData.map((s) => s.views.desktop),
          backgroundColor: "rgb(54, 50, 150)",
        },
        {
          label: "# of Tablet views",
          data: activeSeriesData.map((s) => s.views.tablet),
          backgroundColor: "rgb(54, 162, 235)",
        },
        {
          label: "# of Mobile views",
          data: activeSeriesData.map((s) => s.views.mobile),
          backgroundColor: "rgb(75, 192, 192)",
        },
      ],
    };

    if (newBarChartData.labels.length) setBarChartData({ ...newBarChartData });
  }, [filteredData, seriesFilter]);

  return (
    <div className="bar-chart-container">
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  );
};

export default BarChart;
