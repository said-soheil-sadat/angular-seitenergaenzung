import {Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges} from '@angular/core';
import {FifoPage} from '../../interfaces/page.interface';
import {Subject, Subscription} from 'rxjs';
import {COLORS, COUNTER} from '../../constants/MainConst';
import {PerformancetimerService} from '../../service/performancetimer.service';


@Component({
  selector: 'app-fifo',
  templateUrl: './fifo.component.html',
  styleUrls: ['./fifo.component.scss']
})
export class FifoComponent implements OnChanges, OnInit, OnDestroy {

  @Input() pageSize!: number;
  @Input() passNewNumber: Subject<number> = new Subject<number>();
  private subscriptions: Subscription[] = [];
  pageList!: FifoPage[][];
  currentPages!: FifoPage[];
  counter = COUNTER;
  tArr: number[] = [];


  createNewPageList(): void {
    this.tArr = [];
    this.performanceTimer.setStartTime();
    this.pageList = [];
    this.currentPages = [];
    for (let i = 0; i < this.pageSize; i++) {
      this.pageList.push([{page_value: 0, page_age: 0, bg_color: COLORS.yellow_code}]);
      this.currentPages.push({page_value: 0, page_age: 0, bg_color: COLORS.yellow_code});
    }
    this.counter = {hits: 0, miss: 0};
    this.performanceTimer.setEndTime();
    this.tArr.push(this.performanceTimer.getPerformanceTime());
  }

  isDuplicate(newInput: number): boolean {
    let inputIsDuplicate = false;
    for (const page of this.currentPages) {
      if (page.page_value === newInput) {
        inputIsDuplicate = true;
        this.counter.hits += 1;
      }
    }
    return inputIsDuplicate;
  }

  checkForEmptyPage(position: number): number {
    let isEmptyPage = false;
    for (let i = 0; i < this.currentPages.length; i++) {
      if (this.currentPages[i].page_value === 0 && !isEmptyPage) {
        position = i;
        isEmptyPage = true;
      }
    }
    return position;
  }

  getOldestPagePosition(position: number): number {
    position = 0;

    for (let i = 1; i < this.currentPages.length; i++) {
      if (this.currentPages[position].page_age < this.currentPages[i].page_age) {
        position = i;
      }
    }
    return position;
  }


  insertNewNumber(newInput: number): void {
    this.performanceTimer.setStartTime();
    let position = 255;
    if (!this.isDuplicate(newInput)) {
      this.counter.miss += 1;
      position = this.checkForEmptyPage(255);
      if (position === 255) {
        position = this.getOldestPagePosition(255);
      }
    }

    for (let i = 0; i < this.currentPages.length; i++) {
      if (i === position) {
        this.currentPages[i] = {page_value: newInput, page_age: 0, bg_color: COLORS.green_code};
      } else if (this.currentPages[i].page_value === newInput) {
        this.currentPages[i] = {
          page_value: this.currentPages[i].page_value,
          page_age: this.currentPages[i].page_age + 1, bg_color: COLORS.green_code
        };
      } else if (this.currentPages[i].page_value !== 0) {
        this.currentPages[i] = {
          page_value: this.currentPages[i].page_value,
          page_age: this.currentPages[i].page_age + 1, bg_color: COLORS.yellow_code
        };
      }
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

