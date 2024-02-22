import { Component } from '@angular/core';
import { UnitCareComponent } from "../../pages/unit-care/unit-care.component";


@Component({
    selector: 'app-dialog',
    standalone: true,
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
    imports: [UnitCareComponent]
})
export class DialogComponent {

}
