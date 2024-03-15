import { Component, Input } from '@angular/core';
import { medicationType } from '../../shared/types/';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-medication',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './card-medication.component.html',
  styleUrl: './card-medication.component.css',
})
export class CardMedicationComponent {
  @Input()
  title: string = 'Current medications';
  @Input()
  medicationList: medicationType[] = [];
  @Input()
  primaryText: string | undefined;
  @Input()
  WarningText: string | undefined;

  @Input()
  containerClass: string = 'card mb-2 py-2';
  @Input()
  containerStyle: { [klass: string]: string } = { maxWidth: '25rem' };
  @Input()
  CardBodyClass: string = 'card-body pb-0 pt-3';
  @Input()
  CardTitleClass: string = 'card-title fs-6 mb-1';
  @Input()
  ULClass: string = 'list p-1 m-0 ps-3';
  @Input()
  TitleAndIconsClass: string =
    'fw-bold fs-6 text-primary mb-0 d-flex justify-content-start align-middle align-items-center"';

  @Input()
  canDelete: boolean = false;
  @Input()
  canEdit: boolean = false;

  getNewlyPrescribedMedicationSig(
    medication: medicationType
  ): string | undefined {
    let result;
    const size = medication.administrationHours.size;
    if (size > 1) result = size + ' times a day';
    else if (size == 1) result = 'single time a day';
    return result;
  }

  onClickEditMedication($index: number, medication: medicationType) {}
  onClickRemoveMedication($index: number, medication: medicationType) {}
}
