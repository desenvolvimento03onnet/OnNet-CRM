import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariables {
    // token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImlhdCI6MTU3OTg4OTU0Mn0.i9XJNtpHKFn-sDhvP1DtQsNwb2W7JODDXc69lxJrHUY'
    baseURL = 'http://177.85.0.28:7200';
}

export class GlobalFunctions {

    padronize(text: string | String) {
        return text.toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
    }

    dataConverter(date: Date) {
        let day: number | string = date.getDate();
        let month: number | string = date.getMonth() + 1;
        const year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        return year + '-' + month + '-' + day;
    }

}