import { Answer } from './../models/Answer';
import { Observable } from 'rxjs';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

export interface AnswersByQuest {
    quest_id: Number;
    question: String;
    rates: {
        rate: number;
        count: string;
    }[];
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

    countAnswersByQuest(searchId: Number): Observable<AnswersByQuest[]> {
        return this.http.get<AnswersByQuest[]>(this.baseUrl + '/groupBy/answersByQuest/' + searchId);
    }

    put(id: Number, request: {}): Observable<Answer> {
        return this.http.put<Answer>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }
}