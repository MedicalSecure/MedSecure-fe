import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";
import { DrugService } from "../../../services/medication/medication.service"
type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
  title?: {
    text?: string;
    style?: {
      color?: string;
      fontSize?: string;
    };
  };
};

type ApexYAxis = {
  title?: {
    text?: string;
    style?: {
      color?: string;
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis | any;
  grid: ApexGrid | any;
  colors: string[] | any;
  legend: ApexLegend | any;
};

@Component({
  selector: 'app-recommended-medications',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './recommended-medications.component.html',
  styleUrls: ['./recommended-medications.component.css']
})
export class RecommendedMedicationsComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private medicationService: DrugService) {
    this.chartOptions = {
      series: [
        {
          name: "Stock Disponible",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function (chart: any, w: any, e: any) {
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "35%",
          distributed: false
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "10px"
          },
          rotate: 0,
          offsetY: -5,
        },
        title: {
          text: "Medicines",
        }
      },
      yaxis: {
        title: {
          text: "Available stock",
       
        }
      }
    };
  }

  ngOnInit() {
    this.medicationService.getMedicationsNews().subscribe(data => {
      const medications = data.Medications.medication;
      const categories = medications.map((med: any) => med.Nom);
      const stockData = medications.map((med: any) => med['Stock dispo']);

      this.chartOptions.series = [{
        name: 'Stock Disponible',
        data: stockData
      }];

      this.chartOptions.xaxis = {
        categories: categories,
        labels: {
          style: {
            fontSize: "10px"
          },
          rotate: 0,
          offsetY: -5,
        },
        title: {
          text: "Medicines",
        }
      };

      this.chartOptions.yaxis = {
        title: {
          text: "Available stock",
        }
      };
    });
  }
}
