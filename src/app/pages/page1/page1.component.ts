import { Component } from '@angular/core';
import { DialogComponent } from "../../components/dialog/dialog.component";

@Component({
    selector: 'app-page1',
    standalone: true,
    templateUrl: './page1.component.html',
    styleUrl: './page1.component.css',
    imports: [DialogComponent]
})
export class Page1Component {

}
