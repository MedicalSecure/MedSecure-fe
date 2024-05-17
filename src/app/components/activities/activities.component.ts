import { Component, Injectable, Input } from '@angular/core';
import { ActivityDto, ActivityView, GetActivitiesResponse } from '../../types';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
@Injectable()
export class ActivitiesComponent<T extends ActivityService> {
  @Input() isActivities = true;

  /**
   * @description An input property that accepts an instance of a service that implements the ActivityService interface.
   * The service must have a `getActivities` method that returns an Observable of `GetActivitiesResponse`.
   *
   * @type T - A generic type parameter that extends the `ActivityService` interface.
   *           This ensures that the service passed through this input property has the required `getActivities` method.
   *
   * @default null - If no service is provided, the default value is `null`.
   *
   * @example
   * Usage in the parent component's template:
   * ```html
   * <app-activities [service]="yourServiceName"></app-activities>
   * ```
   *
   * Usage in the parent component's class:
   * ```typescript
   * import { YourServiceName } from './your-service-name.service';
   *
   * export class ParentComponent {
   *   constructor(public yourServiceName: YourServiceName) {}
   * }
   * ```
   *
   * The `YourServiceName` service must implement the `ActivityService` interface:
   * ```typescript
   * export class YourServiceName implements ActivityService {
   *   getActivities(pageIndex: number = 0, pageSize: number = 7): Observable<GetActivitiesResponse> {
   *     // implementation to fetch activities data
   *   }
   * }
   * ```
   */
  @Input() service: T | null = null;
  @Input() numberOfActivitiesToShow: number = 7;

  /**
   * @description An input property that allows you to specify the number of characters
   * visible of the activity content in the HTML template
   * If surpassed, it will cut the content like: (your sliced conten..)
   */
  @Input() maximumVisibleContentLength: number = 30;
  /**
   * @description An input property that allows you to specify the number of characters
   * visible of the activity creator name in the HTML template
   * If surpassed, it will cut the name like: (Hammadi AZA..)
   * @example
   * maximumVisibleCreatorNameLength = 60
   * //every minute, it will update the view, so the last event time will be updated like : 1m,2m,3m ...
   *  */
  @Input() maximumVisibleCreatorNameLength: number = 12;

  /**
   * @description An input property that allows you to specify the interval (in seconds) at which
   * the component should should refresh the times of the already fetched events
   * If set to 0 , no periodic updates will occur.
   */
  @Input() refreshTimesEveryXSeconds: number = 60;

  /**
   * @description An input property that allows you to specify the interval (in minutes) at which
   * the component should fetch new events or activities from a server or service.
   * If set to 0 or a negative value, no periodic fetching will occur.
   */
  @Input() fetchNewEventsEveryXMinutes: number = 1;

  private intervalTimesRefresh: any;
  private intervalFetchRefresh: any;
  private activities: ActivityDto[] = [];
  activitiesView: ActivityView[] = [];

  ngOnInit() {
    this.fetchActivities();

    if (this.fetchNewEventsEveryXMinutes > 0) {
      this.intervalFetchRefresh = setInterval(() => {
        this.fetchActivities();
      }, this.fetchNewEventsEveryXMinutes * 1000 * 60); //1000ms*60s = number of minutes
    }

    if (this.refreshTimesEveryXSeconds > 0) {
      this.intervalTimesRefresh = setInterval(() => {
        this.updateActivitiesTimes();
      }, this.refreshTimesEveryXSeconds * 1000);
    }
  }

  ngOnDestroy() {
    if (this.intervalTimesRefresh) {
      clearInterval(this.intervalTimesRefresh);
    }
    if (this.intervalFetchRefresh) {
      clearInterval(this.intervalFetchRefresh);
    }
  }

  updateActivitiesTimes() {
    this.activitiesView = this.activities.map((activityDto) => {
      let newActivityView = {
        id: activityDto.id,
        content: activityDto.content,
        createdBy: activityDto.createdBy,
        creatorName: activityDto.creatorName,
        activityTime: this.getActivityTime(activityDto),
      };
      return newActivityView;
    });
  }

  getActivityTime(activity: ActivityDto): string {
    //input 05/07/2024 10:10 => output : 1m, 5m, 1h, 90d (ago)
    let createdAt: Date = activity.createdAt;
    let happenedAt = '';
    let now = new Date();
    let diffMinutes = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60)
    );
    if (diffMinutes < 1) {
      happenedAt = 'Just now';
    } else if (diffMinutes < 60) {
      happenedAt = `${diffMinutes}m`;
    } else if (diffMinutes < 24 * 60) {
      let hours = Math.floor(diffMinutes / 60);
      happenedAt = `${hours}h`;
    } else {
      let days = Math.floor(diffMinutes / (24 * 60));
      happenedAt = `${days}d`;
    }
    return happenedAt;
  }

  fetchActivities() {
    this.isActivities = true;
    if (!this.service) return;

    this.service.getActivities(0, this.numberOfActivitiesToShow).subscribe(
      (response) => {
        this.activities = response.activities.data;
        this.updateActivitiesTimes();
      },
      (error) => console.error(error),
      () => (this.isActivities = false)
    );
  }
}

export interface ActivityService {
  getActivities(
    pageIndex: number,
    pageSize: number
  ): Observable<GetActivitiesResponse>;
}

/* 
usage : 

parent template:
            <app-activities [service]='yourServiceName'></app-activities>

parent constructor:  
            constructor(public yourServiceName: YourServiceName) {}

your YourServiceName must have :

  getActivities(
    pageIndex: number = 0,
    pageSize: number = 7
  ): Observable<GetActivitiesResponse> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex.toString())
      .set('PageSize', pageSize.toString());
    let x = this.http.get<GetActivitiesResponse>(this.apiUrl + '/Activities', {
      params,
    }).pipe(
      map((response) => {
        //still testing dates
        return parseDates(response);
      })
    );
    return x;
  }


*/
