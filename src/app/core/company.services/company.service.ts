import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BASE_URLS } from '../../config/constants';
import { Company } from '../../models/company.model';
import { Router } from '@angular/router';
import { tap, map, Observable, throwError, of } from 'rxjs';
import { AuthService } from '../../core/login.services/auth.service';
import { catchError, shareReplay, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private CLIENTS_URL = BASE_URLS.MOD01.concat('/Client/getAllClients');
  private USERSFILTERS_URL = BASE_URLS.MOD01.concat('/Client/getAllUsersFilters');
  private TYPEDOCUMENTS_SATUS_URL = BASE_URLS.MOD01.concat('/Client/getAllTypeStatusDocument');
  private SAVEUPDATECOMPANY_URL = BASE_URLS.MOD01.concat('/Client/addUpdateCompany');
  private COMPANYID_URL = BASE_URLS.MOD01.concat('/Client/getIdCompany');
  private COMPANYIDDELETE_URL = BASE_URLS.MOD01.concat('/Client/deleteIdCompany');
  private MIGRATEUSERSCOMPANY_URL = BASE_URLS.MOD01.concat('/Client/migrateUsersCompany');
  private AREAIDCOMPANY_URL = BASE_URLS.MOD01.concat('/Client/getAllAreaId');

  ip: string = '';
  token: string = '';


  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authservice: AuthService) { }

  getCompanies(): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(this.CLIENTS_URL, { headers }).pipe(
      map(response => {
        const companiesJson = response.data || [];
        return companiesJson.map((json: any) => new Company(json));
      }),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }

  GetAllUsersFilters(idCompany: string, idRol: string): Observable<any> {

    let params = new HttpParams();

    const body = {
      idCompany: idCompany && idCompany.trim() !== '' ? idCompany : null,
      idRol: idRol && idRol.trim() !== '' ? idRol : null
    };

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.post<any>(this.USERSFILTERS_URL, body, { headers }).pipe(
      retry(2),
      shareReplay(1),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }

  GetAllTypeStatusDocument(): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(this.TYPEDOCUMENTS_SATUS_URL, { headers }).pipe(
      retry(2),
      shareReplay(1),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of([]);
      })
    );
  }

  AddOrUpdateCompany(company: Company): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.post(this.SAVEUPDATECOMPANY_URL, company, { headers });
  }

  GetIdCompany(id: string): Observable<any> {
    const url = `${this.COMPANYID_URL}?id=${encodeURIComponent(id)}`;

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
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

  GetIdCompanyArea(id: string): Observable<any> {
    const url = `${this.AREAIDCOMPANY_URL}?id=${encodeURIComponent(id)}`;

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
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

  DeleteIdCompany(id: string): Observable<any> {
    const url = `${this.COMPANYIDDELETE_URL}?id=${encodeURIComponent(id)}`;

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
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

  MigrateUsersCompany(idClient: string, idClientMigrate: string, selectAllChecked: boolean, usersId: string[]): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    if (usersId.length > 0 && selectAllChecked == true)
      selectAllChecked = false;

    const body = {
      id: idClient,
      idMigrate: idClientMigrate,
      everyone: selectAllChecked,
      ids: usersId
    };

    return this.httpClient.post(this.MIGRATEUSERSCOMPANY_URL, body, { headers });
  }

}
