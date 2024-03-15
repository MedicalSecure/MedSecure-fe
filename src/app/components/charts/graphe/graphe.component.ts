
import { Component, ViewChild } from "@angular/core";
import {  Input } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import {
  ChartComponent,
  ApexAxisChartSeries ,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart;
  xaxis:ApexXAxis;
  dataLabels: ApexDataLabels;
  grid:  ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-graphe',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './graphe.component.html',
  styleUrl: './graphe.component.css'
})
export class GrapheComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;
  @Input() chart1options!: ChartOptions;
  @Input() chart2options!: ChartOptions;
  @Input() chart3options!: ChartOptions;
  @Input() chart4options!: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 70]
        }
      ],
      chart: {
        height: 320,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Temperature Control Record",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.4
        }
      },
      xaxis: {
        categories: ["Sun",
          "Mon" ,"Tues", "Wed", "Thur", "Fri", "Sat"
        ]
      }
    };
  }
}