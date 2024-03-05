import { Component,ViewChild,Input, SimpleChanges, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries|any;
  chart: ApexChart|any;
  dataLabels: ApexDataLabels|any;
  plotOptions: ApexPlotOptions|any;
  yaxis: ApexYAxis|any;
  xaxis: ApexXAxis|any;
  fill: ApexFill|any;
  tooltip: ApexTooltip|any
  stroke: ApexStroke|any;
  legend: ApexLegend|any;
};
@Component({
  selector: 'app-column-charts',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './column-charts.component.html',
  styleUrl: './column-charts.component.css'
})
export class ColumnChartsComponent implements OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @Input() mostmedication :any []=[]
  @Input() leastmedication:any[]=[]

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mostmedication'] && changes['mostmedication'].currentValue){
      this.chartOptions = {
        series: [
          {
            name: "Most Used Medications",
            data:[],
            color: "#007bff"
          },
          {
            name: "Least Used Medications",
            data: [13, 19, 26, 12, 25, 18, 12, 13, 21],
            color: "#ff0000"
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
        },
        xaxis: {
          categories: [
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct"
          ]
        },
        yaxis: {
          title: {
            text: "nbr(quantite)"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val:any) {
              return "nbr " + val ;
            }
          }
        }
      };
    }
    console.log("hhhh",this.chartOptions.series)

  }


  constructor() {
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "Most Used Medications",
    //       data:this.mostmedication,
    //       color: "#007bff"
    //     },
    //     {
    //       name: "Least Used Medications",
    //       data: [13, 19, 26, 12, 25, 18, 12, 13, 21],
    //       color: "#ff0000"
    //     }
    //   ],
    //   chart: {
    //     type: "bar",
    //     height: 350
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "55%",
    //       endingShape: "rounded"
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     show: true,
    //     width: 2,
    //     colors: ["transparent"]
    //   },
    //   xaxis: {
    //     categories: [
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "Jun",
    //       "Jul",
    //       "Aug",
    //       "Sep",
    //       "Oct"
    //     ]
    //   },
    //   yaxis: {
    //     title: {
    //       text: "nbr(quantite)"
    //     }
    //   },
    //   fill: {
    //     opacity: 1
    //   },
    //   tooltip: {
    //     y: {
    //       formatter: function(val:any) {
    //         return "nbr " + val ;
    //       }
    //     }
    //   }
    // };
  }
 


  
}
