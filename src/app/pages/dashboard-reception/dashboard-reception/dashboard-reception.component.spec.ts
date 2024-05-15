import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReceptionComponent } from './dashboard-reception.component';

describe('DashboardReceptionComponent', () => {
  let component: DashboardReceptionComponent;
  let fixture: ComponentFixture<DashboardReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardReceptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
