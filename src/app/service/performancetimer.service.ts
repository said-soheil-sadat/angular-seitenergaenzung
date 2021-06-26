import {Injectable} from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class PerformancetimerService {
  private t0 = 0;
  private t1 = 0;
  setStartTime(): void {
    this.t0 = performance.now();
  }
  setEndTime(): void {
    this.t1 = performance.now();
  }
  getPerformanceTime(): number {
    return (this.t1 - this.t0).toFixed(3) as unknown as number;
  }
}
