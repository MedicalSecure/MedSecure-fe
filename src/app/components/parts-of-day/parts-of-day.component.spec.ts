import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsOfDayComponent } from './parts-of-day.component';

describe('PartsOfDayComponent', () => {
  let component: PartsOfDayComponent;
  let fixture: ComponentFixture<PartsOfDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartsOfDayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PartsOfDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
