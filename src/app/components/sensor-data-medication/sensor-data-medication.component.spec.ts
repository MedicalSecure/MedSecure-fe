import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDataMedicationComponent } from './sensor-data-medication.component';

describe('SensorDataMedicationComponent', () => {
  let component: SensorDataMedicationComponent;
  let fixture: ComponentFixture<SensorDataMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorDataMedicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorDataMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
