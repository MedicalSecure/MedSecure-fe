
import { Component} from '@angular/core';
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import {MatGridListModule} from '@angular/material/grid-list';
import { GanttChartComponent } from "../timeline-event/timeline-event.component";
import { TasksComponent } from "../tasks/tasks.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-timeline',
    standalone: true,
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.css',
    imports: [ScheduleComponent, MatGridListModule, TasksComponent , GanttChartComponent, CommonModule]
})
export class TimelineComponent  {
    isCurrentHour(hours: string[]): boolean {
        const currentHour = new Date().getHours().toString().padStart(2, '0');
        
        // Debug output
        console.log('Current Hour:', currentHour);
        console.log('Target Hours:', hours);
        
        // Check if the current hour matches any of the provided hours
        const isCurrent = hours.includes(currentHour);
        console.log('Is Current Hour:', isCurrent);
        
        return isCurrent;
      }
}
