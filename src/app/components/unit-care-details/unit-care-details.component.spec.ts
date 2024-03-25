import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCareDetailsComponent } from './unit-care-details.component';

describe('UnitCareDetailsComponent', () => {
  let component: UnitCareDetailsComponent;
  let fixture: ComponentFixture<UnitCareDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitCareDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitCareDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
