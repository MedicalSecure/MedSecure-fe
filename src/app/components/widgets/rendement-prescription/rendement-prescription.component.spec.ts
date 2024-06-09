import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendementPrescriptionComponent } from './rendement-prescription.component';

describe('RendementPrescriptionComponent', () => {
  let component: RendementPrescriptionComponent;
  let fixture: ComponentFixture<RendementPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendementPrescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RendementPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
