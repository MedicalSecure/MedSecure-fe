import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOutWidgetComponent } from './stock-out-widget.component';

describe('StockOutWidgetComponent', () => {
  let component: StockOutWidgetComponent;
  let fixture: ComponentFixture<StockOutWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockOutWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockOutWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
