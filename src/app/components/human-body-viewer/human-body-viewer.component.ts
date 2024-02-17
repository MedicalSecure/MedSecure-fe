import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-human-body-viewer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './human-body-viewer.component.html',
  styleUrl: './human-body-viewer.component.css',
})
export class HumanBodyViewerComponent {
  isFrontSideChosen = true;
  isSelected = true;
  selectedParts: Set<string>;

  constructor() {
    this.selectedParts = new Set();
  }

  toggleSwitchView() {
    this.isFrontSideChosen = !this.isFrontSideChosen;
  }

  onBodyPartClick(source: string) {
    if (this.selectedParts.has(source)) {
      this.selectedParts.delete(source);
      return;
    }
    this.selectedParts.add(source);
  }

  isPartSelected(source: string): boolean {
    return this.selectedParts.has(source);
  }
}
