import { Component, OnInit, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, MatChipsModule,],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  dialogRef!: MatDialogRef<any>;
  patients!: any[];
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
    duration: '20 min',
    description: '',
    typevisits: 'First consultation',
    disponibilite: 'clinic',
    avaibility: ''
  };
  @Input() selectedDate: Date = new Date();

  @Input() modalData: { event: CalendarEvent<any> } = { event: {} as CalendarEvent<any> };
  @Input() selectedTime: string = '';
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  @Output() eventDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventCreated: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventUpdated: EventEmitter<any> = new EventEmitter<any>();
  constructor(private modal: NgbModal, private http: HttpClient) { }


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



  loadPatients() {
    this.http.get<any[]>('assets/data/patients.json').subscribe(
      (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.selectPatient(data);
        console.log('JSON file dataPatients:', data);
      },
      (error) => {
        console.error('Error loading JSON file:', error);
      }
    );
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
    const newEvent: CalendarEvent = {
      start: this.selectedDate,
      patient: this.formData.patient,
      typevisits: this.formData.typevisits,
      disponibilite: this.formData.disponibilite,
      avaibility: this.formData.avaibility,
      description: this.formData.description,
      duration: this.formData.duration,

      title: 'Evenement avec' + ' ' + this.formData.patient,

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


  dayClickedaffiche({ date }: { date: Date }): void {
    this.selectedDate = date;
  }

  timeClickedaffiche({ date }: { date: Date }): void {
    // Récupérer l'heure actuelle
    const currentTime = new Date();

    const formattedTime = this.formatTime(currentTime);

    this.selectedTime = formattedTime;
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
    const updatedEvent = { ...this.modalData.event, ...formData };
    this.eventUpdated.emit(updatedEvent);
    this.closeModal();
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
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      this.deleteEvent(this.modalData.event);
      this.closeModal();
    }
  }
  deleteEvent(eventToDelete: any) {
    this.eventDeleted.emit(eventToDelete);
  }



  search(event: any): void {
    if (event && event.target && event.target.value) {
      this.searchQuery = event.target.value;
      this.filteredPatients = this.patients.filter(
        (patient) =>
          patient.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          patient.prenom.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }



  selectPatient(patient: any): void {
    if (this.selectedPatient === patient) {
      this.selectedPatient = null;
    } else {
      this.selectedPatient = patient;
      this.formData.patient = patient.nom + ' ' + patient.prenom;
      console.log('Patient selected:', this.formData.patient);
    }
  }




}
