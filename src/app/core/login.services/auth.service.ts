import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, Observable, throwError} from 'rxjs';
import { BASE_URLS } from '../../config/constants';
import { catchError } from 'rxjs/operators';    
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LOGIN_URL = BASE_URLS.MOD03.concat('/Auth/GetClientWithUsername');
  private LOGINCLIENT_URL = BASE_URLS.MOD03.concat('/Auth/company');
  private LOGINTWO_URL = BASE_URLS.MOD03.concat('/Auth/login');
  private LOGOUT_URL = BASE_URLS.MOD03.concat('/Auth/logout');
  private SENDMAILRECOVERY_URL = BASE_URLS.MOD03.concat('/Auth/recovery-email');
  private VALIDATEPASSWORD_URL = BASE_URLS.MOD03.concat('/Auth/password-validate');
  private UPDATEPASSWORD_URL = BASE_URLS.MOD03.concat('/Auth/update-password');
  private tokenKey = 'authToken';
  private dataClientKey = 'dataClientKey';
  private dataEmailKey = 'dataEmailKey';

  ip: string = '';
  domain: string = '';

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(username: string): Observable<any> {
    const url = `${this.LOGIN_URL}/${encodeURIComponent(username)}`;
    return this.httpClient.get<any>(url).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem(this.dataClientKey, JSON.stringify(response.data));
        } else {
          console.error('Error en el login:', response.error.Message);
        }
      })
    );
  }

  SendEmailRecovery(email: string, token: string, domain: string, isPassword: boolean): Observable<any> {
    const body = { 
      email: email,
      token: token,
      domain: domain,
      isPassword: isPassword
    };

    return this.httpClient.post(this.SENDMAILRECOVERY_URL, body);
  }

  updatePassword(idUserAccount: string, domain: string, password: string): Observable<any>{
    domain = domain.replace(/^\//, '');
    const body = { 
      idUserAccount: idUserAccount,
      domain: domain,
      password: password
    };

    return this.httpClient.post(this.UPDATEPASSWORD_URL, body);
  }

  ValidatePassword(idUserAccount: string, domain: string): Observable<any> {
    const body = { 
      idUserAccount: idUserAccount,
      domain: domain
    };

    return this.httpClient.post(this.VALIDATEPASSWORD_URL, body);
  }

  getClientData(domain: string): Observable<any> {
    const url = `${this.LOGINCLIENT_URL}/${encodeURIComponent(domain)}`;
    return this.httpClient.get<any>(url).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem(this.dataClientKey, JSON.stringify(response.data));
        } else {
          console.error('Error en el login:', response.error.Message);
        }
      })
    );
  }

//Solicitud de token segundo inicio de sesion
  loginTwo(username: string, password: string, token: string, code:string): Observable<any> {
    const app = 'Admin';
    const body = {
      username,   
      password,
      token,
      app,
      code
    };

    return this.httpClient.post<any>(this.LOGINTWO_URL, body).pipe(
      tap(response => {
        if (response.success == true) {
          const { Token, ImageUser, StaticModules = "[]" } = response.data;
          this.setToken(Token, ImageUser, StaticModules);
        }
      })
    );
  }

  async isTokenValid(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false; 
    }
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); 

      return decodedToken.exp > currentTime; 
    } catch (error) {
      return false; 
    }
  }

  getIp(): Observable<any> {
    return this.httpClient.get(BASE_URLS.IP_URL);
  }

  private setToken(token: string, imageUser: string, staticModules: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      
      // Convertir las cadenas JSON en objetos
      const parsedStaticModules = JSON.parse(staticModules);
  
      // Crear un objeto para organizar los datos
      const data = {
        modules: {
          static: parsedStaticModules   // Guardamos los static modules
        }
      };
      
      localStorage.setItem('userData', imageUser)
      localStorage.setItem(this.tokenKey, token)
      localStorage.setItem('appModules', JSON.stringify(data));  // Guardamos todo el objeto como JSON
    }  
  }
  setApp(): void{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      localStorage.setItem('app', 'callcenter')
    }  
  }

  getToken(): string | null{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAutheticated(): boolean{
    const token = this.getToken();
    const app = this.getApp();
    if(!token){
      return false;
    }
    if(!app){
      return false;
    }
    return true;
  }

  

   async logout(){
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      let token = this.getToken() ?? '';
      
      const email = this.getEmail(); 
      if (email && email.includes('@')) {
        this.domain = email.split('@')[1]; 
        this.domain = '/'+this.domain
      }
    
      const headers = new HttpHeaders()
      .set('Token', token);

      this.httpClient.get<any>(this.LOGOUT_URL, { headers }).pipe(
        tap(response => {
      
          if (response.success == true) {
            localStorage.removeItem(this.dataClientKey);
            localStorage.removeItem(this.dataEmailKey);
            localStorage.removeItem('_grecaptcha');
            localStorage.removeItem('authToken');
            localStorage.removeItem('app');
            localStorage.removeItem('appModules');
            localStorage.removeItem('userData');
            this.router.navigate(['/login'+this.domain]);
          }
        }),
        catchError(error => {
          localStorage.removeItem(this.dataClientKey);
            localStorage.removeItem(this.dataEmailKey);
            localStorage.removeItem('_grecaptcha');
            localStorage.removeItem('authToken');
            localStorage.removeItem('app');
            localStorage.removeItem('appModules');
            localStorage.removeItem('userData');
            this.router.navigate(['/login'+this.domain]);
          return throwError(() => error);
        })
      ).subscribe(); 
    }
  }

  loginStar(): void{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      localStorage.removeItem(this.dataClientKey);
      localStorage.removeItem(this.dataEmailKey);
      localStorage.removeItem('_grecaptcha');
      localStorage.removeItem('authToken');
    }
  }

  addEmail(email: string): void{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      localStorage.setItem(this.dataEmailKey, email);
    }
  }

  getEmail(): string | null{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem(this.dataEmailKey);
    }
    return null;
  }

  getApp(): string | null{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem('app');
    }
    return null;
  }


  getClient(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem(this.dataClientKey);
    }
    return null;
  }

  getCaptcha(): string | null{
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem("_grecaptcha");
    }
    return null;
  }
  

}
