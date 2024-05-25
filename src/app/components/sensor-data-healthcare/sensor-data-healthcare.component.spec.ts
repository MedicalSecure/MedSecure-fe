import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDataHealthcareComponent } from './sensor-data-healthcare.component';

describe('SensorDataHealthcareComponent', () => {
  let component: SensorDataHealthcareComponent;
  let fixture: ComponentFixture<SensorDataHealthcareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorDataHealthcareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorDataHealthcareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
