import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-dynamic-multiple-selects',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './dynamic-multiple-selects.component.html',
  styleUrl: './dynamic-multiple-selects.component.css',
})
export class DynamicMultipleSelectsComponent implements OnInit {
  @Input() class: string = '';
  @Input() multiSelectInputs: multiSelectInputType[] = [];
  @Output() selectedInputsChange = new EventEmitter<string[]>();

  selectedInputs: Array<string> = [];

  ngOnInit(): void {
    this.multiSelectInputs.forEach((input,index)=>{
      var firstOption : string =input.options[0]!= undefined ? input.options[0].toString() : "None"
      var stringToAppend:string=input.isRequired ? firstOption : "None"; 
      this.selectedInputs.push(stringToAppend)
    })
    this.onSelectionChange();
  }
  

  onSelectionChange() {
    // Emit the updated array to the parent component
    //console.log("emitted")
    this.selectedInputsChange.emit(
      this.selectedInputs
    );
  }
}

export type multiSelectInputType = {
  index:number;
  label?: string;
  isRequired?: boolean;
  options: Array<string | number>;
};
