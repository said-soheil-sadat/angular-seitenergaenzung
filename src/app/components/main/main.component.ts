import {Component} from '@angular/core';
import {PAGEMETHODS, PAGESIZE} from '../../constants/MainConst';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  methods = PAGEMETHODS;
  pagesize = Array((PAGESIZE.max - PAGESIZE.min) + 1).fill(0)
    .map((x, i) => i + PAGESIZE.min);
  inputValues = Array(9).fill(0).map((x, i) => i + 1);
  pageMethod = this.methods[0].id;
  pageSizeValue = PAGESIZE.min;
  currentNumber = 1;
  passNewNumber: Subject<number> = new Subject<number>();

  addNewNumber(): void {
    this.passNewNumber.next(+this.currentNumber);
  }

}
