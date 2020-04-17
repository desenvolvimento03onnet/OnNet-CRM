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

    get(): Observable<City[]> {
        return this.http.get<City[]>(this.baseUrl);
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