import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        const token: String = sessionStorage.getItem('bearerToken');

        if (token === '' || token == null || token == undefined) {
            this.router.navigateByUrl('/login');

            return false
        }

        return true;
    }
}
