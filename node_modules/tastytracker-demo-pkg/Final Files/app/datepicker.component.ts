import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import * as moment from 'moment';

export class CalButton {
  textdate: string;
  num: string;
  styles: string;
  row: string;
}

@Component({
  selector: 'datepicker',
  templateUrl: 'app/datepicker.component.html',
  styleUrls: [ 'app/datepicker.component.css' ]
})
export class DatepickerComponent implements OnInit {
  @Input() curdate: string;
  curmonth: string;
  workdate = moment();
  @Output() onDateChange = new EventEmitter<string>(true);
  buttons: CalButton[];

  ngOnInit(): void {
    if (this.curdate) { 
      this.workdate = moment(this.curdate,'MM/DD/YYYY');
      this.setCurrent(true);
    } else {
      this.setCurrent(false);
    }
  }

  setCurrent(emit: boolean): void {
    this.curdate = this.workdate.format('MM/DD/YYYY');
    this.curmonth = this.workdate.format('MMMM YYYY');
    this.getGrid();
    if (emit) {
      this.onDateChange.emit(this.curdate);
    }
  }

  setSelected(indate: string): void {
    this.workdate = moment(indate,'MM/DD/YYYY');
    this.setCurrent(true);    
  }

  prevMonth(): void {
    this.workdate.subtract(1, 'months');
    this.setCurrent(false);
  }

  nextMonth(): void {
    this.workdate.add(1, 'months');
    this.setCurrent(false);
  }

  getGrid(): void {
    let startDate = this.workdate.clone();
    let endDate = this.workdate.clone();

    this.buttons = []; // nuke previous grid

    startDate.startOf('month');
    endDate.endOf('month');

    // If start of month is not a Sunday
    // subtract it back until it is
    while (parseInt(startDate.format('d')) > 0) {
      startDate.subtract(1,'days');
    }

    // Iterate from start date while it is less than
    // or equal to end date. Check on each iteration
    // to see if the gray and/or selected style apply,
    // and to drop in row breaks.
    while (startDate.isSameOrBefore(endDate)) {
      let oneButton = new CalButton;
      oneButton.textdate = startDate.format('MM/DD/YYYY');
      oneButton.num = startDate.format('D'); 
      if (startDate.format('MM') === endDate.format('MM')) {
        oneButton.styles = 'normal';
      } else {
        oneButton.styles = 'gray';
      }
      if (startDate.isSame(this.workdate)) {
        oneButton.styles = oneButton.styles + ' selected';
      }
      oneButton.row = '';
      if (parseInt(startDate.format('d')) === 6) {
        oneButton.row = '<br/>';
      }
      this.buttons.push(oneButton);
      startDate.add(1, 'days');
    }

    // If end of month is not a Saturday
    // add until it is, and push extras as you do
    while (parseInt(endDate.format('d')) < 6) {
      let oneButton = new CalButton;
      endDate.add(1,'days'); // do this first, we already pushed endDate
      oneButton.textdate = endDate.format('MM/DD/YYYY');
      oneButton.num = endDate.format('D'); 
      oneButton.styles = 'gray';
      if (endDate.isSame(this.workdate)) {
        oneButton.styles = oneButton.styles + ' selected';
      }
      oneButton.row = '';
      if (parseInt(startDate.format('d')) === 6) {
        oneButton.row = '<br/>';
      }
      this.buttons.push(oneButton);      
    }

  } //getGrid()

}
