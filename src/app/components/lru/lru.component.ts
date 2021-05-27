import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {LruPage} from '../../interfaces/page.interface';
import {COLORS, COUNTER} from '../../constants/MainConst';
import {PerformancetimerService} from '../../service/performancetimer.service';

@Component({
  selector: 'app-lru',
  templateUrl: './lru.component.html',
  styleUrls: ['./lru.component.scss']
})
export class LruComponent implements OnChanges, OnInit, OnDestroy {

  @Input() pageSize!: number;
  @Input() passNewNumber: Subject<number> = new Subject<number>();
  private subscriptions: Subscription[] = [];
  pageList!: LruPage[][];
  currentPages!: LruPage[];
  counter = COUNTER;
  tArr: number[] = [];

  createNewPageList(): void {
    this.tArr = [];
    this.performanceTimer.setStartTime();
    this.pageList = [];
    this.currentPages = [];
    for (let i = 0; i < this.pageSize; i++) {
      this.pageList.push([{page_value: 0, bg_color: COLORS.yellow_code}]);
      this.currentPages.push({page_value: 0, bg_color: COLORS.yellow_code});
    }

    this.counter = {hits: 0, miss: 0};
    this.performanceTimer.setEndTime();
    this.tArr.push(this.performanceTimer.getPerformanceTime());
  }

  checkDuplicate(newInput: number): void {
    let isAvailable = false;
    for (const p of this.currentPages) {
      if (p.page_value === newInput) {
        isAvailable = true;
        this.counter.hits += 1;
      }
    }
    if (!isAvailable) {
      this.counter.miss += 1;
    }
  }

  insertNewNumber(newInput: number): void {
    this.performanceTimer.setStartTime();
    this.checkDuplicate(newInput);

    this.currentPages = this.currentPages.filter(cp => cp.page_value !== newInput && cp.page_value !== 0);
    this.currentPages.push({page_value: newInput, bg_color: COLORS.green_code});

    if (this.currentPages.length < this.pageSize) {
      for (let i = this.currentPages.length; i < this.pageSize; i++) {
        this.currentPages.push({page_value: 0, bg_color: COLORS.yellow_code});
      }
    }
    if (this.currentPages.length > this.pageSize) {
      this.currentPages.shift();
    }

    for (let i = 0; i < this.currentPages.length; i++) {
      if (this.currentPages[i].page_value !== newInput) {
        this.currentPages[i] = {page_value: this.currentPages[i].page_value, bg_color: COLORS.yellow_code};
      }
    }

    for (let i = 0; i < this.currentPages.length; i++) {
      this.pageList[i] = [...this.pageList[i], this.currentPages[i]];
    }
    this.performanceTimer.setEndTime();
    this.tArr.push(this.performanceTimer.getPerformanceTime());
  }


  constructor(private performanceTimer: PerformancetimerService) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.passNewNumber.subscribe((newInput: number) => {
      this.insertNewNumber(newInput);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageSize.currentValue !== this.pageSize || changes.pageSize.currentValue !== undefined) {
      this.createNewPageList();
    }
  }
}
