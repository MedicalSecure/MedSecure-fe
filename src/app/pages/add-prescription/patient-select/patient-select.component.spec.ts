import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSelectComponent } from './patient-select.component';

describe('PatientSelectComponent', () => {
  let component: PatientSelectComponent;
  let fixture: ComponentFixture<PatientSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
