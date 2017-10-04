import { Component, OnChanges, Input, ViewChild } from '@angular/core';

import * as moment from 'moment';

import { Meal } from './meal';
import { MealService } from './meal.service';

@Component({
  selector: 'trends',
  templateUrl: 'app/trends.component.html',
  styleUrls: [ 'app/trends.component.css' ]
})
export class TrendsComponent implements OnChanges {
  @Input() thumper: number;
  totalThisWeek: number = 0;
  totalLastWeek: number = 0;
  averageInterval: string = 'D';
  breakfastAverage: number = 0;
  lunchAverage: number = 0;
  dinnerAverage: number = 0;
  snackAverage: number = 0;
  @ViewChild('graphDiv1') graphDiv1: any;
  @ViewChild('graphDiv2') graphDiv2: any;
  weekBar1: string;
  weekBar2: string;
  mealBar1: string;
  mealBar2: string;
  mealBar3: string;
  mealBar4: string;

  constructor(private mealService: MealService) {}

  ngOnChanges(): void {
    this.getTotals();
    this.getAverages();
    this.initWeeklyGraph();
    this.initAverageGraph();
  }

  onSelect(interval: string): void {
    this.averageInterval = interval;
    this.getAverages();
    this.initAverageGraph();
  }

  getTotals(): void {
    let workdate = moment();
    let date1: string;
    let date2: string;
    
    this.totalThisWeek = 0;
    this.totalLastWeek = 0;

    // Note that these are being assigned backward on purpose.
    // date1 is the EARLIER date of the two in the week range.
    date2 = workdate.format('YYYYMMDD');
    workdate.subtract(6, 'days');
    date1 = workdate.format('YYYYMMDD');
    this.totalThisWeek = this.sumMeals(date1, date2);

    workdate.subtract(1, 'days'); // so the ranges don't overlap

    date2 = workdate.format('YYYYMMDD');
    workdate.subtract(6, 'days');
    date1 = workdate.format('YYYYMMDD');
    this.totalLastWeek = this.sumMeals(date1, date2);
  }

/* DAILY
 1. Retrieve and sum all records for day-by-meal (4x per day)
 2. Push day-by-meal sum onto sums-by-meal array (4x)
 3. Repeat steps 1 and 2 back 364 more days
 4. Get average for each of the sums-by-meal arrays (4x) */
/* WEEKLY
 1. Get date range for week (e.g. 20160901-20160907)
 2. Retrieve and sum all records for week-by-meal (4x per week)
 3. Push week-by-meal sum onto sums-by-meal array (4x)
 4. Repeat steps 1-3 back 51 more weeks
 5. Get average for each of the sums-by-meal arrays (4x) */
/* MONTHLY
 1. Get date range for calendar month (e.g. 20160901-20160930)
 2. Retrieve and sum all records for month-by-meal (4x per month)
 3. Push month-by-meal sum onto sums-by-meal array (4x)
 4. Repeat steps 1-3 back 11 more months
 5. Get average for each of the sums-by-meal arrays (4x) */

  getAverages(): void {
    let bSums: Array<number> = [];
    let lSums: Array<number> = [];
    let dSums: Array<number> = [];
    let sSums: Array<number> = [];
    let workdate = moment();
    let date1: string;
    let date2: string;
    let curSum = 0;

    this.breakfastAverage = 0;
    this.lunchAverage = 0;
    this.dinnerAverage = 0;
    this.snackAverage = 0;

    // DAILY
    if (this.averageInterval === 'D') {
      for (let c = 0; c < 365; c++) {
        date1 = workdate.format('YYYYMMDD');
        curSum = this.sumMeals(date1, null, 'B');
        if (curSum > 0) { bSums.push(curSum); }
        curSum = this.sumMeals(date1, null, 'L');
        if (curSum > 0) { lSums.push(curSum); }
        curSum = this.sumMeals(date1, null, 'D');
        if (curSum > 0) { dSums.push(curSum); }
        curSum = this.sumMeals(date1, null, 'S');
        if (curSum > 0) { sSums.push(curSum); }
        workdate.subtract(1, 'days');
      }
    }

    // WEEKLY
    if (this.averageInterval === 'W') {
      for (let c = 0; c < 52; c++) {
        date2 = workdate.format('YYYYMMDD');
        workdate.subtract(6, 'days');
        date1 = workdate.format('YYYYMMDD');
        curSum = this.sumMeals(date1, date2, 'B');
        if (curSum > 0) { bSums.push(curSum); }
        curSum = this.sumMeals(date1, date2, 'L');
        if (curSum > 0) { lSums.push(curSum); }
        curSum = this.sumMeals(date1, date2, 'D');
        if (curSum > 0) { dSums.push(curSum); }
        curSum = this.sumMeals(date1, date2, 'S');
        if (curSum > 0) { sSums.push(curSum); }
        workdate.subtract(1, 'days');
      }
    }

    // MONTHLY
    if (this.averageInterval === 'M') {
      for (let c = 0; c < 12; c++) {
        workdate.startOf('month');
        date1 = workdate.format('YYYYMMDD');
        workdate.endOf('month');
        date2 = workdate.format('YYYYMMDD');
        curSum = this.sumMeals(date1, date2, 'B');
        if (curSum > 0) { bSums.push(curSum); }
        curSum = this.sumMeals(date1, date2, 'L');
        if (curSum > 0) { lSums.push(curSum); }
        curSum = this.sumMeals(date1, date2, 'D');
        if (curSum > 0) { dSums.push(curSum); }
        curSum = this.sumMeals(date1, date2, 'S');
        if (curSum > 0) { sSums.push(curSum); }
        workdate.subtract(1, 'months');
      }
    }

    // Now average the arrays - but ONLY if they have items
    
    if (bSums.length > 0) {
      curSum = 0;
      for (let b of bSums) { curSum = curSum + b; }
      this.breakfastAverage = curSum / bSums.length;
    }
    if (lSums.length > 0) {
      curSum = 0;
      for (let l of lSums) { curSum = curSum + l; }
      this.lunchAverage = curSum / lSums.length;
    }
    if (dSums.length > 0) {
      curSum = 0;
      for (let d of dSums) { curSum = curSum + d; }
      this.dinnerAverage = curSum / dSums.length;
    }
    if (sSums.length > 0) {
      curSum = 0;
      for (let s of sSums) { curSum = curSum + s; }
      this.snackAverage = curSum / sSums.length;
    }
  } // getAverages()

  sumMeals(date1: string, date2?: string, mealtype?: string): number {
    let meals: Array<Meal> = [];
    let curSum = 0;
    let mt = '';

    if (mealtype) {
      mt = mealtype; 
    }
    meals = this.mealService.getList(0, mt, date1, date2);
    for (let m in meals) {
      curSum = curSum + parseFloat(meals[m].amount);
    }
    return curSum;
  }

  initWeeklyGraph(): void {
    let maxWidth: number;
    let thisWeek: number = this.totalThisWeek;
    let lastWeek: number = this.totalLastWeek;
    let larger: number;
    let unit: number;
    let bar1width: number;
    let bar2width: number;

    maxWidth = this.graphDiv1.nativeElement.offsetWidth;
    maxWidth = maxWidth - 150; // to allow for legend and amount
    console.log('maxWidth', maxWidth);

    if (thisWeek >= lastWeek) { larger = thisWeek; }
    else { larger = lastWeek; }
    if (larger === 0) { larger = 1; }

    // If the larger amount is greater than the max width, we need to divide
    // both week's amounts by two and try again (rescaling the graph).
    // Ultimately we need 'unit' to be 1 or greater.
    while (larger > maxWidth) {
      thisWeek = Math.floor(thisWeek / 2);
      lastWeek = Math.floor(lastWeek / 2);
      larger = Math.floor(larger / 2);
    }
    unit = Math.floor(maxWidth / larger);

    bar1width = Math.floor(thisWeek * unit);
    this.weekBar1 = bar1width.toString() + "px";
    bar2width = Math.floor(lastWeek * unit);
    this.weekBar2 = bar2width.toString() + "px";
    console.log('unit', unit, 'rects', bar1width, bar2width);
  }

  initAverageGraph(): void {
    let maxWidth: number;
    let breakfast: number = this.breakfastAverage;
    let lunch: number = this.lunchAverage;
    let dinner: number = this.dinnerAverage;
    let snacks: number = this.snackAverage;
    let largest: number;
    let unit: number;
    let bar1width: number;
    let bar2width: number;
    let bar3width: number;
    let bar4width: number;

    maxWidth = this.graphDiv2.nativeElement.offsetWidth;
    maxWidth = maxWidth - 150;
    console.log('maxWidth', maxWidth);

    if (breakfast >= lunch) { largest = breakfast; }
    else { largest = lunch; }
    if (largest < dinner) { largest = dinner; }
    if (largest < snacks) { largest = snacks; }
    if (largest === 0) { largest = 1; }

    while (largest > maxWidth) {
      breakfast = Math.floor(breakfast / 2);
      lunch = Math.floor(lunch / 2);
      dinner = Math.floor(dinner / 2);
      snacks = Math.floor(snacks / 2);
      largest = Math.floor(largest / 2);
    }

    unit = Math.floor(maxWidth / largest);
    bar1width = Math.floor(breakfast * unit);
    this.mealBar1 = bar1width.toString() + "px";
    bar2width = Math.floor(lunch * unit);
    this.mealBar2 = bar2width.toString() + "px";
    bar3width = Math.floor(dinner * unit);
    this.mealBar3 = bar3width.toString() + "px";
    bar4width = Math.floor(snacks * unit);
    this.mealBar4 = bar4width.toString() + "px";
    console.log('unit', unit, 'rects', bar1width, bar2width, bar3width, bar4width);
  }

}
