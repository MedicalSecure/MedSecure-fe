import { Component, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { formatDate } from '@angular/common';
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
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  fill: ApexFill | any;
  tooltip: ApexTooltip | any
  stroke: ApexStroke | any;
  legend: ApexLegend | any;
};
@Component({
  selector: 'app-charts-mostmedication',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './charts-mostmedication.component.html',
  styleUrl: './charts-mostmedication.component.css'
})
export class chartsmostmedicationComponent implements OnChanges {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  @Input() mostmedication: any = []
  @Input() leastmedication: any = []
  @Input() datacateg: Date[] = []



  ngOnChanges(changes: SimpleChanges) {
      this.chartOptions = {
        series: [
          {
            name:this.getDataname(this.mostmedication),
            data: this.getDataValues(this.mostmedication)
          },
          {
            name:this.getDataname(this.leastmedication),
            data: this.getDataValues(this.leastmedication)
          }, 
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "30%",
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
          categories:  Object.keys(this.mostmedication)
   
        },
        yaxis: {
          title: {
            text: "nbr(quantite)"
          }
        },


        fill: {
          opacity: 1
        },
       
      };
      console.log('gggg111111',this.getDataname(this.mostmedication))
  }

  
  constructor() {
  

  }
  private getDataValues(medication: any): number[] {
    return Object.values(medication).map((med: any) => med.uses);
  }
  private getDataname(medication: any): string[] {
    return Object.values(medication).map((med: any) => med.name);
   
  }
  private getDataname2(medication: any[]): string[] {
    return medication.map((monthData: any) => {
      const mostUsedMedication = Object.keys(monthData).reduce((a, b) => monthData[a].uses > monthData[b].uses ? a : b);
      return monthData[mostUsedMedication].name;
    });
  }
  
  
  

  

  

}

