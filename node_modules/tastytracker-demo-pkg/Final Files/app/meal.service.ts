import { Injectable } from '@angular/core';

import { Meal } from './meal';

@Injectable()
export class MealService {

/* We need four different types of retrieval by parameter:
   by restaurant (for the listing page)
   by date, by meal, and/or by date AND meal (for the stats) */

/* The first three params are required but could be zero/empty.
   The fourth param is optional; if it's used, then the two date
   params together form a date range.
   If it second date is present but the first date is empty,
   it will be ignored. */

  getList(restaurant: number, mealtype: string, date1: string, date2?: string): Meal[] {
    let meals: Array<Meal> = [];

    for (var x = 0; x < localStorage.length; x++) {
      let key = localStorage.key(x);
      let re = /^TTM_/;

      let match_id = false;
      let match_type = false;
      let match_date = false;

      // What we're doing here is: if a parameter wasn't passed in,
      // set its match to true so that parameter is an automatic pass.
      // In other words, if ID is zero, then ANY ID is okay.
	 if (restaurant === 0) {
        match_id = true; 
      }
	 if (mealtype === '') {
        match_type = true; 
      }
	 if (date1 === '') { 
        match_date = true; 
      }

// Local storage keys for meals are named in the format
// TTM_YYYYMMDD_C_NN
// where C is the meal code (BLDS)
// and NN is the restaurant ID
// For this we're going to use both a re.exec (to get keys which start TTM_)
// AND a split on underscores

      if (re.exec(key) !== null) {
        let parts = key.split('_');
        // parts[0] contains 'TTM', ignore it
        if (!match_id && (parseInt(parts[3]) === restaurant)) {
          match_id = true;
        }
        if (!match_type && (parts[2] === mealtype)) {
          match_type = true; 
        }

        if (date2) { // we have a date range
          // This logic only works if all three dates are YYYYMMDD
          // and correctly zero-padded
          if (!match_date && parts[1] >= date1 && parts[1] <= date2) {
            match_date = true; 
          }
        }      
        else {
          if (!match_date && (parts[1] === date1)) {
            match_date = true; 
          }
        }

        // If we passed all filters in play, push to array
        if (match_id && match_type && match_date) {
          let meal = new Meal;
          meal.date = parts[1];
          meal.name = parts[2];
          meal.location = parseInt(parts[3]);
          meal.amount = localStorage.getItem(key);
          meals.push(meal);
        }
      } // if a TTM_ key
    } // for each key

    meals.sort(this.compare);
    return meals;
  }

  create(date: string, name: string, location: number, amount: string): Meal {
    let meal = new Meal;
    let key = 'TTM';
    
    key = key + '_' + date + '_' + name + '_' + location.toString();
    localStorage.setItem(key, amount);

    meal.date = date;
    meal.name = name;
    meal.location = location;
    meal.amount = amount;  
    return meal;
  }

  delete(date: string, name: string, location: number): void {
    let key = 'TTM';
    
    key = key + '_' + date + '_' + name + '_' + location.toString();
    localStorage.removeItem(key);
    return null;
  }

  deleteByRestaurant(id: number): void {
    for (var x = 0; x < localStorage.length; x++) {
      let key = localStorage.key(x);
      let re = /^TTM_\d\d\d\d\d\d\d\d_\w_(\d+)/;
      let results: Array<string>;
      if ((results = re.exec(key)) !== null) {
        if (parseInt(results[1]) === id) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  compare(a: Meal, b: Meal): number {
    if (a.date < b.date) { return -1; }
    if (a.date > b.date) { return 1; }
    return 0;
  }

}
