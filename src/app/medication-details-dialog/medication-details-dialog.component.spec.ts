import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationDetailsDialogComponent } from './medication-details-dialog.component';

describe('MedicationDetailsDialogComponent', () => {
  let component: MedicationDetailsDialogComponent;
  let fixture: ComponentFixture<MedicationDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
