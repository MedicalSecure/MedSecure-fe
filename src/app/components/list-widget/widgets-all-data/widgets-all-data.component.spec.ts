import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsAllDataComponent } from './widgets-all-data.component';

describe('WidgetsAllDataComponent', () => {
  let component: WidgetsAllDataComponent;
  let fixture: ComponentFixture<WidgetsAllDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsAllDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsAllDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
