import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import React from "react";

export default function PieCharts({
  title = [],
  data = [],
  categories = [""],
}) {
  const chartOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: title,
      style: {
        fontSize: "22px",
      },
    },
    credits: {
      enabled: false,
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
      pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>",
      style: {
        fontSize: "18px",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.y}",
          style: {
            fontWeight: "normal",
            fontSize: "18px", // Set the data label font size
          },
        },
        showInLegend: true,
      },
    },
    legend: {
      itemStyle: {
        fontSize: "16px",
      },
    },
    series: [
      {
        colorByPoint: true,
        data: data.map((item) => {
          return {
            name: item.name,
            y: item.y[0],
          };
        }),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
