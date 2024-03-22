import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsListeMedstockComponent } from './charts-liste-medstock.component';

describe('ChartsListeMedstockComponent', () => {
  let component: ChartsListeMedstockComponent;
  let fixture: ComponentFixture<ChartsListeMedstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsListeMedstockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartsListeMedstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
