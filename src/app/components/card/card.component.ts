import { Component } from '@angular/core';
import {RadialbarChartsComponent} from '../../components/widgets/radialbar-charts/radialbar-charts.component'
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RadialbarChartsComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

}
