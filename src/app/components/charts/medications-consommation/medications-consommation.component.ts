import { Component, Input, OnChanges, ViewChild } from "@angular/core";
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,ApexTitleSubtitle
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries|any;
  chart: ApexChart|any;
  dataLabels: ApexDataLabels|any;
  plotOptions: ApexPlotOptions|any;
  yaxis: ApexYAxis|any;
  xaxis: ApexXAxis|any;
  grid: ApexGrid|any;
  colors: string[]|any;
  legend: ApexLegend|any;
  title: ApexTitleSubtitle | any;

};
import { PresecriptionMedicament } from "../../../model/PresecriptionMedicament"
@Component({
  selector: 'app-medications-consommation',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './medications-consommation.component.html',
  styleUrl: './medications-consommation.component.css'
})
export class MedicationsConsommationComponent implements OnChanges{
  @ViewChild("chart") chart: ChartComponent;
  @Input() medicationsDataprescription  : PresecriptionMedicament[] = [];
  public chartOptions: Partial<ChartOptions>;

  constructor() {
   
  }
  ngOnChanges(): void {
    this.updateChartMedication();
  }

    private updateChartMedication(): void {
      this.medicationsDataprescription.sort((a, b) => b.quantity - a.quantity);
      this.chartOptions = {
        series: [
          {
            name: "distibuted",
            data: this.medicationsDataprescription.map(item => item.quantity)
          }
        ],
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function(chart:any, w:any, e:any) {
              // console.log(chart, w, e)
            }
          }
        },
        title: {
          text: "Consommations produits en Surstock"
        },
        colors: [
          "#008FFB" ],
        plotOptions: {
          bar: {
            columnWidth: "50%",
            distributed: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        grid: {
          show: true
        },
        xaxis: {
          categories: this.medicationsDataprescription.map(item => item.medication_name),
          labels: {
            style: {
              colors:  "#008FFB",
              fontSize: "12px"
            }
          }
        }
      };
  
}
}