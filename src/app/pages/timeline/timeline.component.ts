
import { Component} from '@angular/core';
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import {MatGridListModule} from '@angular/material/grid-list';
import { GranttChartComponent } from "../../grantt-chart/grantt-chart.component";
import { KanbanComponent } from "../../kanban/kanban.component";

@Component({
    selector: 'app-timeline',
    standalone: true,
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.css',
    imports: [ScheduleComponent, MatGridListModule, GranttChartComponent, KanbanComponent]
})
export class TimelineComponent  {
}
