import { Quest } from './../models/Quest';
import { Observable } from 'rxjs';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestService {
    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/quest';
    }

    get(...params: string[]): Observable<Quest[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<Quest[]>(this.baseUrl + urlParams);
    }

    getById(id: Number): Observable<Quest> {
        return this.http.get<Quest>(this.baseUrl + '/' + id);
    }

    getExceptSearch(id: Number, ...params: string[]): Observable<Quest[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<Quest[]>(this.baseUrl + '/exceptSearch/' + id + urlParams);
    }

    post(request: {}): Observable<Quest> {
        return this.http.post<Quest>(this.baseUrl, request);
    }

    put(id: Number, request: {}): Observable<Quest> {
        return this.http.put<Quest>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }
}