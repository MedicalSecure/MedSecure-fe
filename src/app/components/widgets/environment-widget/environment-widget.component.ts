import { Component, ViewChild ,Input, OnInit, SimpleChanges, OnChanges, Output} from '@angular/core';
import { NgApexchartsModule } from "ng-apexcharts";
import { HttpClient } from '@angular/common/http';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels, ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  stroke: ApexStroke | any;
  dataLabels: ApexDataLabels | any;
  markers: ApexMarkers | any;
  tooltip: ApexTooltip | any;
  yaxis: ApexYAxis | any;
  grid: ApexGrid | any;
  legend: ApexLegend | any;
  title: ApexTitleSubtitle | any;
};


@Component({
  selector: 'app-environnement-widget',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './environment-widget.component.html',
  styleUrl: './environment-widget.component.css'
})
export class EnvironmentWidget implements OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  @Input() datatemp: number[] = [];
  @Input() datahum: number[] = [];
  @Input() dataele: number[] = [];
  @Input() datalum: number[] = [];
  @Input() datacateg :Date [] =[]
  @Input()selectedUniteSoin: any;
  public chartOptions!: Partial<ChartOptions>;
  constructor(private http: HttpClient) {
 
  }

  ngOnChanges(changes: SimpleChanges) {
  
    if (changes['datatemp'] && changes['datatemp'].currentValue || changes['datahum'] && changes['datahum'].currentValue || changes['dataele'] && changes['dataele'].currentValue 
    || changes['datalum'] && changes['datalum'].currentValue  || changes['datacateg'] && changes['datacateg'].currentValue) {
      this.chartOptions = {
        series: [
          {
            name: "Temperature Control Record",
            data: this.datatemp,
       
          },
          {
            name: "Humidity Control Record",
            data: this.datahum
          },
          {
            name: "Electricity Control Record",
            data: this.dataele
          },
          {
            name: "luminosity Control Record",
            data: this.datalum
          }
        ],
        chart: {
          height: 350,
          type: "line"
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 1,
          curve: "smooth",
          dashArray: [0, 0, 0]
        },
        title: {
          text: "",
          align: "left"
        },
        legend: {
          tooltipHoverFormatter: function (val: any, opts: any) {
            return (
              val +
              " - <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          type: 'datetime', 
          labels: {
            datetimeUTC: false,
            trim: false
          },
          categories: this.datacateg 
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val: string) {
                  return val ;
                }
              }
            },
            {
              title: {
                formatter: function (val: string) {
                  return val ;
                }
              }
            },
            {
              title: {
                formatter: function (val: string) {
                  return val;
                }
              }
            },
            {
              title: {
                formatter: function (val: string) {
                  return val;
                }
              }
            }
          ]
        },
        grid: {
          borderColor: "#f1f1f1"
        }
      };
    }
    console.log("ddddd",this.chartOptions.series)

  }

}
