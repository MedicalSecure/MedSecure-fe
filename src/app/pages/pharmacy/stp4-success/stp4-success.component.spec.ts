import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stp4SuccessComponent } from './stp4-success.component';

describe('Stp4SuccessComponent', () => {
  let component: Stp4SuccessComponent;
  let fixture: ComponentFixture<Stp4SuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stp4SuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Stp4SuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
