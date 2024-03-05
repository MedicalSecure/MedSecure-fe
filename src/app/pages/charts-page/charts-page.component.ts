import { Component,OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {ApexAxisChartSeries,ApexTitleSubtitle,ApexDataLabels,ApexFill,ApexMarkers,ApexYAxis,ApexXAxis,ApexTooltip,ApexStroke} from "ng-apexcharts";
export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels:any;
  markers: any;
  title:any;
  fill: any;
  yaxis: any;
  xaxis: any;
  tooltip: any;
  stroke: any;
  grid: any; 
  colors: any;
  toolbar: any;
};
export type ChartOptionsCircle = {
  series: any;
  chart: any;
  labels: any;
  plotOptions: any;
};
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [NgApexchartsModule,HttpClientModule],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.css'
})
export class ChartsPageComponent implements OnInit {

  Temperature!: number ;
  Humidity!: number;

  public chart1options!: Partial<ChartOptions>;
  public chart2options!: Partial<ChartOptions>;
  public chart3options!: Partial<ChartOptions>;
  public chart4options!: Partial<ChartOptions>;
  public chartOptions1circle!: Partial<ChartOptionsCircle>;
  public chartOptions2circle!: Partial<ChartOptionsCircle>;
  public commonOptions: Partial<ChartOptions> = {
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },
    toolbar: {
      tools: {
        selection: false
      }
    },
    markers: {
      size: 6,
      hover: {
        size: 10
      }
    },
    tooltip: {
      followCursor: false,
      theme: "dark",
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return "";
          }
        }
      }
    },
    grid: {
      clipMarkers: false
    },
    xaxis: {
      type: "datetime"
    },
    title: {
       align: "left"
    },
  };
  private readonly baseUrl = 'https://api.thingspeak.com/channels/2445450/feeds.json?api_key=RCTKIS245KTGZ01I&results=2';
  
  ngOnInit(): void {
    this.getData();
   }
   
   getData() {
     this.http.get<any>(this.baseUrl).subscribe(data => {
       var currenttemperature = parseFloat(data?.feeds[0]?.field1.replace(',', '.')).toFixed(2);
       var currenthumidity =parseFloat(data?.feeds[0]?.field2.replace(',', '.')).toFixed(2);
       this.chartOptions1circle.series = [parseFloat(currenttemperature)];
       this.chartOptions2circle.series = [parseFloat(currenthumidity)];

     });
   }
  constructor(private http: HttpClient) {
    this.initCharts();
  }

  public initCharts(): void {
  this.chartOptions1circle = {
  series: [70],
  chart: {
    height: 200,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "70%",
      },
      dataLabels: {
        name: {
          offsetY: -10,
          show: true,
          color: "#888",
          fontSize: "14px"
        },
        value: {
          color: "#111",
          fontSize: "28px",
          show: true,
          formatter: function(val:any) {
            return val + "°C";
          }
        }
      },

      strokeColors: "#FF5733"
    }
  },
  labels: ["Temperature"]
};

this.chartOptions2circle = {
  series: [70],
  chart: {
    height: 200,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "70%",
      },
      dataLabels: {
        name: {
          offsetY: -10,
          show: true,
          color: "#888",
          fontSize: "14px"
        },
        value: {
          color: "#111",
          fontSize: "28px",
          show: true
        }
      },
      strokeColors: "#FF5733" // Couleur de la ligne de progression (rouge)
    }
  },
  labels: ["Humidity"]
}; 
 
    this.chart1options = {
      series: [
        {
          name: "chart1",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2017").getTime(),
            20,
            {
              min: 10,
              max: 60
            }
          )
        }
      ],
      chart: {
        id: "fb",
        group: "social",
        type: "line",
        height: 160
      },
      colors: ["#008FFB"],
      yaxis: {
        tickAmount: 3,
        labels: {
          minWidth: 40
        }
      },
      title: {
        text: "Temperature Control Record",
        align: "left"
      },
    };

    this.chart2options = {
      series: [
        {
          name: "chart2",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2017").getTime(),
            20,
            {
              min: 10,
              max: 30
            }
          )
        }
      ],
      chart: {
        id: "tw",
        group: "social",
        type: "line",
        height: 160
      },
      colors: ["#546E7A"],
      yaxis: {
        tickAmount: 3,
        labels: {
          minWidth: 40
        }
      },
      title: {
        text: "Humidity Control Record",
        align: "left"
      },
    };

    this.chart3options = {
      series: [
        {
          name: "chart3",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2017").getTime(),
            20,
            {
              min: 10,
              max: 60
            }
          )
        }
      ],
      chart: {
        id: "yt",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["#00E396"],
      yaxis: {
        tickAmount: 3,
        labels: {
          minWidth: 40
        }
      },
      title: {
        text: "Electricity Control Record",
        align: "left"
      },
    };
    this.chart4options = {
      series: [
        {
          name: "chart4",
          data: this.generateDayWiseTimeSeries(
            new Date("11 Feb 2017").getTime(),
            20,
            {
              min: 10,
              max: 60
            }
          )
        }
      ],
      chart: {
        id: "yt",
        group: "social",
        type: "area",
        height: 160
      },
      colors: ["#00E396"],
      yaxis: {
        tickAmount: 3,
        labels: {
          minWidth: 40
        }
      },
      title: {
        text: " luminosity Control Record",
        align: "left"
      },
    };
  
  }

  public generateDayWiseTimeSeries(baseval:any, count:any, yrange:any): any[] {
    let i = 0;
    let series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}
