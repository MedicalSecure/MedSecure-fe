import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBodyViewerComponent } from './human-body-viewer.component';

describe('HumanBodyViewerComponent', () => {
  let component: HumanBodyViewerComponent;
  let fixture: ComponentFixture<HumanBodyViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBodyViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HumanBodyViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
