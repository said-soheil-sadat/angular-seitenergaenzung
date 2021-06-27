import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {LfuPage} from '../../interfaces/page.interface';
import {COLORS, COUNTER} from '../../constants/MainConst';
import {PerformancetimerService} from '../../service/performancetimer.service';

@Component({
  selector: 'app-lfu',
  templateUrl: './lfu.component.html',
  styleUrls: ['./lfu.component.scss']
})
export class LfuComponent implements OnInit, OnChanges, OnDestroy {

  @Input() pageSize!: number;
  @Input() passNewNumber: Subject<number> = new Subject<number>();
  private subscriptions: Subscription[] = [];
  pageList!: LfuPage[][];
  currentPages!: LfuPage[];
  counter = COUNTER;
  tArr: number[] = [];


  createNewPageList(): void {
    this.tArr = [];
    this.performanceTimer.setStartTime();
    this.pageList = [];
    this.currentPages = [];
    for (let i = 0; i < this.pageSize; i++) {
      this.pageList.push([{page_value: 0, page_age: 0, page_hits: 0, bg_color: COLORS.yellow_code}]);
      this.currentPages.push({page_value: 0, page_age: 0, page_hits: 0, bg_color: COLORS.yellow_code});
    }
    this.counter = {hits: 0, miss: 0};
    this.performanceTimer.setEndTime();
    this.tArr.push(this.performanceTimer.getPerformanceTime());
  }

  isDuplicate(newNumber: number): boolean {
    let isPresent = false;
    for (let i = 0; i < this.currentPages.length; i++) {
      if (this.currentPages[i].page_value === newNumber) {
        this.currentPages[i] = {
          page_value: this.currentPages[i].page_value,
          page_hits: this.currentPages[i].page_hits + 1,
          page_age: this.currentPages[i].page_age + 1,
          bg_color: COLORS.green_code
        };
        isPresent = true;
        this.counter.hits += 1;
      } else if (this.currentPages[i].page_value !== 0) {
        this.currentPages[i] = {
          page_value: this.currentPages[i].page_value,
          page_hits: this.currentPages[i].page_hits,
          page_age: this.currentPages[i].page_age + 1,
          bg_color: COLORS.yellow_code
        };
      }
    }
    return isPresent;
  }

  replaceEmptyPage(newNumber: number): boolean {
    let replaced = false;
    for (let i = 0; i < this.currentPages.length; i++) {
      if (this.currentPages[i].page_value === 0 && !replaced) {
        this.currentPages[i] = {
          page_value: newNumber,
          page_hits: 1,
          page_age: 0,
          bg_color: COLORS.green_code
        };
        replaced = true;
      }
    }
    return replaced;
  }

  replaceLowestHits(newNumber: number): void {
    let minHits = 0;
    for (let i = 1; i < this.currentPages.length; i++) {
      if (this.currentPages[minHits].page_hits > this.currentPages[i].page_hits) {
        minHits = i;
      } else if (this.currentPages[minHits].page_hits === this.currentPages[i].page_hits) {
        if (this.currentPages[minHits].page_age < this.currentPages[i].page_age) {
          minHits = i;
        }
      }
    }

    this.currentPages[minHits] = {
      page_value: newNumber,
      page_hits: 1,
      page_age: 0,
      bg_color: COLORS.green_code
    };
  }


  insertNewNumber(newInput: number): void {
    this.performanceTimer.setStartTime();
    if (!this.isDuplicate(newInput)) {
      this.counter.miss += 1;
      if (!this.replaceEmptyPage(newInput)) {
        this.replaceLowestHits(newInput);
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
