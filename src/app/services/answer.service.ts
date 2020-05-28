import { Answer } from './../models/Answer';
import { Observable } from 'rxjs';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { CountRates } from 'app/models/CountRates';

interface Paginate {
    total: Number;
    perPage: Number;
    page: number;
    lastPage: number;
    data: Answer[];
}

@Injectable()
export class AnswerService {

    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/answer';
    }

    get(...params: String[]): Observable<Answer[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<Answer[]>(this.baseUrl + urlParams);
    }

    getById(id: Number): Observable<Answer> {
        return this.http.get<Answer>(this.baseUrl + '/' + id);
    }

    countRates(searchId: Number, quest: Number, ...params: String[]): Observable<CountRates[]> {
        var urlParams: string = '?quest=' + quest + '&';

        if (params) {

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<CountRates[]>(this.baseUrl + '/countRates/' + searchId + urlParams);
    }

    getNotes(search_id: Number, quest_id: Number, page?: number): Observable<Paginate> {
        var urlParams = '?search=' + search_id;

        if (page)
            urlParams += '&page=' + page;

        return this.http.get<Paginate>(this.baseUrl + '/noteByQuest/' + quest_id + urlParams);
    }

    put(id: Number, request: {}): Observable<Answer> {
        return this.http.put<Answer>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }
}