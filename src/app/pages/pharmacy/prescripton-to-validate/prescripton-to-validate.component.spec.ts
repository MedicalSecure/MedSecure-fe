import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptonToValidateComponent } from './prescripton-to-validate.component';

describe('PrescriptonToValidateComponent', () => {
  let component: PrescriptonToValidateComponent;
  let fixture: ComponentFixture<PrescriptonToValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptonToValidateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescriptonToValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
