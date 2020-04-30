import { InterviewsCount } from './../models/InterviewsCount';
import { Observable } from 'rxjs';
import { Interview } from './../models/Interview';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class InterviewService {

    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/interview';
    }

    get(...params: String[]): Observable<Interview> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<Interview>(this.baseUrl + urlParams);
    }

    getById(id: Number): Observable<Interview> {
        return this.http.get<Interview>(this.baseUrl + '/' + id);
    }

    groupByCity(): Observable<InterviewsCount[]> {
        return this.http.get<InterviewsCount[]>(this.baseUrl + '/groupBy/city');
    }

    groupByUser(): Observable<InterviewsCount[]> {
        return this.http.get<InterviewsCount[]>(this.baseUrl + '/groupBy/user');
    }

    post(request: {}): Observable<Interview> {
        return this.http.post<Interview>(this.baseUrl, request);
    }

    put(id: Number, request: {}): Observable<Interview> {
        return this.http.put<Interview>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }

}