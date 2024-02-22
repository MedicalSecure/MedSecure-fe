import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitsHomePageComponent } from './visits-home-page.component';

describe('VisitsHomePageComponent', () => {
  let component: VisitsHomePageComponent;
  let fixture: ComponentFixture<VisitsHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitsHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitsHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
