import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GlobalVariables } from './../global';
import { HttpClient } from '@angular/common/http';

interface Login {
    username: String,
    password: String
}

interface Token{
    token: String,
    type: String
}

@Injectable()
export class AuthService {

    private baseUrl: string;

    constructor(private http: HttpClient, private globalVar: GlobalVariables) {
        this.baseUrl = globalVar.baseURL + '/authenticate';
    }

    getToken(request: Login): Observable<Token> {
        return this.http.post<Token>(this.baseUrl, request);
    }
}