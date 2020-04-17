import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";

@Injectable()
export class HttpInterceptorRequest {

    intercept(
        req: HttpRequest<any>, //Qual tipo de requisição será afetada
        next: HttpHandler, //Passa ele para frente
    ): Observable<HttpEvent<any>> {

        const setToken = window.sessionStorage.setItem('auth_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU4NjgwODE0OH0.j-ShwZefsG45-VDlW-hve6HqiXS-Wh5zP116gwF1MqY')
        const authToken = window.sessionStorage.getItem('auth_token')

        if (authToken) {
            req = req.clone({
                // headers: req.headers.set('Authorization', `Bearer ${authToken}`),
                headers: req.headers.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU4NjgwODE0OH0.j-ShwZefsG45-VDlW-hve6HqiXS-Wh5zP116gwF1MqY`)
            })
        }
        return next.handle(req)
    }

}