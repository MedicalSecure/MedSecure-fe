import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionEnvironnement } from './detection-environnement.component';

describe('DetectionEnvironnement', () => {
  let component: DetectionEnvironnement;
  let fixture: ComponentFixture<DetectionEnvironnement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectionEnvironnement]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetectionEnvironnement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
