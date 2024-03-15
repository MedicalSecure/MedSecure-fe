import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarShedulerComponent } from './calendar-scheduler.component';

describe('CalendarViewComponent', () => {
  let component: CalendarShedulerComponent;
  let fixture: ComponentFixture<CalendarShedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarShedulerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarShedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
