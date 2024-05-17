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
  @Input() activities: ActivityDto[] = [];
  @Input() isActivities = true;
  @Input() service: T | null = null;

  private intervalRef: any;

  activitiesView: ActivityView[] = [];

  ngOnInit() {
    this.fetchActivities();

    this.intervalRef = setInterval(() => {
      this.updateActivitiesTimes();
    }, 60000); // Update every minute (60000 milliseconds)
  }

  ngOnDestroy() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
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

    this.service.getActivities(0, 7).subscribe(
      (response) => {
        this.activities = response.activities.data;
        this.updateActivitiesTimes();
      },
      (error) => console.error(error),
      () => (this.isActivities = false)
    );
  }
}

interface ActivityService {
  getActivities(
    pageIndex: number,
    pageSize: number
  ): Observable<GetActivitiesResponse>;
}
