import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietComponent } from './diet.component';

describe('DietComponent', () => {
  let component: DietComponent;
  let fixture: ComponentFixture<DietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
