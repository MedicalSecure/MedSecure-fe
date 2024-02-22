import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideRoomsComponent } from './side-rooms.component';

describe('SideRoomsComponent', () => {
  let component: SideRoomsComponent;
  let fixture: ComponentFixture<SideRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideRoomsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
