import { InterviewsCount } from './../models/InterviewsCount';
import { Observable } from 'rxjs';
import { Interview } from './../models/Interview';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

interface AdvancedSearch {
    client_name?: String;
    city?: Number;
    search?: Number;
    user?: Number;
    begin?: String;
    end?: String;
}

interface Pagination {
    total: Number;
    perPage: Number;
    page: Number;
    lastPage: Number;
    data: Interview[];
}

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

    getFiltered(request: AdvancedSearch, ...params: String[]): Observable<Pagination> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.post<Pagination>(this.baseUrl + '/filtered' + urlParams, request);
    }

    getById(id: Number): Observable<Interview> {
        return this.http.get<Interview>(this.baseUrl + '/' + id);
    }

    groupByCity(...params: String[]): Observable<InterviewsCount[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<InterviewsCount[]>(this.baseUrl + '/groupBy/city' + urlParams);
    }

    groupByUser(...params: String[]): Observable<InterviewsCount[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<InterviewsCount[]>(this.baseUrl + '/groupBy/user' + urlParams);
    }

    post(request: {}): Observable<Interview> {
        return this.http.post<Interview>(this.baseUrl, request);
    }

    put(id: Number, request: {}): Observable<Interview> {
        return this.http.put<Interview>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number): Observable<any> {
        return this.http.delete(this.baseUrl + '/' + id);
    }

}