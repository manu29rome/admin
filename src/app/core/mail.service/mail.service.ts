import { Injectable } from '@angular/core';
import { BASE_URLS } from '../../config/constants';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { tap, map, Observable, throwError, of } from 'rxjs';
import { catchError, shareReplay, retry  } from 'rxjs/operators';
import { AuthService } from '../login.services/auth.service';
import { Mail } from '../../models/mail.model';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  
private TEMPLATES_URL = BASE_URLS.MOD01.concat('/Mails/getIdTemplate');
private LABELS_URL = BASE_URLS.MOD01.concat('/Mails/getLabels');
private ADDORUPDATETEMPLATE_URL = BASE_URLS.MOD01.concat('/Mails/addUpdateTemplate');

constructor(
  private authservice: AuthService,
  private httpClient: HttpClient) 
  {}

  getAllLabels(): Observable<any> {
  
    const headers = new HttpHeaders({
      'Token': this.authservice.getToken() ?? '',
      'Cache-Control': 'no-cache',
      'App':'admin',
      'Pragma': 'no-cache'
    });

    return this.httpClient.get<any>(this.LABELS_URL, { headers }).pipe(
      retry(2), 
      shareReplay(1), 
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return of(null); 
      })
    );
  }

  GetTemplateIdCompany(id: string): Observable<any> {
    const url = `${this.TEMPLATES_URL}?id=${encodeURIComponent(id)}`;

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

  AddUpdateTemplate(mail: Mail): Observable<any> {
    
        const headers = new HttpHeaders({
          'Token': this.authservice.getToken() ?? '',
          'Cache-Control': 'no-cache',
          'App':'admin',
          'Pragma': 'no-cache'
        });
    
        return this.httpClient.post(this.ADDORUPDATETEMPLATE_URL, mail, { headers });
  }

}
