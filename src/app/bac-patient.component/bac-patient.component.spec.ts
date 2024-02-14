import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacPatientComponent } from './bac-patient.component';

describe('BacPatientComponent', () => {
  let component: BacPatientComponent;
  let fixture: ComponentFixture<BacPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BacPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BacPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
