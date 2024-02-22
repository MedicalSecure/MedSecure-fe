import {Component,ChangeDetectionStrategy,ViewChild,TemplateRef,Input, Output, EventEmitter, input, OnInit, AfterViewInit } from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours, isToday, isAfter,} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CalendarDayViewComponent, CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView,} from 'angular-calendar';
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
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { ElementRef, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import { VisiteService } from '../../service/visite.service';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

export enum ActionType { get ,add,edit,delete}
@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule,
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
    MatFormFieldModule, MatInputModule, MatSelectModule,HttpClientModule,FormsModule ,
    MatButtonModule, MatDividerModule, MatIconModule,MatRadioModule,MatChipsModule,MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    { provide: CalendarDateFormatter, useClass: CalendarDateFormatter },
    CalendarUtils,FlatpickrDefaults,CalendarA11y,CalendarEventTitleFormatter,
    provideNativeDateAdapter(),VisiteService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar-scheduler.component.html',
  styleUrl: './calendar-scheduler.component.css',
})


export class CalendarShedulerComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewday: CalendarView = CalendarView.Day;
  @Input() events: CalendarEvent[]= [];
  @Input() selectedDate: Date = new Date()
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @Output() eventClicked = new EventEmitter<CalendarEvent>();
  @ViewChild('todayButton') todayButton!: ElementRef;

  refresh = new Subject<void>();
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  modalTitle: string = '';
  modalbutton: string = '';
  modalAction: string = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  announcer = inject(LiveAnnouncer);
  patients !: any[];
  filteredPatients !: any[];
  searchQuery: string = '';
  selectedPatient: any;
  selectedTime: string = ''; 

  modalData: {action: string;event: CalendarEvent<any>;} =
   { action: '', event: {} as CalendarEvent<any> };

   constructor(private modal: NgbModal,private http: HttpClient) {
    this.modalData = { action: '', event: {} as CalendarEvent<any> };
  }
 
  triggerTodayClick() {
    if (this.todayButton) {
      this.todayButton.nativeElement.click();
    } else {
      console.error("Today button not found");
    }
  }

  ngOnInit(): void {
   this.loadEvents();
   this.loadPatients();
   console.log("Events in CalendarShedulerComponent: ", this.events);  
   
}
 
  loadPatients(){
   
    this.http.get<any[]>('assets/data/patients.json').subscribe(
      data => {
        this.patients = data;
        this.filteredPatients = data;
        console.log('JSON file dataPatients:', data);
      },
      error => {
        console.error('Error loading JSON file:', error);
      }
    );
   
  }

  search(): void {
    this.filteredPatients = this.patients.filter(patient =>
      patient.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  loadEvents() {
    this.http.get<any[]>('assets/data/visits.json').subscribe(
      data => {
        this.events = data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          patient :event.patient ,
          repetition : event.repetition,
          treatment :event.treatment,
          actionType: event.actionType.map((type: number) => ActionType[type]),
          actions: event.actions,
         
        }));
        this.generateActions();
        this.addAddEventToDaysWithEvents();
        console.log('Events loaded:', this.events);
        this.triggerTodayClick();
      },
      error => {
        console.error('Error loading events:', error);
      }
    );
  }
  selectPatient(patient: any): void {
    // Logique pour sélectionner un patient
    console.log('Patient selected:', patient);
    // Vous pouvez faire d'autres actions ici, comme définir la valeur de selectedPatient
  }

  addAddEventToDaysWithEvents() {
    const daysWithEvents: Date[] = [];
    const today = startOfDay(new Date()); // Get start of today

    // Find unique days with events starting from today
    this.events.forEach(event => {
      const eventDate = startOfDay(event.start);
      if (isAfter(eventDate, today) || isSameDay(eventDate, today)) { // Check if event is today or in the future
        if (!daysWithEvents.some(day => isSameDay(day, eventDate))) {
          daysWithEvents.push(eventDate);
        }
      }
    });

    // Add events for days starting from today
    daysWithEvents.forEach(day => {
      const eventExists = this.events.some(existingEvent =>
        isSameDay(startOfDay(existingEvent.start), day) && existingEvent.title === 'Create an appointment'
      );
      if (!eventExists) {
        this.events.push({
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
    this.events.forEach(event => {
      event.actions = [];

      if (event.actionType.includes(ActionType.get)) {
        event.actions.push({
          label: '<i class="fa-regular fa-eye"></i>',
          a11yLabel: 'get',
          onClick: ({ event }: { event: CalendarEvent<any> }): void => {
            this.handleEvent('readed', event);
  
          }
      });
      }
   
      if (event.actionType.includes(ActionType.add)) {
        event.actions.push({
          label: '<i class="fa-solid fa-plus "></i>',
          a11yLabel: 'add',
          onClick: ({ event }: { event: CalendarEvent<any> }): void => {
            this.handleEvent('Created', event);
          }
      });
      console.log(event)
      }
  
      if (event.actionType.includes(ActionType.edit)) {
        event.actions.push({
          label: '<i class="fas fa-pencil-alt"></i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEvent<any> }): void => {
            this.handleEvent('Edited', event);
  
          }
        });
      }
  
      if (event.actionType.includes(ActionType.delete)) {
        event.actions.push({
          label: '<i class="fas fa-fw fa-trash-alt"></i>',
          a11yLabel: 'Delete',
          onClick: ({ event }: { event: CalendarEvent<any> }): void => {
            this.handleEvent('Deleted', event);
          }
        });
      }
 


    });
  
    console.log("Actions generated successfully");
    
  }
  

  getExistingDates(): Date[] {
    const existingDates: Date[] = [];

    this.events.forEach(event => {
      
      if (event.start && !existingDates.some(day => isSameDay(day, event.start))) {
        existingDates.push(event.start);
      }
    });

    return existingDates;
  }

  getDaysWithEvents(): Date[] {
    const daysWithEvents: Date[] = [];
  
    this.events.forEach(event => {
      //erreur
      if (event.start && !daysWithEvents.some(day => isSameDay(day, event.start))) {
        daysWithEvents.push(event.start);
      }
    });
  
    return daysWithEvents;
  }
  
  handleEventClick(event: CalendarEvent) {
    if (event.title === 'Create an appointment') {
      // Si le titre de l'événement est "Ajouter événements chadha", déclencher l'action de création
      this.handleEvent('Created', event);
    } else {
      // Pour tous les autres événements, déclencher l'action de lecture
      this.handleEvent('readed', event);
    }
  }
  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    const today = startOfDay(new Date());
    if (date < today){
        if(events.length === 0)
     {
      console.log('impossible de trouve événement pour cette date');
    } 
    else{
      this.viewDate = date;
     
    }
  
    }
   else {
    if(events.length === 0){
      console.log('Ajouter événement pour cette date');
      const newEvent: CalendarEvent<any> = {
        title: 'Ajouter événement pour cette date',

        //erreur
        start: date,
        actionType: [ActionType.add] // Ajoutez ici les autres propriétés nécessaires
      };
      // Passer le nouvel événement à handleEvent
      this.handleEvent('Created', newEvent);
        } 
        else {
          if (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) {
            this.activeDayIsOpen = false;
          } else {
            this.activeDayIsOpen = true;
           }
           this.viewDate = date;
        }   
        this.selectedDate = date
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
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
  this.modalData = { event, action };

  switch (action) {
    case 'readed':
      this.modalTitle = 'Read Data';
      this.modalbutton = 'OK';
      this.modalAction = 'get';
      // Logique pour l'action de lecture (get) ici
      break;
    case 'Created':
      this.modalTitle = 'Create an appointment';
      this.modalbutton = 'Create';
      this.modalAction = 'add';
      // Appel à la fonction createVisit()
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
      // Logique pour l'action de suppression (delete) ici
      break;
    default:
      // Par défaut, considérer la création de données
      this.modalTitle = 'Create Data';
      this.modalbutton = 'Create';
      this.modalAction = 'add';
      break;
  }
  this.modal.open(this.modalContent);
  console.log(event, action);
}

confirmDelete(): void {
  // Logique pour confirmer la suppression
  if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
    // Supprimez l'événement
    this.deleteEvent(this.modalData.event);
    this.closeModal();
  }
}

  // addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors['red'],
  //       actionType : [ActionType.add],
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
        
  //     },
  //   ];
  // }

  addEvent(): void {
    // Logique d'ajout d'événement
    const newEvent: CalendarEvent = {
      title: 'Nouvel événement',
      start: new Date(),
      end: new Date(),
      color: colors['red'],
      actionType: [ActionType.add],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    };

    this.events.push(newEvent);

  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
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

        this.saveFormData();
        break;
      case 'edit':
        
        this.saveFormData2(); 
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
    // Logique pour fermer le modal
    this.modal.dismissAll();
  }

  saveFormData(): void {
    const startDate = new Date((document.getElementById('startDate') as HTMLInputElement).value);
    const endDate = new Date((document.getElementById('endDate') as HTMLInputElement).value);
    const patientName = (document.getElementById('patientName') as HTMLInputElement).value;
    const repetition = (document.getElementById('repetition') as HTMLSelectElement).value;
    const treatment = (document.getElementById('treatment') as HTMLTextAreaElement).value;
  
  
    const formData:CalendarEvent =
    {
      start: startDate,
      end: endDate,
      patient:patientName,
      repetition: repetition,
      treatment: treatment,
      title: 'Evenement avec' + patientName,
      color: { ...colors['pink'] },

      actionType: [], 
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,

    }
 
    this.http.get<any[]>('assets/data/visits.json').subscribe((data: any[]) => {
      const updatedData = [...data, formData];

      this.http.put('assets/data/visits.json', updatedData).subscribe(response => {
        console.log('Données enregistrées avec succès !', updatedData);
        this.modal.dismissAll();
      }, error => {
        console.error('Erreur lors de l\'enregistrement des données : ', error);
      });
    });
  }

  editEvent(formData: CalendarEvent): void {
    const index = this.events.findIndex(event => event.id === formData.id);
    if (index !== -1) {
      this.events[index] = formData;

      this.http.get<any[]>('assets/data/visits.json').subscribe((data: any[]) => {
        const updatedData = data.map(event => (event.id === formData.id ? formData : event));

        this.http.put('assets/data/visits.json', updatedData).subscribe(response => {
          console.log('Données mises à jour avec succès !', updatedData);
          this.modal.dismissAll();
        }, error => {
          console.error('Erreur lors de la mise à jour des données : ', error);
        });
      });
    }
  }

  saveFormData2(): void {
    const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    const endDate = (document.getElementById('endDate') as HTMLInputElement).value;
    
  
    const formData = {
      startDate: startDate,
      endDate: endDate,
  
    };
    
  
    // Récupérez le contenu actuel du fichier JSON
    this.http.get<any[]>('assets/data/visits.json').subscribe((data: any[]) => {
      // Ajoutez les nouvelles données au contenu existant
      const updatedData = [...data, formData];
  
      // Écrivez les données mises à jour dans le fichier JSON
      this.http.put('assets/data/visits.json', updatedData).subscribe(response => {
        console.log('Données enregistrées avec succès !',updatedData);
        this.modal.dismissAll();
      }, error => {
        console.error('Erreur lors de l\'enregistrement des données : ', error);
      });
    });
  }
  
  // createVisit(): void {
  //   // Envoyer les données du formulaire à votre backend ou les enregistrer localement dans le fichier JSON

  //   // Par exemple, si vous enregistrez localement dans un fichier JSON
  //   // Vous pouvez ajouter la nouvelle visite à un tableau existant de visites, puis écrire ce tableau dans le fichier JSON

  //   this.http.get<any[]>('assets/data/visits.json').subscribe((visites: any[]) => {
  //     // Ajouter la nouvelle visite à la liste des visites existantes
  //     visites.push(this.newVisit);

  //     // Enregistrer la liste mise à jour dans le fichier JSON
  //     this.http.put('assets/data/visits.json', visites).subscribe(() => {
  //       console.log('Nouvelle visite enregistrée avec succès dans le fichier JSON.');
  //       // Réinitialiser le formulaire après l'enregistrement
        
  //     }, error => {
  //       console.error('Erreur lors de l\'enregistrement de la nouvelle visite dans le fichier JSON:', error);
  //     });
  //   }, error => {
  //     console.error('Erreur lors de la lecture du fichier JSON de visites:', error);
  //   });
  // }

  button1Color: string = '#BFC0C3';
  button2Color: string = '#BFC0C3';
  button1Text: string = '#000000'; 
  button2Text: string = '#000000'
  showAvailabilityField: boolean = false;


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

    }
  }

  button1Color2: string = '#BFC0C3';
  button2Color2: string = '#BFC0C3';
  button1Text2: string = '#000000'; // Couleur de texte par défaut pour le bouton 1
  button2Text2: string = '#000000';
  showNewPatientField : boolean = false;
  changeButtonColors2(buttonClicked: number) {
    if (buttonClicked === 1) {
      this.button1Color2 = '#3B539B';
      this.button2Color2 = '#BFC0C3';
      this.button1Text2 = '#ffffff'; 
      this.button2Text2 = '#000000'; 
    
      
    } else if (buttonClicked === 2) {
      this.button1Color2 = '#BFC0C3'; // Réinitialise la couleur du bouton 1
      this.button2Color2 = '#4560B3';
      this.button1Text2 = '#000000'; // Réinitialise la couleur de texte pour le bouton 1
      this.button2Text2 = '#ffffff';
      this.showNewPatientField = true;
      this.addNewPatient();
    
    }
  }


  addNewPatient(): void {
    // Logique pour ajouter un nouveau patient
    console.log("Ajout d'un nouveau patient en cours...");
  }

  dayClickedaffiche({ date }: { date: Date }): void {
    
    this.selectedDate = date;
  }
  }



  


