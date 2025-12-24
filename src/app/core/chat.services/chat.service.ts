import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BASE_URLS } from '../../config/constants';
import { AuthService } from '../login.services/auth.service';
import { tap, Observable, throwError, of } from 'rxjs';
import { catchError, shareReplay, retry  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private CHATLIST_URL = BASE_URLS.MOD05.concat('/Chat/listChatUsers');
  private CHAT_URL = BASE_URLS.MOD05.concat('/Chat/messages');
  private CHATIMAGE_URL = BASE_URLS.MOD01.concat('/Client/uploadimage');
  private CHATFILE_URL = BASE_URLS.MOD01.concat('/Client/uploadfile');
  private CHATGROUPVIEW_URL = BASE_URLS.MOD05.concat('/Chat/viewgroup');
  private CHATNAMELIST = BASE_URLS.MOD05.concat('/Chat/chatUsersGroup');

  ip: string = '';
  token: string = '';
  
  constructor(private httpClient: HttpClient, 
    private authService: AuthService) {}

    groupView(idgroup: string): Observable<any> {
      const url = `${this.CHATGROUPVIEW_URL}?idGroup=${encodeURIComponent(idgroup)}`;
      this.token = this.authService.getToken() ?? '';
    
      const headers = new HttpHeaders()
      .set('Token', this.token)
      .set('App', 'admin');
    
      return this.httpClient.get<any>(url, { headers }).pipe(
        tap(response => {
          console.log('Response received:', response);  // Log completo de la respuesta
          if (response && response.success) {
          } else if (response && response.error) {
            console.error('correcto');
          } else {
            console.error('No se recibió una respuesta válida.');
          }
        }),
        catchError(error => {
          console.error('Error en la solicitud HTTP:', error);
          return throwError(error);  // Manejo de errores HTTP
        })
      );
    }
  
    chatList(): Observable<any> {
      const timestamp = new Date().getTime();
      const url = `${this.CHATLIST_URL}?_=${timestamp}`;
    
      const headers = new HttpHeaders({
        'Token': this.authService.getToken() ?? '',
        'Cache-Control': 'no-cache',
        'App':'admin',
        'Pragma': 'no-cache'
      });
    
      return this.httpClient.get<any>(url, { headers }).pipe(
        retry(2), // Reintenta 2 veces antes de fallar
        shareReplay(1), // Cachea la respuesta para evitar solicitudes innecesarias
        catchError(error => {
          console.error('Error en la solicitud HTTP:', error);
          return of([]); // Devuelve un array vacío en caso de error
        })
      );
    }

  chat(idRoom: string, isGroup: boolean): Observable<any> {

    const body = { 
      idChatRoom: idRoom,
      isGroup: isGroup
    };

    this.token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders()
    .set('Token', this.token)
    .set('App', 'admin');
  
    return this.httpClient.post<any>(this.CHAT_URL, body, { headers }).pipe(
      tap(response => {
        console.log('Response received:', response);  // Log completo de la respuesta
        if (response && response.success) {
        } else if (response && response.error) {
          console.error('correcto');
        } else {
          console.error('No se recibió una respuesta válida.');
        }
      }),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError(error);  // Manejo de errores HTTP
      })
    );
  }

  imageBase(image: string, type: string, module: string): Observable<any> {
    this.token = this.authService.getToken() ?? '';
  
    const body = { 
      file: image,
      folder: type,
      module: module,
    };
  
    const headers = new HttpHeaders()
      .set('Token', this.token)
      .set('Content-Type', 'application/json')
      .set('App', 'admin');
  
    return this.httpClient.post<any>(this.CHATIMAGE_URL, body, { headers }).pipe(
      tap(response => {
        if (response.success == true) {
          console.log(response);
        }
      })
    );
  }

  fileBase(file: string, type: string,module: string): Observable<any> {
    this.token = this.authService.getToken() ?? '';
  
    const body = { 
      file: file,
      folder: type,
      module: module,
    };
  
    const headers = new HttpHeaders()
      .set('Token', this.token)
      .set('Content-Type', 'application/json')
      .set('App', 'admin');
  
    return this.httpClient.post<any>(this.CHATFILE_URL, body, { headers }).pipe(
      tap(response => {
        if (response.success == true) {
          console.log(response);
        }
      })
    );
  }
  
  playNotificationSound() {
    const audio = new Audio(BASE_URLS.URL_SOUND_NOTIFICATION); // Ruta al archivo de sonido
    audio.play().catch(err => console.error('Error al reproducir el sonido:', err));
  }
  
  GroupNameList(idRoom: string, isGroup: boolean): Observable<any>{
    const body = { 
      idChatRoom: idRoom,
      isGroup: isGroup
    };

    this.token = this.authService.getToken() ?? '';
  
    const headers = new HttpHeaders()
    .set('Token', this.token)
    .set('App', 'admin');

    return this.httpClient.post<any>(this.CHATNAMELIST, body, { headers }).pipe(
      tap(response => {
        console.log('Response received:', response);  // Log completo de la respuesta
        if (response && response.success) {
        } else if (response && response.error) {
          console.error('correcto');
        } else {
          console.error('No se recibió una respuesta válida.');
        }
      }),
      catchError(error => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError(error);  // Manejo de errores HTTP
      })
    );
  }
  
}
