import { Component, Input, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,ApexTitleSubtitle
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
import { Medication } from '../../../model/Medications';
export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  title: ApexTitleSubtitle | any;

};
@Component({
  selector: 'app-medications-widget',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './medications-widget.component.html',
  styleUrl: './medications-widget.component.css'
})
export class MedicationsWidgetComponent implements OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() medicationData: Medication[] = [];
  public chartOptions: Partial<ChartOptions>;

  constructor() {}

  ngOnChanges(): void {

    this.updateChartData();

  }

  private updateChartData(): void {
    this.chartOptions = {
      series: [
        {
          name: "Stock Disponible",
          data: this.medicationData.map((med) => ({
            x: med.Nom,
            y: med.StockDisponible,
            goals: [
              {
                name: "Stock Maximum",
                value: med.StockMax,
                strokeWidth: 5,
                strokeColor: "#EDDF38"
              },{
                name: "Stock Alerte",
                value: med.StockAlerte,
                strokeWidth: 5,
                strokeColor: "#707B7C"
              },
              {
                name: "Stock Minmum",
                value: med.StockMin,
                strokeWidth: 5,
                strokeColor: "#360ABF"
              },
              {
                name: "Stock Securite",
                value: med.StockSécurité,
                strokeWidth: 5,
                strokeColor: "#E74C3C"
              }
            ]
          }))
        }
      ],
      chart: {
        height: 350,
        type: "bar",
      },
    
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      title: {
        text: "Liste des medicaments"
      },
      colors: ["#7DCEA0"],
      // dataLabels: {
        
      //   formatter: function (val: any, opts: any) {
      //     const goals =
      //       opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].goals;

      //     if (goals && goals.length) {
      //       return `${val} / ${goals[0].value}`;
      //     }
      //     return val;
      //   }
      // },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Stock Disponible","Stock Securite (Stock Reserve)","Stock Minmum (Stock Delai)","Stock Alerte (Seuil)","stock Maximum"],
        markers: {
          fillColors:["#7DCEA0","#E74C3C","#360ABF","#707B7C","#EDDF38"]
        }
      }
    };
  }
}




