import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp5HospitalizationComponent } from './stp5-hospitalization.component';

describe('Stp5HospitalizationComponent', () => {
  let component: Stp5HospitalizationComponent;
  let fixture: ComponentFixture<Stp5HospitalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp5HospitalizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp5HospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
