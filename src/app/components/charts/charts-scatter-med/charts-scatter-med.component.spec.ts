import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsScatterMedComponent } from './charts-scatter-med.component';

describe('ChartsScatterMedComponent', () => {
  let component: ChartsScatterMedComponent;
  let fixture: ComponentFixture<ChartsScatterMedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsScatterMedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartsScatterMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
