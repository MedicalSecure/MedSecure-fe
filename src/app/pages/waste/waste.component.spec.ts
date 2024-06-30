import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteComponent } from './waste.component';

describe('WasteComponent', () => {
  let component: WasteComponent;
  let fixture: ComponentFixture<WasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
