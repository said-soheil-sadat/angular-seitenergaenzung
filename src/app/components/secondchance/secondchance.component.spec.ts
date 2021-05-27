import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondchanceComponent } from './secondchance.component';

describe('SecondchanceComponent', () => {
  let component: SecondchanceComponent;
  let fixture: ComponentFixture<SecondchanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondchanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondchanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
