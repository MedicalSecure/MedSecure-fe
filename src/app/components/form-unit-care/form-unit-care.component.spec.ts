import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUnitCareComponent } from './form-unit-care.component';

describe('FormUnitCareComponent', () => {
  let component: FormUnitCareComponent;
  let fixture: ComponentFixture<FormUnitCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUnitCareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormUnitCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
