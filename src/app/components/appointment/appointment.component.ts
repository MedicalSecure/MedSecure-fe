import { Component, OnInit, Input, Output, TemplateRef, EventEmitter, model } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventType } from '../calendar-scheduler/calendar-scheduler.component';
import { Patients } from '../../model/patients';
import { visits } from '../../model/visits';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, MatChipsModule,],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  NamePatient: string
  dialogRef!: MatDialogRef<any>;
  patients: Patients[] = [];
  filteredPatients!: any[];
  searchQuery: string = '';
  selectedPatient: any;
  formDataToEdit: any;
  selectedBackgroundColor: string = '';
  selectedTextColor: string = '';
  selectedPatientName: string = '';
  button1Color: string = '#BFC0C3';
  button2Color: string = '#BFC0C3';
  button1Text: string = '#000000';
  button2Text: string = '#000000';
  showAvailabilityField: boolean = false;

  durations = [
    { value: '20 min', label: '20 min' },
    { value: '30 min', label: '30 min' },
    { value: '60 min', label: '60 min' },
    { value: 'other', label: 'Other' }
  ];


  @Input() modalTitle: string = '';
  @Input() modalbutton: string = '';
  @Input() modalAction: string = '';
  @Input() formData: any = {
    id: '0',
    duration: '20 min',
    description: '',
    typevisits: 0,
    disponibilite: 0,
    avaibility: ''
  };
  @Input() selectedDate: Date | string = new Date();

  @Input() modalData: { event: CalendarEventType<any> } = { event: {} as CalendarEventType<any> };
  @Input() selectedTime: string = '';
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  @Output() eventDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventCreated: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventUpdated: EventEmitter<any> = new EventEmitter<any>();
  constructor(private modal: NgbModal, private http: HttpClient, private router: Router) { }


  ngOnInit(): void {
    this.loadPatients();
    if (this.modalData) {
      console.log('Données de l\'événement sélectionné :', this.modalData);
    }

  }



  openModal(action: string) {
    this.modalAction = action;
    this.modal.open(this.modalContent);

  }
  openEditModal() {
    this.openModal('edit');
  }

  openDeleteModal() {
    this.openModal('delete');
  }



  performAction(): void {
    switch (this.modalAction) {
      case 'get':
        this.closeModal();
        break;
      case 'add':
        this.saveFormData(this.formData);
        break;
      case 'edit':
        this.updateEventData(this.formData);
        break;
      case 'delete':
        this.confirmDelete();
        break;
      default:
        this.closeModal();
        break;
    }
  }


  closeModal() {
    this.modal.dismissAll()
  }


  saveFormData(formData: any) {
    const newEvent: CalendarEventType = {
      start: this.selectedDate,
      patient: this.formData.patient,
      typevisits: this.formData.typevisits,
      disponibilite: this.formData.disponibilite,
      avaibility: this.formData.avaibility,
      description: this.formData.description,
      duration: this.formData.duration,
      title: 'Evenement avec ' + this.formData.NamePatient,
      actionType: [],
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    };

    this.eventCreated.emit(newEvent);

  }



  changeButtonColors(buttonClicked: number) {
    if (buttonClicked === 1) {
      this.button1Color = '#3B539B';
      this.button2Color = '#BFC0C3';
      this.button1Text = '#ffffff';
      this.button2Text = '#000000';
      this.showAvailabilityField = true;
    } else if (buttonClicked === 2) {
      this.button1Color = '#BFC0C3'; // Réinitialise la couleur du bouton 1
      this.button2Color = '#4560B3';
      this.button1Text = '#000000'; // Réinitialise la couleur de texte pour le bouton 1
      this.button2Text = '#ffffff';
      this.showAvailabilityField = false;
      this.saveCurrentTime();
    }
  }

  formatTime(date: Date): string {

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();


    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
      seconds
    )}`;
  }

  padZero(num: number): string {

    return (num < 10 ? '0' : '') + num;
  }

  saveTime(): void {
    const currentTime = new Date();

    const formattedTime = this.formatTime(currentTime);

    this.selectedTime = formattedTime;
  }

  saveCurrentTime(): void {
    const currentTime = new Date();
    const formattedTime = this.formatTime(currentTime);
    console.log('Heure actuelle :', formattedTime);
    this.formData.avaibility = formattedTime;
  }


  updateEventData(formData: any): void {
    if (this.formData && this.modalData && this.modalData.event) {
      this.formData.id = this.modalData.event.id;
      console.log('ID de l\'événement:', this.formData.id);
      const updateEvent: CalendarEventType = {
        id: this.formData.id,
        start: this.selectedDate,
        patient: this.formData.patient,
        typevisits: this.formData.typevisits,
        disponibilite: this.formData.disponibilite,
        avaibility: this.formData.avaibility,
        description: this.formData.description,
        duration: this.formData.duration,
        title: 'Evenement avec ' + this.formData.NamePatient,
        actionType: [],
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      };
      this.eventUpdated.emit(updateEvent);
      this.closeModal();
    } else {
      console.error('Les données de formulaire ou les données de l\'événement ne sont pas définies.');
    }
  }


  updateDuration(event: any) {
    this.formData.duration = event.target.value;
    console.log(this.formData.duration)
  }


  updateDescription(event: any) {
    this.formData.description = event.target.value;
    console.log(this.formData.description)

  }

  updateTypeVisits(event: any) {
    this.formData.typevisits = event;
    console.log(this.formData.typevisits)
  }
  updateDisponibilite(event: any) {
    this.formData.disponibilite = event.target.value;
    console.log(this.formData.disponibilite)
  }

  updateAvailability(event: any) {
    this.formData.avaibility = event.target.value;
    console.log(this.formData.avaibility);
  }


  confirmDelete(): void {
    const confirmation = confirm('Are you sure you want to delete this event?');
    if (confirmation) {
      const visitId = this.modalData.event.id; // Assuming the visit ID is stored in the event object
      this.deleteVisit(visitId);
      this.closeModal();
    }
  }

  deleteVisit(visitId: string | number | undefined): void {
    this.http.delete(`http://localhost:5004/v1/visits/${visitId}?Id=${visitId}`).subscribe(
      () => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['visits']);
        })
        console.log('Visit deleted successfully');
      },
      (error) => {
        console.error('Error deleting visit:', error);
      }
    );
  }


  loadPatients() {
    this.http.get<any>('assets/data/patients.json').subscribe(
      (data) => {
        this.patients = data.patients.data;
        this.filteredPatients = this.patients;
        //  this.selectPatient(this.patients);
        console.log('backends file dataPatients:', data);
      },
      (error) => {
        console.error('Error loading JSON file:', error);
      }
    );
  }

  search(event: any): void {
    if (event && event.target && event.target.value) {
      this.searchQuery = event.target.value;
      this.filteredPatients = this.patients.filter(
        (patient: any) =>
          patient.firstName.toLowerCase().includes(this.searchQuery) ||
          patient.lastName.toLowerCase().includes(this.searchQuery)
      );
    }
  }

  selectPatient(patient: Patients): void {
    if (this.selectedPatient === patient) {
      this.selectedPatient = null;
    } else {
      this.selectedPatient = patient;
      this.NamePatient = patient.firstName + ' ' + patient.lastName;
      this.formData.patient = this.selectedPatient;
      console.log('this.selectedPatient:', this.selectedPatient);
      console.log('this.NamePatient:', this.NamePatient);
      console.log('this.formData.patient:', this.formData.patient);
    }
  }

}
