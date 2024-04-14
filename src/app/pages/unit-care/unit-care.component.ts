import { Component } from '@angular/core';
import { FormUnitCareComponent } from "../../components/form-unit-care/form-unit-care.component";
import { CardsUnitCareComponent } from "../../components/cards-unit-care/cards-unit-care.component";
import { UnitCareDetailsComponent } from "../../components/unit-care-details/unit-care-details.component";
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-unit-care',
    standalone: true,
    templateUrl: './unit-care.component.html',
    styleUrl: './unit-care.component.css',
    imports: [RouterModule, FormUnitCareComponent, CardsUnitCareComponent, UnitCareDetailsComponent]
})
export class UnitCareComponent {

}
