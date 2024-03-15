import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {  ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};



@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [HttpClientModule ,CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit  {
  Temperature!: number ;
  Humidity!: number;

  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
   this.getData();
  }

  private readonly baseUrl = 'https://api.thingspeak.com/channels/2445450/feeds.json?api_key=RCTKIS245KTGZ01I&results=2';
  
  getData() {
    this.http.get<any>(this.baseUrl).subscribe(data => {
      var currenttemperature = parseFloat(data?.feeds[0]?.field1.replace(',', '.')).toFixed(2);
      var currenthumidity =parseFloat(data?.feeds[0]?.field2.replace(',', '.')).toFixed(2);
      this.Temperature = parseFloat(currenttemperature);
      this.Humidity = parseFloat(currenthumidity);
    });
  }
  calculateProgressWidth(value: string): number {
    return (parseFloat(value) / 100) * 100;
  }


  
  
}
