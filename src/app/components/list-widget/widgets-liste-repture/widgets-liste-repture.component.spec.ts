import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsListeReptureComponent } from './widgets-liste-repture.component';

describe('WidgetsListeReptureComponent', () => {
  let component: WidgetsListeReptureComponent;
  let fixture: ComponentFixture<WidgetsListeReptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsListeReptureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsListeReptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
