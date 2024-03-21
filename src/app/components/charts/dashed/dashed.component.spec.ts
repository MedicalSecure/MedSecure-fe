import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashedComponent } from './dashed.component';

describe('DashedComponent', () => {
  let component: DashedComponent;
  let fixture: ComponentFixture<DashedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
