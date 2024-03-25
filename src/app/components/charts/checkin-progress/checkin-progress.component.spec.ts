import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInProgressComponent } from './checkin-progress.component';

describe('CheckInProgressComponent', () => {
  let component: CheckInProgressComponent;
  let fixture: ComponentFixture<CheckInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
