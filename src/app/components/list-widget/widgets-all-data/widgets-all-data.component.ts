import { Component } from '@angular/core';
import { EnvironmentWidget } from '../../widgets/environment-widget/environment-widget.component'
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-widgets-all-data',
  standalone: true,
  imports: [EnvironmentWidget],
  templateUrl: './widgets-all-data.component.html',
  styleUrl: './widgets-all-data.component.css'
})
export class WidgetsAllDataComponent {
  
  private readonly baseUrlall='https://api.thingspeak.com/channels/2559139/feeds.json?api_key=HEJGWX49WMGLX0YN';
  temperatureData: number[] = [];
  humidityData: number[] = [];
  electricityData: number[] = [];
  luminosityData: number[] = [];
  categoriesData : Date[]=[]

  getDataall() {
    this.http.get<any>(this.baseUrlall).subscribe(data => {
      if (data && data.feeds) {
        this.temperatureData = data.feeds.map((feed: any) => {
          if (feed && feed.field1) {
            return feed.field1.split(',').map(parseFloat);
          }
          return [];
        }).flat();
        this.humidityData = data.feeds.map((feed: any) => {
          if (feed && feed.field2) {
            return feed.field2.split(',').map(parseFloat);
          }
          return [];
        }).flat();
        this.electricityData= data.feeds.map((feed: any) => {
          if (feed && feed.field3) {
            return feed.field3.split(',').map(parseFloat);
          }
          return [];
        }).flat();
        this.luminosityData= data.feeds.map((feed: any) => {
          if (feed && feed.field4) {
            return feed.field4.split(',').map(parseFloat);
          }
          return [];
        }).flat();

        this.categoriesData = data.feeds.map((feed: any) => {
          if (feed && feed.created_at) {
            return formatDate(new Date(feed.created_at), 'medium', 'en-US'); // Formatez la date avec l'heure

          }
          return '';
        }).filter((dateTime: string) => dateTime !== '');
          } else {
        // console.error("Missing 'feeds' in the response data");
      }
    }, error => {
      // console.error("Error fetching temperature data:", error);
    });
  }
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
   this.getDataall()}


}
