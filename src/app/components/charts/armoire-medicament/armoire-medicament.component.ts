import { Component, Input, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend, ApexTitleSubtitle, ApexXAxis, ApexStroke
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
import { UniteDeSoinData } from "../../../model/UniteDeSoinData"
import { ArmoireStock } from "../../../model/ArmoireStock"
export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  title: ApexTitleSubtitle | any;
  xaxis: ApexXAxis | any;
  stroke: ApexStroke | any;
};

@Component({
  selector: 'app-armoire-medicament',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './armoire-medicament.component.html',
  styleUrl: './armoire-medicament.component.css'
})
export class ArmoireMedicamentComponent implements OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  // @Input() medicationArmoire: UniteDeSoinData[] = []
  @Input() medicationArmoireStock: ArmoireStock[] = []
  public chartOptions: Partial<ChartOptions>;
  constructor() { }

  ngOnChanges(): void {
    this.updateChartData();
  }

  // updateChartData(): void {
  //   const chambreNames: string[] = [];
  //   this.medicationArmoire.forEach(unit => {
  //     unit.armoires.forEach(armoire => {
  //       armoire.chambres.forEach(chambre => {
  //         if (!chambreNames.includes(chambre.name)) {
  //           chambreNames.push(chambre.name);
  //         }
  //       });
  //     });
  //   });

  //   const chambrePrescriptions: { [chambre: string]: any } = {};
  //   this.medicationArmoire.forEach(unit => {
  //     unit.armoires.forEach(armoire => {
  //       armoire.chambres.forEach(chambre => {

  //         if (!chambrePrescriptions[chambre.name]) {
  //           chambrePrescriptions[chambre.name] = {
  //             x: chambre.name,
  //             y: 0, 
  //             goals: [] 
  //           };
  //         }

  //         chambre.prescriptions.forEach(prescription => {
  //           chambrePrescriptions[chambre.name].y += prescription.quantite; 
  //           chambrePrescriptions[chambre.name].goals.push({
  //             name: prescription.name,
  //             value: prescription.quantite,
  //             strokeWidth: 5,
  //             strokeColor: "#FF0000"
  //           });
  //         });
  //       });
  //     });
  //   });

  //   const seriesData = Object.values(chambrePrescriptions);

  //   this.chartOptions = {
  //     series: [
  //       {
  //         name: "Actual",
  //         data: seriesData
  //       }
  //     ],
  //     chart: {
  //       type: "bar",
  //       height: 430
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: true,
  //         dataLabels: {
  //           position: "top"
  //         }
  //       }
  //     },

  //     title: {
  //       text: "Armoire de médicaments"
  //     },
  //     stroke: {
  //       show: true,
  //       width: 1,
  //       colors: ["#fff"]
  //     },
  //     legend: {
  //       show: true,
  //       showForSingleSeries: true,
  //       customLegendItems: ["Stock Actual","Medicament Prescription"],
  //       markers: {
  //         fillColors: [,"#FF0000"]
  //       }
  //     }
  //   };
  // }

  private updateChartData(): void {
    const seriesData = this.medicationArmoireStock.flatMap((armoire) =>
      armoire.medicaments.map((medicament) => ({
        x: medicament.nom,
        y: medicament.quantite_Pres_administree,
        goals: [
          {
            name: "Stock Actuel",
            value: medicament.quantite_stock_actual,
            strokeWidth: 4,
            strokeColor: "#FF0000"
          },
        ]
      }))
    );

    this.chartOptions = {
      series: [
        {
          name: "Quantité Medicament Prescrit",
          data: seriesData,
        }
      ],
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      title: {
        text: `Stock Armoire Medications`,
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Quantité de médicament prescrit (prêt à être administré)", "Stock actuel (arrêté à la date et l'heure actuelles)"],
        markers: {
          fillColors: [, "#FF0000"]
        }
      },


      dataLabels: {
        formatter: function (val: any, opts: any) {
          const goals =
            opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].goals;

          if (goals && goals.length) {
            return `${goals[0].value}/${val} `;
          }
          return val;
        }
  
      },
      xaxis: {
        categories: seriesData.map((dataPoint) => dataPoint.x),
      },
    };
  }


}

