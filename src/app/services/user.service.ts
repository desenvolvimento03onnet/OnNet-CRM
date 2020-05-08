import { User } from './../models/User';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  private baseUrl: string;

  constructor(private http: HttpClient, private globalVar: GlobalVariables) {
    this.baseUrl = globalVar.baseURL + '/user';
  }

  get(...params: String[]): Observable<User[]> {
    var urlParams: string = '';

    if (params) {
      urlParams = '?';

      params.forEach(param => {
        urlParams += param + '&';
      })

      urlParams = urlParams.slice(0, -1);
    }

    return this.http.get<User[]>(this.baseUrl + urlParams);
  }

  getById(id: Number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  post(request: {}): Observable<User> {
    return this.http.post<User>(this.baseUrl, request);
  }

  put(id: Number, request: {}): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/' + id, request);
  }

  delete(id: Number) {
    return this.http.delete(this.baseUrl + '/' + id);
  }

}
