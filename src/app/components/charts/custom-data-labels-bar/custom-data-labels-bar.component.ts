import { Component,ViewChild,Input ,OnChanges,SimpleChanges} from '@angular/core';
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
export class CustomDataLabelsBarComponent  implements OnChanges{
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() jsonData: any;
  constructor() {
    this.chartOptions = {
      series: [
       
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
        categories: [
        
        ]
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      title: {
        text: "Stock Medicine",
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
  ngOnChanges(): void {

    const sortedData = this.jsonData.sort((a: any, b: any) => a.stock - b.stock);

    const categories = sortedData.map((item: any) => item.name);
    const data = sortedData.map((item: any) => item.stock);

    this.chartOptions = {
      ...this.chartOptions,
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: categories
      },
      series: [{ data: data }],
      dataLabels: {
        ...this.chartOptions.dataLabels,
        style: {
          fontSize: '12px', 
      
          colors: ["#fff"]
        }
      }
    };
    
  }
}


