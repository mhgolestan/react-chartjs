import React, { useEffect, useState } from "react";
import { csv } from "d3";
import uniqBy from "lodash/uniqBy";

import LineChart from "./components/Charts/LineChart";
import BarChart from "./components/Charts/BarChart";

import "./App.css";
import "./Upload.css";

const rows = (d) => {
  if (d.seriesId) {
    return {
      date: new Date(
        parseInt(d.date.substr(0, 4)),
        parseInt(d.date.substr(4, 2)) - 1,
        parseInt(d.date.substr(6, 2))
      ),
      screen: d.screen,
      seriesId: d.seriesId,
      views: Number(d.views),
    };
  }
};

function App() {
  const [fileName, setFileName] = useState("view-data.csv");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Filters' states
  const [dateFilter, setDateFilter] = useState({ gt: null, lt: null });
  const [screenFilter, setScreenFilter] = useState([]);
  const [seriesFilter, setSeriesFilter] = useState([]);

  useEffect(() => {
    csv(fileName, rows).then((data) => {
      setData(data);

      let series = [];
      uniqBy(data, "seriesId").forEach((d) => {
        series.push({ id: d.seriesId, active: false });
      });
      setSeriesFilter(series);

      let screen = [];
      uniqBy(data, "screen").forEach((d) => {
        screen.push({ id: d.screen, active: false });
      });
      setScreenFilter(screen);
    });
  }, [fileName]);

  useEffect(() => {
    let newFilteredData = data;
    if (typeof dateFilter.gt === "number") {
      newFilteredData = newFilteredData.filter(
        (d) => d.date.getTime() >= dateFilter.gt
      );
    }
    if (typeof dateFilter.lt === "number") {
      newFilteredData = newFilteredData.filter(
        (d) => d.date.getTime() <= dateFilter.lt
      );
    }

    if (screenFilter.length) {
      newFilteredData = newFilteredData.filter((d) =>
        screenFilter.find((series) => series.id === d.screen && series.active)
      );
    }

    if (seriesFilter.length) {
      newFilteredData = newFilteredData.filter((d) =>
        seriesFilter.find((series) => series.id === d.seriesId && series.active)
      );
    }

    setFilteredData([...newFilteredData]);
  }, [dateFilter, screenFilter, seriesFilter, data]);

  const fileUploadInputHandler = (e) => {
    setFileName(e.target.files[0].name);
  };

  return (
    <React.Fragment>
      <div>
        {!fileName ? (
          <div className="container">
            <div className="row">
              <div className="offset-md-3 col-md-6">
                <div className="form-group files">
                  <label></label>
                  <input
                    type="file"
                    className="form-control"
                    multiple=""
                    accept=".csv, text/csv"
                    onChange={fileUploadInputHandler}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="row filter-box">
                  <div className="col-6">
                    <p>Start date:</p>
                    <input
                      style={{ width: "100%" }}
                      type="date"
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          gt: new Date(e.target.value).setHours(0, 0, 0, 0),
                        })
                      }
                    />
                  </div>

                  <div className="col-6">
                    <p>End date:</p>
                    <input
                      style={{ width: "100%" }}
                      type="date"
                      onChange={(e) =>
                        setDateFilter({
                          ...dateFilter,
                          lt: new Date(e.target.value).setHours(
                            23,
                            59,
                            59,
                            999
                          ),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="filter-box">
                  <p>Series:</p>
                  <div className="row">
                    {seriesFilter.map((s) => (
                      <div key={s.id} className="col-6">
                        <input
                          type="checkbox"
                          id={s.id}
                          name={s.id}
                          value={s.id}
                          onChange={(e) => {
                            setSeriesFilter((prevFilter) => {
                              prevFilter.find((f) => f.id === s.id).active =
                                e.target.checked;
                              return [...prevFilter];
                            });
                          }}
                        />
                        <label htmlFor={s.id}>{s.id.replace(/-/g, " ")}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="filter-box">
                  <p>Screens:</p>
                  <div className="row">
                    {screenFilter.map((s) => (
                      <div key={s.id} className="col-6">
                        <input
                          type="checkbox"
                          id={s.id}
                          name={s.id}
                          value={s.id}
                          onChange={(e) => {
                            setScreenFilter((prevFilter) => {
                              prevFilter.find((f) => f.id === s.id).active =
                                e.target.checked;
                              return [...prevFilter];
                            });
                          }}
                        />
                        <label htmlFor={s.id}>{s.id.replace(/-/g, " ")}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="row">
                  <div className="col-12">
                    <BarChart
                      filteredData={filteredData}
                      seriesFilter={seriesFilter}
                    />
                  </div>
                  <div className="col-12">
                    <LineChart
                      filteredData={filteredData}
                      seriesFilter={seriesFilter}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
