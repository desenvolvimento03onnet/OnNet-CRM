import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";

@Injectable()
export class HttpInterceptorRequest {

    intercept(
        req: HttpRequest<any>, //Qual tipo de requisição será afetada
        next: HttpHandler, //Passa ele para frente
    ): Observable<HttpEvent<any>> {

        const authToken = sessionStorage.getItem('bearerToken')

        if (authToken) {
            req = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${authToken}`),
            })
        }
        return next.handle(req)
    }

}