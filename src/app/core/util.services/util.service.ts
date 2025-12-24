import { Injectable } from '@angular/core';
import { CountryCode } from '../../models/contry.model'; 
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URLS } from '../../config/constants';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  contry: CountryCode = new CountryCode();
  private url = BASE_URLS.CODE_CONTRY;

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<CountryCode[]> {
    return this.httpClient.get<CountryCode[]>(this.url);
  }

}
