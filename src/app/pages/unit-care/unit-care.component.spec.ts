import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCareComponent } from './unit-care.component';

describe('UnitCareComponent', () => {
  let component: UnitCareComponent;
  let fixture: ComponentFixture<UnitCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitCareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
