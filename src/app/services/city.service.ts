import { City } from './../models/City';
import { Observable } from 'rxjs';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class CityService {

    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/city';
    }

    get(...params: String[]): Observable<City[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<City[]>(this.baseUrl + urlParams);
    }

    getById(id: Number): Observable<City> {
        return this.http.get<City>(this.baseUrl + '/' + id);
    }

    post(request: {}): Observable<City> {
        return this.http.post<City>(this.baseUrl, request);
    }

    put(id: Number, request: {}): Observable<City> {
        return this.http.put<City>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }

}