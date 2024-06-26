import { Component, Input, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend, ApexTitleSubtitle
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
import {Stockout } from "../../../model/stockout"
import { Medication} from "../../../model/Medications"
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
  selector: 'app-medications-in-rupture',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './stock-out-widget.component.html',
  styleUrl: './stock-out-widget.component.css'
})
export class StockOutWidgetComponent implements OnChanges{
  @ViewChild("chart") chart: ChartComponent;
  @Input() medicationsInRupture: Stockout[] = [];
 @Input() medicationData: Medication[] = [];
  public chartOptions!: Partial<ChartOptions>;
  constructor() {

  }

  ngOnChanges(): void {
    this.updateChartData();
  }

    private updateChartData(): void {
      this.chartOptions = {
        series: [
          {
            name: "Stock Disponible",
            data: this.medicationsInRupture.map((i) => ({
              x: i.Nom,
              y: i.StockDisponible,
              goals: [
                {
                  name: "Stock Alerte",
                  value: i.StockAlerte,
                  strokeWidth: 4,
                  strokeColor: "#EDDF38"
                },
                {
                  name: "Stock Min",
                  value: i.StockMin,
                  strokeWidth: 4,
                  strokeColor: "#0ABF6A"
                },
                {
                  name: "Stock Securite",
                  value: i.StockSécurité,
                  strokeWidth:4,
                  strokeColor: "#360ABF"
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
          text: "list of out-of-stock medicines",
          style: {
            fontSize: '16px',
            fontFamily: 'Manrope, sans-serif',
          }
        },
        colors: ["#FF0000"],
        dataLabels: {
          formatter: function (val: any, opts: any) {
            const goals =
              opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].goals;

            if (goals && goals.length) {
              return `${val} / ${goals[0].value}`;
            }
            return val;
          }
        },
        legend: {
          show: true,
          showForSingleSeries: true,
          fontFamily: 'Manrope, sans-serif',
          customLegendItems: ["Stock Disponible","Stock Securite","Stock Min","Stock Alerte"],
          markers: {
            fillColors: ["#FF0000","#360ABF","#0ABF6A","#EDDF38"]
          }
        },


      };
    }
  }

