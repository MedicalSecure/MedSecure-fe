
import { Component} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { GanttChartComponent } from "../timeline-event/timeline-event.component";
import { TasksComponent } from "../tasks/tasks.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-timeline',
    standalone: true,
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.css',
    imports: [ MatGridListModule, TasksComponent , GanttChartComponent, CommonModule]
})
export class TimelineComponent  {
    isCurrentHour(hours: number[]): boolean {
        const currentHour = new Date().getHours();

        // Check if the current hour matches any of the provided hours
        const isCurrent = hours.includes(currentHour);
        
        return isCurrent;
      }
}
