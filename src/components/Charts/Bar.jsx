import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Export from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import Accessibility from "highcharts/modules/accessibility";

if (typeof window !== `undefined`) {
  Accessibility(Highcharts); // Accessibility enhancements
  Export(Highcharts); // Enable export to image
  ExportData(Highcharts); // Enable export of underlying data
}
// const colors = [
//   "#87cefa",
//   "#90ee90",
//   "#ffa07a",
//   "#f08080",
//   "rgb(176, 196, 222)",
//   "rgb(211, 211, 211)",
// ];
export default function BarCharts({
  title = "",
  width,
  data = [],
  categories = [""],
}) {
  const chartOptions = {
    chart: {
      type: "column",
      width,
    },
    title: {
      text: title,
      style: {
        fontSize: "22px",
      },
    },
    xAxis: {
      categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        style: {
          fontSize: "18px",
        },
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
      style: {
        fontSize: "18px",
      },
    },
    legend: {
      itemStyle: {
        fontSize: "16px",
      },
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: true,
      description: "A pie chart showing distribution of data.",
      keyboardNavigation: {
        enabled: true,
      },
      landmarkVerbosity: "one",
    },
    plotOptions: {
      column: {
        // stacking: "percentage",
        dataLabels: {
          enabled: true,
          inside: false,
          format: "{point.y}",
          style: {
            fontWeight: "normal",
            fontSize: "18px", // Set the data label font size
          },
        },
      },
    },
    series: data.map((item) => ({
      name: item.name,
      data: item.y,
    })),
  };

  return (
    <HighchartsReact
      immutable={true}
      highcharts={Highcharts}
      options={chartOptions}
    />
  );
}
