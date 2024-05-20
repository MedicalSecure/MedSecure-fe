import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationsPrescribedComponent } from './medications-prescribed.component';

describe('MedicationsPrescribedComponent', () => {
  let component: MedicationsPrescribedComponent;
  let fixture: ComponentFixture<MedicationsPrescribedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationsPrescribedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicationsPrescribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
