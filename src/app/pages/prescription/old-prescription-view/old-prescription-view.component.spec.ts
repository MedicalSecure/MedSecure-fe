import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldPrescriptionViewComponent } from './old-prescription-view.component';

describe('OldPrescriptionViewComponent', () => {
  let component: OldPrescriptionViewComponent;
  let fixture: ComponentFixture<OldPrescriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldPrescriptionViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OldPrescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
