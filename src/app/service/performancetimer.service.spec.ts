import { TestBed } from '@angular/core/testing';

import { PerformancetimerService } from './performancetimer.service';

describe('PerformancetimerService', () => {
  let service: PerformancetimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerformancetimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
