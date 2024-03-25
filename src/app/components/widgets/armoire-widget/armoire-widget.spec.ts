import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmoireWidgetComponent } from './armoire-widget.component';

describe('ArmoireWidgetComponent', () => {
  let component:ArmoireWidgetComponent;
  let fixture: ComponentFixture<ArmoireWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmoireWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmoireWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
