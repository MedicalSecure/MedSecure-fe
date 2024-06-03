import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarMessagesComponent } from './snack-bar-messages.component';

describe('SnackBarMessagesComponent', () => {
  let component: SnackBarMessagesComponent;
  let fixture: ComponentFixture<SnackBarMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackBarMessagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnackBarMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
