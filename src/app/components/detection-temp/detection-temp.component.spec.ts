import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionTempComponent } from './detection-temp.component';

describe('DetectionTempComponent', () => {
  let component: DetectionTempComponent;
  let fixture: ComponentFixture<DetectionTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectionTempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetectionTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
