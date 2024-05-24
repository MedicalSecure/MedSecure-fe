import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterViewComponent } from './register.component';

describe('RegisterViewComponent', () => {
  let component: RegisterViewComponent;
  let fixture: ComponentFixture<RegisterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
