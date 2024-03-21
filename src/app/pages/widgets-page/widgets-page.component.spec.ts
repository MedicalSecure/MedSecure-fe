import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsPageComponent } from './widgets-page.component';

describe('WidgetsPageComponent', () => {
  let component: WidgetsPageComponent;
  let fixture: ComponentFixture<WidgetsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
