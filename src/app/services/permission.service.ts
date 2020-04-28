import { Permission } from './../models/Permission';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from './../global';
import { Injectable } from "@angular/core";

@Injectable()
export class PermissionService {
    private baseUrl: string;

    constructor(private http: HttpClient, private gloobalVar: GlobalVariables) {
        this.baseUrl = gloobalVar.baseURL + '/permission';
    }

    get(): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.baseUrl);
    }

    getById(id: Number): Observable<Permission> {
        return this.http.get<Permission>(this.baseUrl + '/' + id);
    }

    post(request: {}): Observable<Permission> {
        return this.http.post<Permission>(this.baseUrl, request);
    }

    put(id: Number, request: {}) {
        return this.http.put<Permission>(this.baseUrl + '/' + id, request);
    }

    delete(id: Number) {
        return this.http.delete(this.baseUrl + '/' + id);
    }
}