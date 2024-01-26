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
        fontSize: "24px",
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
      outside: true,
      pointFormat: "{point.fullText}: <b>{point.percentage:.1f}%</b>",
      style: {
        fontSize: "20px",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name} {point.y}",
          style: {
            fontWeight: "normal",
            fontSize: "20px", // Set the data label font size
          },
        },
        showInLegend: false,
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
            fullText: item.fullText,
            y: item.y[0],
          };
        }),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}
