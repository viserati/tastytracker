import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MealEntryComponent }   from './meal-entry.component';
import { MealListComponent }    from './meal-list.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/meal-entry', pathMatch: 'full' },
  { path: 'meal-entry', component: MealEntryComponent },
  { path: 'meal-list', component: MealListComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
