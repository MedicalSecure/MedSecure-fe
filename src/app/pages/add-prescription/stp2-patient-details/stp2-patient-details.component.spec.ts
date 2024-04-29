import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp2PatientDetailsComponent } from './stp2-patient-details.component';

describe('PatientInfoCardsComponent', () => {
  let component: Stp2PatientDetailsComponent;
  let fixture: ComponentFixture<Stp2PatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp2PatientDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp2PatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
