import { AfterViewInit, Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Input, Output, EventEmitter, OnInit, } from '@angular/core';
import { startOfDay, isSameDay, isAfter } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDateFormatter } from 'angular-calendar';
import { HttpClientModule } from '@angular/common/http';
import { CalendarA11y } from 'angular-calendar';
import { CalendarUtils } from 'angular-calendar';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { CalendarEventTitleFormatter } from 'angular-calendar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentComponent } from '../appointment/appointment.component'
import { CalendarMonthViewDay } from 'angular-calendar';


const colors: Record<string, EventColor> = {
  red: { primary: '#ad2121', secondary: '#FAE3E3', },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF', },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA', },
};

export enum ActionType { get, add, edit, delete, }
@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule,
    HttpClientModule,
    CalendarModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatRadioModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AppointmentComponent
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    { provide: CalendarDateFormatter, useClass: CalendarDateFormatter },
    CalendarUtils, FlatpickrDefaults, CalendarA11y, CalendarEventTitleFormatter, provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar-scheduler.component.html',
  styleUrl: './calendar-scheduler.component.css',
})

export class CalendarShedulerComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewday: CalendarView = CalendarView.Day;
 // @Input() events: CalendarEventType[] = [];
  @Input() events: CalendarEvent[] = [];

  CastedEvents=this.events as CalendarEventType[];
  @Input() selectedDate: Date = new Date();
  @Input() selectedTime: string = '';
  @Input() formData: any = {
    duration: '20 min',
    description: '',
    typevisits: 'First consultation',
    disponibilite: 'clinic',
    avaibility: ''
  };
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @Output() eventClicked = new EventEmitter<CalendarEventType>();
  @ViewChild('todayButton') todayButton!: ElementRef;
  @Output() modalData: { action: string; event: CalendarEventType<any> } = {
    action: '',
    event: {} as CalendarEventType<any>,
  };
  selectedEvent: CalendarEventType<any> | undefined;
  refresh = new Subject<void>();
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  modalTitle: string = '';
  modalbutton: string = '';
  modalAction: string = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  announcer = inject(LiveAnnouncer);
  patients!: any[];
  filteredPatients!: any[];
  searchQuery: string = '';
  selectedPatient: any;
  formDataToEdit: any;
  selectedBackgroundColor: string = '';
  selectedTextColor: string = '';
  selectedPatientName: string = '';
  button1Color2: string = '#3B539B';
  button2Color2: string = '#BFC0C3';
  button1Text2: string = '#ffffff';
  button2Text2: string = '#000000';
  showNewPatientField: boolean = false;

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


  constructor(private modal: NgbModal, private http: HttpClient) {
    this.modalData = { action: '', event: {} as CalendarEventType<any> };
  }

  modalOpen: boolean = true;

  openModal() {
    this.modalOpen = true;
  }

  closeModal1() {
    this.modalOpen = false;
  }

  triggerTodayClick() {
    if (this.todayButton) {
      this.todayButton.nativeElement.click();
    } else {
      console.error('Today button not found');
    }
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadPatients();
    this.formData = { ...this.modalData };

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


  loadEvents() {
    this.http.get<any[]>('assets/data/visits.json').subscribe(
      (data) => {
        this.CastedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          patient: event.patient,
          typevisits: event.typevisits,
          disponibilite: event.disponibilite,
          duration: event.duration,
          avaibility: event.avaibility,
          description: event.description,
          actionType: event.actionType.map((type: number) => ActionType[type]),
          actions: event.actions,
        }));
        this.generateActions();
        this.addAddEventToDaysWithEvents();
        console.log('Events loaded:', this.CastedEvents);
        this.triggerTodayClick();
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    );
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

  addAddEventToDaysWithEvents() {
    const daysWithEvents: Date[] = [];
    const today = startOfDay(new Date());
    this.CastedEvents.forEach((event) => {
      const eventDate = startOfDay(event.start);
      if (isAfter(eventDate, today) || isSameDay(eventDate, today)) {
        if (!daysWithEvents.some((day) => isSameDay(day, eventDate))) {
          daysWithEvents.push(eventDate);
        }
      }
    });
    daysWithEvents.forEach((day) => {
      const eventExists = this.CastedEvents.some(
        (existingEvent) =>
          isSameDay(startOfDay(existingEvent.start), day) &&
          existingEvent.title === 'Create an appointment'
      );
      if (!eventExists) {
        this.CastedEvents.push({
          start: day,
          title: 'Create an appointment',
          color: { ...colors['yellow'] },
          actionType: [ActionType.add],
          allDay: true,
        });
      }
    });
  }

  generateActions(): void {
    this.CastedEvents.forEach((event) => {
      event.actions = [];

      if (event.actionType.includes(ActionType.get)) {
        event.actions.push({
          label: '<i class="fa-solid fa-stethoscope"></i>',
          a11yLabel: 'get',
          onClick: ({ event }: { event: CalendarEventType<any> }): void => {
            this.handleEvent('readed', event);
          },
        });
      }

      if (event.actionType.includes(ActionType.add)) {
        event.actions.push({
          label: '<i class="fa-solid fa-plus "></i>',
          a11yLabel: 'add',
          onClick: ({ event }: { event: CalendarEventType<any> }): void => {
            this.handleEvent('Created', event);
          },
        });
        console.log(event);
      }

      if (event.actionType.includes(ActionType.edit)) {
        event.actions.push({
          label: '<i class="fas fa-pencil-alt"></i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEventType<any> }): void => {
            this.handleEvent('Edited', event);
          },
        });
      }

      if (event.actionType.includes(ActionType.delete)) {
        event.actions.push({
          label: '<i class="fas fa-fw fa-trash-alt"></i>',
          a11yLabel: 'Delete',
          onClick: ({ event }: { event: CalendarEventType<any> }): void => {
            this.handleEvent('Deleted', event);
          },
        });
      }
    });

    console.log('Actions generated successfully');
  }

  getExistingDates(): Date[] {
    const existingDates: Date[] = [];

    this.CastedEvents.forEach((event) => {
      if (
        event.start &&
        !existingDates.some((day) => isSameDay(day, event.start))
      ) {
        existingDates.push(event.start);
      }
    });

    return existingDates;
  }

  getDaysWithEvents(): Date[] {
    const daysWithEvents: Date[] = [];

    this.CastedEvents.forEach((event) => {
      //erreur
      if (
        event.start &&
        !daysWithEvents.some((day) => isSameDay(day, event.start))
      ) {
        daysWithEvents.push(event.start);
      }
    });

    return daysWithEvents;
  }

  handleEventClick(event: any): void  {
    console.log(event)
    if (event.title === 'Create an appointment') {
      this.selectedEvent = event;
      this.handleEvent('Created', event);
    } else {
      this.handleEvent('readed', event);
    }
  }

  // dayClicked({ date, events }: { date: Date; events: CalendarEventType[] }): void {
  dayClicked({ day }: { day: CalendarMonthViewDay<any> }): void {
    const today = startOfDay(new Date());
    const date = day.date;
    const events = day.events;
  
    if (date < today) {
      if (events.length === 0) {
        console.log('impossible de trouve événement pour cette date');
      } else {
        this.viewDate = date;
      }
    } else {
      if (events.length === 0) {
        console.log('Ajouter événement pour cette date');
        const newEvent: CalendarEventType<any> = {
          title: 'Ajouter événement pour cette date',
          start: date,
          patient: this.modalData.event.patient,
          typevisits: this.modalData.event.typevisits,
          disponibilite: this.modalData.event.disponibilite,
          avaibility: this.modalData.event.avaibility,
          description: this.modalData.event.description,
          duration: this.modalData.event.duration,
          actionType: [ActionType.edit, ActionType.delete],
        };
        this.handleEvent('Created', newEvent);
      } else {
        if (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
        this.viewDate = date;
      }
      this.selectedDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event as CalendarEventType,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event as CalendarEventType);
  }

  handleEvent(action: string, event: CalendarEventType): void {
    this.modalData = { event, action };
    console.log('fffffffff',this.modalData )
    switch (action) {
      case 'readed':
        this.modalTitle = 'Read Data';
        this.modalbutton = 'OK';
        this.modalAction = 'get';

        break;
      case 'Created':
        this.modalTitle = 'Create an appointment';
        this.modalbutton = 'Create';
        this.modalAction = 'add';

        break;
      case 'Edited':
        this.modalTitle = 'Edited Data';
        this.modalbutton = 'Edit';
        this.modalAction = 'edit';

        break;
      case 'Deleted':
        this.modalTitle = 'Deleted Data';
        this.modalbutton = 'Delete';
        this.modalAction = 'delete';

        break;
      default:
        this.modalTitle = 'Create Data';
        this.modalbutton = 'Create';
        this.modalAction = 'add';
        break;
    }
    this.modal.open(this.modalContent);
    console.log(event, action);
  }

  confirmDelete(): void {
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      this.deleteEvent(this.modalData.event);
      this.closeModal();
    }
  }

  addEvent(): void {
    const newEvent: CalendarEventType = {
      title: 'Nouvel événement',
      start: new Date(),
      end: new Date(),
      color: colors['red'],
      actionType: [ActionType.edit, ActionType.delete],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    };

    this.CastedEvents.push(newEvent);

  }

  deleteEvent(eventToDelete: CalendarEventType) {
    console.log('Événement à supprimer :', eventToDelete);
    this.CastedEvents = this.CastedEvents.filter((event) => event !== eventToDelete);
    console.log('Événements après suppression :', this.CastedEvents);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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
    this.modal.dismissAll();
  }

  saveFormData(formData: any): void {
    this.http.get<any[]>('assets/data/visits.json').subscribe(
      (existingData: any[]) => {
        const updatedData = [...existingData, formData];
        this.http.put('assets/data/visits.json', updatedData).subscribe(
          (response) => {
            console.log('Données enregistrées avec succès !', updatedData);

            const newEvent: CalendarEventType = {
              start: this.selectedDate,
              patient: this.formData.patient,
              typevisits: this.formData.typevisits,
              disponibilite: this.formData.disponibilite,
              avaibility: this.formData.avaibility,
              description: this.formData.description,
              duration: this.formData.duration,

              title: 'Evenement avec' + ' ' + this.formData.patient,
              color: { ...colors['pink'] },

              actionType: [ActionType.edit, ActionType.delete],
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
            };

            this.modal.dismissAll()
            this.CastedEvents.push(newEvent);
          },
          (error) => {
            console.error(
              "Erreur lors de l'enregistrement des données : ",
              error
            );
          }
        );
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des données existantes : ',
          error
        );
      }
    );
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

  addNewPatient(): void {
    // Logique pour ajouter un nouveau patient
    console.log("Ajout d'un nouveau patient en cours...");
  }

  dayClickedaffiche({ date }: { date: Date }): void {
    this.selectedDate = date;
  }

  timeClickedaffiche({ date }: { date: Date }): void {

    const currentTime = new Date();

    const formattedTime = this.formatTime(currentTime);

    this.selectedTime = formattedTime;
  }

  formatTime(date: Date): string {
    // Obtenez les composants de l'heure
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Formatez-les comme vous le souhaitez, par exemple HH:MM:SS
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(
      seconds
    )}`;
  }

  padZero(num: number): string {
    // Ajoute un zéro devant si le nombre est inférieur à 10
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
    this.modalData.event = { ...this.modalData.event, ...formData };
    this.CastedEvents = this.CastedEvents.map((event) => {
      if (event.id === this.modalData.event.id) {
        return { ...event, ...this.modalData.event };
      } else {
        return event;
      }
    });
    this.saveToFile(this.CastedEvents);
    this.closeModal();
  }

  private saveToFile(data: any): void {
    this.http.put('assets/data/visits.json', data).subscribe(
      (response) => {
        console.log('Données mises à jour avec succès !', data);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des données : ', error);
      }
    );
  }


  updateDuration(event: any) {
    this.formData.duration = event.target.value;
    console.log(this.formData.duration)
  }


  updateDescription(event: any) {
    this.formData.description = event.target.value;
  }

  updateTypeVisits(event: any) {
    this.formData.typevisits = event.target.value;
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



}

export interface EventAction {
  id?: string | number;
  label: string;
  cssClass?: string;
  a11yLabel?: string;
  onClick({ event, sourceEvent, }: {
    event: CalendarEventType;
    sourceEvent: MouseEvent | KeyboardEvent;
  }): any;
}
export interface CalendarEventType <MetaType = any>  {

  typevisits?: any;
  disponibilite?: any;
  avaibility?: any;
  description?: any;
  duration?: any;
  actionType: ActionType[];
  patient?: any;
  id?: string | number;
  start: Date;
  end?: Date;
  title: string;
  color?: EventColor;
  actions?: EventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: MetaType;
}
