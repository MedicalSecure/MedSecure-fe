import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPrescriptionToPrintComponent } from './pdf-prescription-to-print.component';

describe('PdfPrescriptionToPrintComponent', () => {
  let component: PdfPrescriptionToPrintComponent;
  let fixture: ComponentFixture<PdfPrescriptionToPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfPrescriptionToPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfPrescriptionToPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
