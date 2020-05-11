import { UserService } from './../services/user.service';
import { HttpClient } from '@angular/common/http';
import { User } from './../models/User';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class PermissionGuardService implements CanActivate {


    constructor(private userService: UserService, private router: Router) {

    }

    async canActivate() {
        const master = sessionStorage.getItem('isMaster');

        if (master == '1')
            return true;

        this.router.navigateByUrl('/maps');

        return false
    }

}