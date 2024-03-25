import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSenseWidgetComponent } from './multisense-widget.component';

describe('MultiSenseWidgetComponent', () => {
  let component:MultiSenseWidgetComponent;
  let fixture: ComponentFixture<MultiSenseWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSenseWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiSenseWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
