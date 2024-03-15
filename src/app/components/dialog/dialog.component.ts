import { Component } from '@angular/core';
import { ScheduleComponent } from "../schedule/schedule.component";
import { MasonryComponent } from "../masonry/masonry.component";
import { PartsOfDayComponent } from "../parts-of-day/parts-of-day.component";
import { TimelineComponent } from "../timeline/timeline.component";
import { MedicationSearchComponent } from "../medication-search/medication-search.component";
import { WizardHeaderComponent } from "../wizard-header/wizard-header.component";

@Component({
    selector: 'app-dialog',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
    imports: [ScheduleComponent, MasonryComponent, PartsOfDayComponent, TimelineComponent, WizardHeaderComponent , MedicationSearchComponent]
})
export class DialogComponent {

}
