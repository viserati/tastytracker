import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { Meal } from './meal';
import { Restaurant } from './restaurant';
import { MealService } from './meal.service';
import { RestaurantService } from './restaurant.service';

@Component({
  selector: 'meal-entry',
  templateUrl: 'app/meal-entry.component.html'
})
export class MealEntryComponent implements OnInit {
  showAddDiv = false;
  editingEnabled = false;
  showConfirmDiv = false;
  showDateDiv = false;
  invalidAmount = false;
  invalidAmtMessage = '';
  invalidRestaurant = false;
  invalidDate = false;
  invalidDateMessage = '';
  selectedRestaurant = '';
  meal = new Meal;
  restaurants: Restaurant[];
  thumper: number = 0;

  constructor(private router: Router,
              private restaurantService: RestaurantService,
              private mealService: MealService ) {}

  ngOnInit(): void {
    let curdate = moment().format('MM/DD/YYYY');
    this.meal.date = curdate; // Storing in WRONG FORMAT for display reasons
    this.meal.name = 'B';
    this.meal.location = 0;
    this.restaurants = this.restaurantService.getList();
  }

  onSelect(value: string, label: string): void {
    let numValue = parseInt(value);

    console.log('select', numValue, label);
    if (numValue > 0) {
      this.selectedRestaurant = label;
      this.editingEnabled = true;
    }
    else {
      this.selectedRestaurant = '';
      this.editingEnabled = false;
    }
    this.showConfirmDiv = false; // hide the delete confirmation if the selection changes
    this.meal.location = numValue;
  }

  update(id: string, name: string): void {
    let numID = parseInt(id);
    let newrest = new Restaurant;

    if (!name) {
      return null;
    }

    console.log('update', numID, name);
    newrest = this.restaurantService.update(numID, name);
    this.restaurants = this.restaurantService.getList();
    this.meal.location = newrest.id;
    this.selectedRestaurant = name;
  }

  add(name: string): void {
    let newrest = new Restaurant;

    if (!name) {
      return null;
    }

    console.log('add', name);
    newrest = this.restaurantService.create(name);
    this.restaurants.push(newrest);
    this.meal.location = newrest.id;
    this.selectedRestaurant = name;
    this.showAddDiv = false; 
    this.editingEnabled = true;
 }

  delete(id: string): void {
    let numID = parseInt(id);

    console.log('delete', numID);
    this.restaurantService.delete(numID);
    this.mealService.deleteByRestaurant(numID);
    this.restaurants = this.restaurantService.getList();
    this.meal.location = 0;
    this.selectedRestaurant = '';
    this.editingEnabled = false;
  }

  save(): void {
    let mydate = moment(this.meal.date, 'MM/DD/YYYY');
    let newdate = '';
    let amtAsNum = parseFloat(this.meal.amount);

    this.invalidAmount = false;
    this.invalidRestaurant = false;
    this.invalidDate = false;

    if (isNaN(amtAsNum)) {
      this.invalidAmount = true;
      this.invalidAmtMessage = 'Please enter an amount';
      return null;
    }
    else {
      if (amtAsNum <= 0) {
        this.invalidAmount = true;
        this.invalidAmtMessage = 'Please enter an amount greater than zero';
        return null;
      }
    }
    if (!this.meal.name) {
      return null;
    }
    if (!this.meal.location) {
      this.invalidRestaurant = true;
      return null;
    }
    if (!this.meal.date) {
      this.invalidDate = true;
      this.invalidDateMessage = 'Please enter a date (MM/DD/YYYY)';
      return null;
    }  
    if (!mydate.isValid()) {
      this.invalidDate = true;
      this.invalidDateMessage = 'Please enter a valid date (MM/DD/YYYY)';
      return null;
    }

    // If here then do actual stuff
    newdate = mydate.format('YYYYMMDD');

    console.log('save', this.meal.amount, this.meal.location,
                this.meal.name, this.meal.date);    
    this.mealService.create(newdate, this.meal.name,
                            this.meal.location, this.meal.amount);

    // clear the amount for the next go - the rest of the fields can stay as is
    // this will also help prevent save button stutter
    this.meal.amount = '';

    // Thump the thumper
    this.thumper++;
  }

  toggleAdd(): void {
    this.showAddDiv = !this.showAddDiv;
  }

  toggleConfirm(): void {
    this.showConfirmDiv = !this.showConfirmDiv;
  }

  toggleDatepicker(): void {
    this.showDateDiv = !this.showDateDiv;
  }

  setDate(newdate: string): void {
    if (this.meal.date !== newdate) {
       this.meal.date = newdate;
       this.toggleDatepicker();
       // Use this slight runaround instead of just setting showDateDiv
       // or you'll get problems with a binding changed after page check
    }
  }

  gotoList(): void {
    this.router.navigateByUrl('/meal-list');
  }

}
