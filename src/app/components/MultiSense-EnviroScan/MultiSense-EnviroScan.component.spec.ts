import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSenseEnviroScanComponent } from './MultiSense-EnviroScan.component';

describe('MultiSenseEnviroScanComponent', () => {
  let component: MultiSenseEnviroScanComponent;
  let fixture: ComponentFixture<MultiSenseEnviroScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSenseEnviroScanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiSenseEnviroScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
