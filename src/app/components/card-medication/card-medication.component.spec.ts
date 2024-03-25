import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMedicationComponent } from './card-medication.component';

describe('CardMedicationComponent', () => {
  let component: CardMedicationComponent;
  let fixture: ComponentFixture<CardMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMedicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
