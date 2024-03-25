import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInfoCardsComponent } from './patient-info-cards.component';

describe('PatientInfoCardsComponent', () => {
  let component: PatientInfoCardsComponent;
  let fixture: ComponentFixture<PatientInfoCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientInfoCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientInfoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
