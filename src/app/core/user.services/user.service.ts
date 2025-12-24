import { Injectable } from '@angular/core';
import { AuthService } from '../login.services/auth.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BASE_URLS } from '../../config/constants';
import { tap, map, Observable, throwError, of } from 'rxjs';
import { catchError, shareReplay, retry  } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserPermission } from '../../models/user.permission.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USERS_URL = BASE_URLS.MOD01.concat('/Users/getAllUsers');
  private USERSINFO_URL = BASE_URLS.MOD01.concat('/Users/getInfoUsers');
  private SAVEUPDATEUSER_URL = BASE_URLS.MOD01.concat('/Users/addUpdateUser');
  private USERIDDELETE_URL = BASE_URLS.MOD01.concat('/Users/deleteIdUser');
  private USERID_URL = BASE_URLS.MOD01.concat('/Users/getIdUser');
  private ADDORDELETE_URL = BASE_URLS.MOD01.concat('/Users/addDeleteFilesUser');
  private GETALLPERMISSSION_URL = BASE_URLS.MOD01.concat('/Users/getAllUsersPermission');
  private ADDORUPDATEPERMISSSION_URL = BASE_URLS.MOD01.concat('/Users/addUpdateUserPermission');
  private UPDATESTATUSPERMISSSION_URL = BASE_URLS.MOD01.concat('/Users/updateStatusPermission');
  private INFOPERMISSSION_URL = BASE_URLS.MOD01.concat('/Users/getInfoPermisssion');
  private PERMISSIONIDDELETE_URL = BASE_URLS.MOD01.concat('/Users/deleteIdPermission');
  private PERMISSIONID_URL = BASE_URLS.MOD01.concat('/Users/getIdPermission');

  constructor(
    private authservice: AuthService,
    private httpClient: HttpClient) { }

    formatDate = (date: string | null): string | null => {
    return date ? new Date(date).toISOString().slice(0, 19) : null;
  };

  GetIdUser(id: string): Observable<any> {
    const url = `${this.USERID_URL}?id=${encodeURIComponent(id)}`;

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

  GetIdPermission(id: string): Observable<any> {
    const url = `${this.PERMISSIONID_URL}?id=${encodeURIComponent(id)}`;

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

  DeleteIdUser(id: string): Observable<any> {
    const url = `${this.USERIDDELETE_URL}?id=${encodeURIComponent(id)}`;

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

  DeleteIdPermission(id: string): Observable<any> {
    const url = `${this.PERMISSIONIDDELETE_URL}?id=${encodeURIComponent(id)}`;

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

  AddOrUpdateUser(user: User): Observable<any> {
  
      const headers = new HttpHeaders({
        'Token': this.authservice.getToken() ?? '',
        'Cache-Control': 'no-cache',
        'App': 'admin',
        'Pragma': 'no-cache'
      });
  
      return this.httpClient.post(this.SAVEUPDATEUSER_URL, user, { headers });
  }

  UpdateStatusPermisssionUser(status: number, id:string): Observable<any> {
  
      const headers = new HttpHeaders({
        'Token': this.authservice.getToken() ?? '',
        'Cache-Control': 'no-cache',
        'App': 'admin',
        'Pragma': 'no-cache'
      });

      const body = { 
        id: id, 
        status: status
      }
  
      return this.httpClient.post(this.UPDATESTATUSPERMISSSION_URL, body, { headers });
  }

  AddOrUpdateUserPermission(permission: UserPermission): Observable<any> {
  
      const headers = new HttpHeaders({
        'Token': this.authservice.getToken() ?? '',
        'Cache-Control': 'no-cache',
        'App': 'admin',
        'Pragma': 'no-cache'
      });

      const body = {
        idUserPermission: permission.idUserPermission,
        idUserAccount: permission.idUserAccount,
        description: permission.description,
        from: permission.from,
        until: permission.until,
        time: permission.time,
        hoursOrDays: permission.hoursOrDays,
        typePermission: permission.typePermission,
        operation: permission.operation
      }
  
      return this.httpClient.post(this.ADDORUPDATEPERMISSSION_URL, body, { headers });
  }

  GetAllUsers(
     idClient: string [], 
     idRol: string [],  
     idStatus: string [], 
     searchText: string | null, 
     pageNumber: number = 0, 
     pageSize: number = 0,
     dateStart?: string | null,
     dateEnd?: string | null,
     order: boolean = true
    ): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    const body = { 
      idClient: idClient, 
      idRol: idRol, 
      idStatus: idStatus, 
      searchText: searchText || null, 
      pageNumber: pageNumber > 0 ? pageNumber : null,
      pageSize: pageSize > 0 ? pageSize : null,
      dateStar: this.formatDate(dateStart!),
      dateEnd: this.formatDate(dateEnd!),
      order: order
    };

    return this.httpClient.post(this.USERS_URL, body, { headers });
  }

   GetAllPermissionUsers(
    typePermission: string [],  
    idStatus: number | null, 
    searchText: string | null, 
    pageNumber: number = 0, 
    pageSize: number = 0,
    dateStart?: string | null,
    dateEnd?: string | null,
    order: boolean = true
    ): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    const body = { 
      typePermission: typePermission, 
      idStatus: idStatus, 
      searchText: searchText || null, 
      pageNumber: pageNumber > 0 ? pageNumber : null,
      pageSize: pageSize > 0 ? pageSize : null,
      dateStar: this.formatDate(dateStart!),
      dateEnd: this.formatDate(dateEnd!),
      order: order
    };

    return this.httpClient.post(this.GETALLPERMISSSION_URL, body, { headers });
  }

  getInfoUsers(): Observable<any> {
  
    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App':'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(this.USERSINFO_URL, { headers }).pipe(
      retry(2), 
      shareReplay(1), 
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of(null); 
      })
    );
  }

  getInfoPermission(): Observable<any> {
  
    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App':'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(this.INFOPERMISSSION_URL, { headers }).pipe(
      retry(2), 
      shareReplay(1), 
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of(null); 
      })
    );
  }

AddOrDeletFile(
    idUserAccount: string | null,
    idFile: string | null, 
    url: string | null,  
    name: string | null, 
    type: string | null,
    isPermission: boolean | false
    ): Observable<any> {

    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App': 'admin',
      'Pragma': 'no-cache'
    });

    const body = { 
      idUserAccount: idUserAccount,
      idFile: idFile,
      url: url,
      name: name,
      type: type,
      isPermission: isPermission
    };

    return this.httpClient.post(this.ADDORDELETE_URL, body, { headers });
  }

}
