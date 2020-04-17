import { AnswersByQuest } from './../models/AnswersByQuest';
import { Answer } from './../models/Answer';
import { Observable } from 'rxjs';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class AnswerService {

    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/answer';
    }

    get(): Observable<Answer[]> {
        return this.http.get<Answer[]>(this.baseUrl);
    }

    getById(id: Number): Observable<Answer> {
        return this.http.get<Answer>(this.baseUrl + '/' + id);
    }

    countAnswersByQuest(searchId: Number): Observable<AnswersByQuest[]> {
        return this.http.get<AnswersByQuest[]>(this.baseUrl + '/groupBy/answersByQuest/' + searchId);
    }

    getByCityId(id: Number): Observable<Answer[]> {
        return this.http.get<Answer[]>(this.baseUrl + '/city/' + id);
    }

    getByInterviewId(id: Number): Observable<Answer[]> {
        return this.http.get<Answer[]>(this.baseUrl + '/interview/' + id);
    }

    getByQuest(id: Number): Observable<Answer[]> {
        return this.http.get<Answer[]>(this.baseUrl + '/quest/' + id);
    }

    put(id: Number, request: {}): Observable<Answer> {
        return this.http.put<Answer>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }
}