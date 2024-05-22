import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";
import {PrescriptionService} from '../../../services/prescription/prescription.service'
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
};
@Component({
  selector: 'app-medications-prescribed',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './medications-prescribed.component.html',
  styleUrl: './medications-prescribed.component.css'
})
export class MedicationsPrescribedComponent implements OnInit {
@ViewChild("chart") chart: ChartComponent;
public chartOptions: Partial<ChartOptions>;

constructor(private prescriptionService: PrescriptionService) {
  this.chartOptions = {
    series: [
      {
        name: "distibuted",
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function(chart:any, w:any, e:any) {
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
      categories: [
        
      ],
      labels: {
        style: {
          fontSize: "10px"
        },
        rotate: 0, 
        offsetY: -5
      }, 
      title: {
        text: "Medicines",
      }
    },
    yaxis: {
      title: {
        text: "% Prescriptions",
     
      }
    },
    colors: ['#FF5733'] 
  };
}
ngOnInit() {
  this.prescriptionService.getPrescriptions().subscribe(data => {
    
    const categories = data.map((med: any) => med.medication_name);
    const stockData = data.map((med: any) => med.quantity);

    this.chartOptions.series = [{
      name: 'Administered Medication',
      data: stockData
    }];

    this.chartOptions.xaxis = {
      categories: categories,
      labels: {
        style: {
          fontSize: "10px"
        },
        rotate: 0, 
        offsetY: -5
      }, 
      title: {
        text: "Medicines",
      }
    };
    this.chartOptions.yaxis = {
      title: {
        text: "% Prescriptions",
      }
    };
  });
}

}
