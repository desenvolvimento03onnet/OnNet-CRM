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

    get(): Observable<Quest[]> {
        return this.http.get<Quest[]>(this.baseUrl);
    }

    getById(id: Number): Observable<Quest> {
        return this.http.get<Quest>(this.baseUrl + '/' + id);
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