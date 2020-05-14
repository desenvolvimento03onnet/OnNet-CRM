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

    getBySearch(id: Number, ...params: String[]): Observable<SearchQuest[]> {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<SearchQuest[]>(this.baseUrl + '/search/' + id + urlParams);
    }

    getByQuest(id: Number, ...params: String[]) {
        var urlParams: string = '';

        if (params) {
            urlParams = '?';

            params.forEach(param => {
                urlParams += param + '&';
            })

            urlParams = urlParams.slice(0, -1);
        }

        return this.http.get<SearchQuest[]>(this.baseUrl + '/quest/' + id + urlParams);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }

}