import { Observable } from 'rxjs';
import { Search } from './../models/Search';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class SearchService {

    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/search';
    }

    get(...params: string[]): Observable<Search[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<Search[]>(this.baseUrl + urlParams);
    }

    getById(id: Number): Observable<Search> {
        return this.http.get<Search>(this.baseUrl + '/' + id);
    }

    getExceptQuest(id: Number, ...params: string[]): Observable<Search[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<Search[]>(this.baseUrl + '/exceptQuest/' + id + urlParams);
    }

    post(request: {}): Observable<Search> {
        return this.http.post<Search>(this.baseUrl, request);
    }

    put(id: Number, request: {}): Observable<Search> {
        return this.http.put<Search>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }

}