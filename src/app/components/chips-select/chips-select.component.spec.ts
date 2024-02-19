import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipsSelectComponent } from './chips-select.component';

describe('ShipsSelectComponent', () => {
  let component: ShipsSelectComponent;
  let fixture: ComponentFixture<ShipsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipsSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShipsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
