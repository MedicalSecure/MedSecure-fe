import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsUnitCareComponent } from './cards-unit-care.component';

describe('CardsUnitCareComponent', () => {
  let component: CardsUnitCareComponent;
  let fixture: ComponentFixture<CardsUnitCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsUnitCareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardsUnitCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
