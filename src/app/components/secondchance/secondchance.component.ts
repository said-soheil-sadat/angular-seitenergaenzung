import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {SecChance} from '../../interfaces/page.interface';
import {COLORS, COUNTER} from '../../constants/MainConst';
import {PerformancetimerService} from '../../service/performancetimer.service';

@Component({
  selector: 'app-secondchance',
  templateUrl: './secondchance.component.html',
  styleUrls: ['./secondchance.component.scss']
})
export class SecondchanceComponent implements OnInit, OnChanges, OnDestroy {

  @Input() pageSize!: number;
  @Input() passNewNumber: Subject<number> = new Subject<number>();
  private subscriptions: Subscription[] = [];
  pageList!: SecChance[][];
  currentPages!: SecChance[];
  counter = {...COUNTER};
  tArr: number[] = [];

  createNewPageList(): void {
    this.tArr = [];
    this.performanceTimer.setStartTime();
    this.pageList = [];
    this.currentPages = [];
    for (let i = 0; i < this.pageSize; i++) {
      this.pageList.push([{
        page_value: 0, secondChance: false,
        bg_color: COLORS.yellow_code
      }]);
      this.currentPages.push({
        page_value: 0, secondChance: false,
        bg_color: COLORS.yellow_code
      });
    }
    this.counter = {...COUNTER};
    this.performanceTimer.setEndTime();
    this.tArr.push(this.performanceTimer.getPerformanceTime());
  }

  isDuplicate(newNumber: number): boolean {
    let isPresent = false;
    for (let i = 0; i < this.currentPages.length; i++) {
      if (this.currentPages[i].page_value === newNumber) {
        this.currentPages[i] = {
          page_value: this.currentPages[i].page_value,
          secondChance: true,
          bg_color: COLORS.green_code
        };
        isPresent = true;
        this.counter.hits += 1;
        this.changeColors(newNumber);
      }
    }
    return isPresent;
  }

  changeColors(newNumber: number): void {
    for (let i = 0; i < this.currentPages.length; i++) {
      if (this.currentPages[i].page_value !== newNumber) {
        this.currentPages[i] = {
          page_value: this.currentPages[i].page_value,
          secondChance: this.currentPages[i].secondChance,
          bg_color: COLORS.yellow_code
        };
      }
    }
  }

  checkForEmptyIndex(newNumber: number): number {
    let startIndex = 255;
    let gotEmpty = false;
    for (let i = 0; i < this.currentPages.length; i++) {
      if (this.currentPages[i].page_value === 0 && !gotEmpty) {
        gotEmpty = true;
        startIndex = i;
      }
    }
    return startIndex;
  }

  replaceFromLastEntry(newInput: number): void {
    let startIndex = this.checkForEmptyIndex(newInput);
    if (startIndex === 255) {
      for (let i = 0; i < this.currentPages.length; i++) {
        if (this.currentPages[i].bg_color === COLORS.green_code) {
          startIndex = i + 1;
        }
      }
    }
    let isReplaced = false;
    while (!isReplaced) {
      if (startIndex >= this.currentPages.length) {
        startIndex = 0;
      }
      if (this.currentPages[startIndex].secondChance) {
        this.currentPages[startIndex] = {
          page_value: this.currentPages[startIndex].page_value,
          secondChance: false,
          bg_color: COLORS.yellow_code
        };
        startIndex += 1;
      } else {
        this.currentPages[startIndex] = {
          page_value: newInput,
          secondChance: false,
          bg_color: COLORS.green_code
        };
        isReplaced = true;
        this.changeColors(newInput);
      }
    }
  }

  insertNewNumber(newInput: number): void {
    this.performanceTimer.setStartTime();
    if (!this.isDuplicate(newInput)) {
      this.counter.miss += 1;
      this.replaceFromLastEntry(newInput);
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
