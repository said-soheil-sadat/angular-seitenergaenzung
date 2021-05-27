import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LfuComponent } from './lfu.component';

describe('LfuComponent', () => {
  let component: LfuComponent;
  let fixture: ComponentFixture<LfuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LfuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LfuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
