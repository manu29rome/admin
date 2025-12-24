import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { tap, map, Observable, throwError, of } from 'rxjs';
import { AuthService } from '../../core/login.services/auth.service';
import { BASE_URLS } from '../../config/constants';
import { Router } from '@angular/router';
import { Rol } from '../../models/rol.model'; 
import { catchError, shareReplay, retry  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private ROLES_URL = BASE_URLS.MOD01.concat('/Roles/getAllRoles');
  private MODULES_URL = BASE_URLS.MOD01.concat('/Roles/getAllModules');
  private SAVEUPDATEROL_URL = BASE_URLS.MOD01.concat('/Roles/addUpdateRol');
  private ROLID_URL = BASE_URLS.MOD01.concat('/Roles/getIdRol');
  private ROLIDDELETE_URL = BASE_URLS.MOD01.concat('/Roles/deleteIdRol');
  private MIGRATEUSERSROL_URL = BASE_URLS.MOD01.concat('/Roles/migrateUsersRol');

  constructor(
    private httpClient: HttpClient, 
    private router: Router, 
    private authservice: AuthService
  ) { }

  getAllRoles(): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App':'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(this.ROLES_URL, { headers }).pipe(
      map(response => {
        const companiesJson = response.data || []; 
        return companiesJson.map((json: any) => new Rol(json)); 
      }),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }

  getAllModules(): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'App':'admin',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(this.MODULES_URL, { headers }).pipe(
      retry(2),
      shareReplay(1),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }

  AddUpdateRol(rol: Rol): Observable<any> {
  
      const headers = new HttpHeaders({
        'Token': this.authservice.getToken() ?? '',
        'Cache-Control': 'no-cache',
        'App':'admin',
        'Pragma': 'no-cache'
      });
  
      return this.httpClient.post(this.SAVEUPDATEROL_URL, rol, { headers });
    }

  GetIdRol(id: string): Observable<any> {
    const url = `${this.ROLID_URL}?id=${encodeURIComponent(id)}`;

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App':'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(url, { headers }).pipe(
      retry(2), 
      shareReplay(1), 
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError(() => error);
      })
    );
  }

  DeleteIdRol(id: string): Observable<any> {
    const url = `${this.ROLIDDELETE_URL}?id=${encodeURIComponent(id)}`;

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App':'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.delete<any>(url, { headers }).pipe(
      retry(2), 
      shareReplay(1), 
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError(() => error);
      })
    );
  }

  MigrateUsersRol(idRol: string, idRolMigrate: string, selectAllChecked: boolean, usersId: string[]): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App':'admin',
      'Pragma': 'no-cache'
    });

    if(usersId.length > 0 && selectAllChecked == true)
      selectAllChecked = false;

    const body = { 
      id: idRol,
      idMigrate: idRolMigrate,
      everyone: selectAllChecked,
      ids: usersId
    };

    return this.httpClient.post(this.MIGRATEUSERSROL_URL, body, { headers });
  }

}
