import { Component } from '@angular/core';
import { ScheduleComponent } from "../schedule/schedule.component";
import { MasonryComponent } from "../masonry/masonry.component";

@Component({
    selector: 'app-dialog',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
    imports: [ScheduleComponent, MasonryComponent]
})
export class DialogComponent {

}
