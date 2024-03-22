import { Component, ViewChild ,Input, OnInit, OnChanges} from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
export type ChartOptions = {
  series: ApexNonAxisChartSeries |any;
  chart: ApexChart|any;
  labels: string[]|any;
  colors: string[]|any;
  legend: ApexLegend|any;
  plotOptions: ApexPlotOptions|any;
  responsive: ApexResponsive | ApexResponsive[]|any;
};
@Component({
  selector: 'app-tricheckcircle-progress',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './tricheckcircle-progress.component.html',
  styleUrl: './tricheckcircle-progress.component.css'
})
export class TriCheckCircleProgressComponent implements OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @Input() checkin!: number ;
  @Input() checkout!: number ;
  @Input() register!: number;

  constructor() {
  }
  ngOnChanges() {
    this.chartOptions = {
      series: [this.checkin, this.checkout, this.register], 
      chart: {
        height: 390,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ["#ff0000", "#32cd32", "#4169e1"], 
      labels: ["Check-in", "Check-out", "Registered"], 
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        formatter: function(seriesName:any, opts:any) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }
}