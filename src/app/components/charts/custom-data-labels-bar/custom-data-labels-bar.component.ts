import { Component,ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexXAxis,
  ApexPlotOptions,
  ApexTooltip
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries |any;
  chart: ApexChart|any;
  xaxis: ApexXAxis|any;
  stroke: ApexStroke|any;
  dataLabels: ApexDataLabels|any;
  plotOptions: ApexPlotOptions|any;
  yaxis: ApexYAxis|any;
  tooltip: ApexTooltip|any;
  colors: string[]|any;
  title: ApexTitleSubtitle|any;
  subtitle: ApexTitleSubtitle|any;
};

@Component({
  selector: 'app-custom-data-labels-bar',
  standalone: true,
  imports: [ NgApexchartsModule],
  templateUrl: './custom-data-labels-bar.component.html',
  styleUrl: './custom-data-labels-bar.component.css'
})
export class CustomDataLabelsBarComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom"
          }
        }
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7"
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"]
        },
        formatter: function(val:any, opt:any) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        // categories: [
        //   "South Korea",
        //   "Canada",
        //   "United Kingdom",
        //   "Netherlands",
        //   "Italy",
        //   "France",
        //   "Japan",
        //   "United States",
        //   "China",
        //   "India"
        // ]
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: "Top 10 medicine",
        align: "center",
        floating: true
      },
    
      tooltip: {
        theme: "dark",
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function() {
              return "";
            }
          }
        }
      }
    };
  }
}
