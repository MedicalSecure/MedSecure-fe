import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriCheckCircleProgressComponent } from './tricheckcircle-progress.component';

describe('TriCheckCircleProgressComponent', () => {
  let component: TriCheckCircleProgressComponent;
  let fixture: ComponentFixture<TriCheckCircleProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriCheckCircleProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriCheckCircleProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
