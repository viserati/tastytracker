import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
		  <section>
              <div class="row">
                <div class="col-xs-12 text-xs-center tealBG">
                  <header role="banner">
                    <h1>TastyTracker</h1>
                  </header>
                </div>
              </div>
            </section>

            <router-outlet></router-outlet>
            `
})
export class AppComponent {
  title = 'TastyTracker';
}
