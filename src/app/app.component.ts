import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { LoadingServiceService } from './core/loading.services/loading.service.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        CommonModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

  loading$;
  title = 'SuiteXTech';

  constructor(private loadingService: LoadingServiceService, private router: Router) {
    // Inicializar el observable después de que el servicio esté disponible
    this.loading$ = this.loadingService.loading$;

    // Escuchar los eventos del Router
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.showLoading();
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.hideLoading();
      }
    });
  }
}
