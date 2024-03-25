
import { Component} from '@angular/core';
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import {MatGridListModule} from '@angular/material/grid-list';
import { GanttChartComponent } from "../../components/gantt-chart/gantt-chart.component";
import { KanbanComponent } from "../../components/kanban/kanban.component";

@Component({
    selector: 'app-timeline',
    standalone: true,
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.css',
    imports: [ScheduleComponent, MatGridListModule, KanbanComponent , GanttChartComponent]
})
export class TimelineComponent  {
}
