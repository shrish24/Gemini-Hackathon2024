import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.container.html',
  styleUrls: ['./app.container.scss'],
})
export class AppContainer {
  constructor(private route: ActivatedRoute, private router: Router) {}

  getContentClass(): string {
    const currentRoute = this.route.root.firstChild?.snapshot;

    if (currentRoute) {
      switch (currentRoute.routeConfig?.path) {
        case 'test-summary':
        case 'home':
          return 'home-content';
        case 'contact':
          return 'contact-content';
        default:
          return '';
      }
    }

    return '';
  }
}
