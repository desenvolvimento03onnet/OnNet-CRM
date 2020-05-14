import { Observable } from 'rxjs';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { SearchQuest } from 'app/models/SearchQuest';

@Injectable()
export class SearchQuestService {
    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/searchQuest';
    }

    get(): Observable<SearchQuest[]> {
        return this.http.get<SearchQuest[]>(this.baseUrl);
    }

    getById(id: Number): Observable<SearchQuest> {
        return this.http.get<SearchQuest>(this.baseUrl + '/' + id);
    }

    getBySearch(id: Number): Observable<SearchQuest[]> {
        return this.http.get<SearchQuest[]>(this.baseUrl + '/search/' + id);
    }

    getByQuest(id: Number) {
        return this.http.get<SearchQuest[]>(this.baseUrl + '/quest/' + id);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }

}