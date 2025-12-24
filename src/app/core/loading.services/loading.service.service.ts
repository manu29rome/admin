import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  private loadingSubject = new BehaviorSubject<boolean>(false); // Estado inicial de carga
  public loading$ = this.loadingSubject.asObservable(); // Observable para escuchar los cambios

  showLoading() {
    this.loadingSubject.next(true); // Mostrar el estado de carga
  }

  hideLoading() {
    this.loadingSubject.next(false); // Ocultar el estado de carga
  }
}
