import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasonryDpiComponent } from './masonry-dpi.component';

describe('MasonryDpiComponent', () => {
  let component: MasonryDpiComponent;
  let fixture: ComponentFixture<MasonryDpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasonryDpiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasonryDpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
