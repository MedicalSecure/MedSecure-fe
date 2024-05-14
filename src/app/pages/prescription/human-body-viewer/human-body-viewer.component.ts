import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-human-body-viewer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './human-body-viewer.component.html',
  styleUrl: './human-body-viewer.component.css',
})
export class HumanBodyViewerComponent {
  @Input() selectedParts: Set<string>;
  @Input() isFrontSideChosen = true;

  /**
   * switch between two modes: selectedParts is managed by this component or the parent component
   * @param {boolean} handleClicksByParent - Part of body name, example Neck
   */
  @Input() handleClicksByParent = false;

  @Output()
  onSelectedPartsChange: EventEmitter<Set<string>>= new EventEmitter<Set<string>>();

  @Output()
  onBodyPartClickEvent: EventEmitter<onBodyPartClickEventType> = new EventEmitter<onBodyPartClickEventType>();

  isFilterEnabled:boolean=false;

  @Output()
  isFilteringEnabledChange: EventEmitter<onFilterChangeEventType>= new EventEmitter<onFilterChangeEventType>();


  constructor() {
    this.selectedParts = new Set();
  }

  toggleSwitchView() {
    this.isFrontSideChosen = !this.isFrontSideChosen;
  }

  toggleFilteringSymptomsSearch(){
    let newState=!this.isFilterEnabled;

    this.isFilterEnabled=newState;
    this.isFilteringEnabledChange.emit({isFilterEnabled:newState,selectedParts:this.selectedParts});
  }
  /**
   * emit event whenever a part of body is click
   * IF the handleClicksByParent===true
   *    selectedParts on onBodyPartClickEventType will have the old selectedParts state (new clicked part is not yet selected)
   *    so its for the parent to handle that
   * ENDIF
   * IF the handleClicksByParent===false
   *    selectedParts on onBodyPartClickEventType will be up to date with the new state (new clicked part is now selected)
   *
   * @param {string} source - Part of body name, example Neck
   */
  onBodyPartClick(source: string) {
    this.isFilterEnabled=true;
    let wasSelected = this.isPartSelected(source);
    let event: onBodyPartClickEventType = {
      wasSelected: wasSelected,
      partName: source,
      selectedParts: this.selectedParts,
    };
    if (this.handleClicksByParent) {
      //handle the selection logic inside the parent
      this.onBodyPartClickEvent.emit(event);
      return;
    }

    //handle the selection logic here
    if (wasSelected) this.selectedParts.delete(source);
    else this.selectedParts.add(source);

    //emit changes
    this.onSelectedPartsChange.emit(this.selectedParts);

    //deselect the filter button if no parts are selected (for appearance only)
    if(this.selectedParts.size===0) this.isFilterEnabled=false;
  }

  isPartSelected(source: string): boolean {
    return this.selectedParts.has(source);
  }

  onDeselectAllBodyPartsClick(){
    this.isFilterEnabled=false;

    if (this.handleClicksByParent) {
      this.onSelectedPartsChange.emit(new Set<string>());
      return;
    }
    this.selectedParts.clear(); 
    //emit changes
    this.onSelectedPartsChange.emit(this.selectedParts);
  }
}

export type onBodyPartClickEventType = {
  partName: string;
  wasSelected: boolean;
  selectedParts: Set<string>;
};
export type onFilterChangeEventType = {
  isFilterEnabled: boolean;
  selectedParts: Set<string>;
};

export const bodyPartsOfHumanBody: string[] = [
  'Head',
  'Neck',
  'Chest',
  'Right Hand',
  'Left Hand',
  'Abdomen',
  'Pelvis',
  'Right Leg',
  'Left Leg',
  'Back',
  'Buttocks',
  'Skin',
];
