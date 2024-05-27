import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Input, Output, EventEmitter, OnInit, } from '@angular/core';
import { startOfDay, isSameDay, eachDayOfInterval, isBefore, isToday, isAfter, endOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
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
import { Patients } from '../../model/patients';
import { Socket } from 'ngx-socket-io'
import { EventColor } from 'calendar-utils';
import { Router } from '@angular/router';
import {VisitService} from '../../services/visits/visits.service'
import {VisitService} from '../../services/visits.service'
import { ActionType } from '../../interface/ActionType';
import {CalendarEventType} from '../../interface/CalendarEventType';
import {TypeVisit} from '../../interface/TypeVisit'
import {LocationVisit} from '../../interface/LocationVisit'
const colors: Record<string, EventColor> = {
  red: { primary: '#ad2121', secondary: '#FAE3E3', },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF', },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA', },
};
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

  CastedEvents = this.events as CalendarEventType[];
  @Input() selectedDate: Date = new Date();
  @Input() selectedTime: string = '';
  @Input() formData: any = {
    id: '',
    duration: '20 min',
    description: '',
    typeVisit: 0,
    disponibilite: 0,
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
  patients: any[];
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


  constructor(private modal: NgbModal, private visitService: VisitService, private router: Router) {
    this.modalData = { action: '', event: {} as CalendarEventType<any> };
  }

  modalOpen: boolean = true;


  ngOnInit(): void {
    this.loadEvents();
    this.formData = { ...this.modalData };

  }



  loadEvents() {
    this.visitService.getVisits().subscribe(
      (data) => {
          this.CastedEvents = data.visits.data.map((event: any) => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          patient: `${event.patient.firstName} ${event.patient.lastName}`,
          typevisits: TypeVisit[event.typeVisit],
          title: 'Appoitement with ' + event.patient.firstName + '' + event.patient.lastName,
          disponibilite: LocationVisit[event.locationVisit],
          duration: event.duration,
          avaibility: event.availability,
          description: event.description,
          actionType: [ActionType.get, ActionType.edit, ActionType.delete],
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

  addAddEventToDaysWithEvents() {
    const daysWithEvents: Date[] = [];
    const today = startOfDay(new Date());
    this.CastedEvents.forEach((event) => {
      const eventStartDate = startOfDay(event.start);
      const eventEndDate = startOfDay(event.end);
      
      if (isAfter(eventStartDate, today) || isSameDay(eventStartDate, today)) {
        if (!daysWithEvents.some((day) => isSameDay(day, eventStartDate))) {
          daysWithEvents.push(eventStartDate);
        }
  
        // Add events for each day between event start date and end date
        for (let d = new Date(eventStartDate); d <= eventEndDate; d.setDate(d.getDate() + 1)) {
          const day = startOfDay(d);
          if (!daysWithEvents.some((existingDay) => isSameDay(existingDay, day))) {
            daysWithEvents.push(day);
          }
        }
      }
    });
  
    // Add "Create an appointment" event for each day with an event
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
          a11yLabel: 'edit',
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

  triggerTodayClick() {
    if (this.todayButton) {
      this.todayButton.nativeElement.click();
    } else {
      console.error('Today button not found');
    }
  }

  handleEventClick(event: any): void {
    console.log(event)
    if (event.title === 'Create an appointment') {
      this.selectedEvent = event;
      this.handleEvent('Created', event);
    } else {
      this.handleEvent('readed', event);
    }
  }



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
    switch (action) {
      case 'readed':
        this.modalTitle = event.title;
        this.modalbutton = 'OK';
        this.modalAction = 'get';

        break;
      case 'Created':
        this.modalTitle = 'Create an appointment';
        this.modalbutton = 'Create';
        this.modalAction = 'add';

        break;
      case 'Edited':
        this.modalTitle = event.title;
        this.modalbutton = 'Edit';
        this.modalAction = 'edit';

        break;
      case 'Deleted':
        this.modalTitle = event.title;
        this.modalbutton = 'Delete';
        this.modalAction = 'delete';

        break;
      default:
        this.modalTitle = 'Create an appointment';
        this.modalbutton = 'Create';
        this.modalAction = 'add';
        break;
    }
    this.modal.open(this.modalContent);
    console.log(event, action);
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
  }

  

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  closeModal() {
    this.modal.dismissAll();
  }

  saveFormData(formData: any): void {
    this.visitService.creatVisits(formData).subscribe(
      (response) => {
        console.log('Données enregistrées avec succès !', response);
        this.modal.dismissAll();
       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['visits']);
      });
      },
      (error) => {
        console.error("Erreur lors de l'enregistrement des données : ", error);
      }
    );
  }


  updateEventData(formData: any): void {
    this.visitService.updateVisits(formData).subscribe(
      (response) => {
        console.log('Données mises à jour avec succès !', response);
        this.modal.dismissAll();
        // window.location.reload();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['visits']);
        });
      },
      (error) => {
        console.error("Erreur lors de la mise à jour des données : ", error);
      }
    );
  }

  updateView(newEvents: CalendarEvent[]): void {
    // Supprimer les événements de création de rendez-vous précédents
    this.events = this.events.filter(event => event.title !== 'Create an appointment');

    // Ajouter les nouveaux événements
    this.events.push(...newEvents);

    this.refresh.next();
  }


}












