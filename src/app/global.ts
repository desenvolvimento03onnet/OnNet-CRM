import { ModalLoadingComponent } from './modal/modal-loading/modal-loading.component';
import { ModalConfirmComponent } from './modal/modal-confirm/modal-confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
declare var $: any;

interface ModalConfig {
    title: String;
    subtitle?: String;
}

@Injectable()
export class GlobalVariables {
    token: String = ''
    baseURL = 'http://177.85.0.28:7200';
}

@Injectable()
export class GlobalFunctions {

    private loading: MatDialogRef<ModalLoadingComponent> = null;

    constructor(private dialog: MatDialog) { }

    padronize(text: string | String) {
        if (!text) {
            return ''
        }
        return text.toLowerCase().normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
    }

    dateConverter(date: Date) {

        if (date === null) {
            return 'NaN-NaN-NaN'
        }

        let day: number | string = date.getDate();
        let month: number | string = date.getMonth() + 1;
        const year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        return year + '-' + month + '-' + day;
    }

    brazilianDateConverter(date: Date) {
        if (date === null) {
            return 'NaN-NaN-NaN'
        }

        let day: number | string = date.getDate();
        let month: number | string = date.getMonth() + 1;
        const year = date.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        return day + '/' + month + '/' + year;
    }

    dateTimeConverter(date: Date) {

        if (date === null) {
            return 'NaN-NaN-NaN'
        }

        const year = date.getFullYear();
        let month: number | string = date.getMonth() + 1;
        let day: number | string = date.getDate();

        let hours: number | string = date.getHours();
        let minutes: number | string = date.getMinutes();
        let seconds: number | string = date.getSeconds();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }

    showNotification(message: String, type: number) {
        const style = ['info', 'success', 'warning', 'danger'];

        $.notify({
            icon: "notifications",
            message: message

        }, {
            type: style[type],
            timer: 100,
            placement: {
                from: 'bottom',
                align: 'right'
            },
            template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">notifications</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
    }

    async confirm(title: String, params?: { subtitle?: String, width?: string }) {
        const submit: ModalConfig = { title: title }
        var width: string = "350px";

        if (params) {
            width = params.width || "350px"

            if (params.subtitle)
                submit.subtitle = params.subtitle
        }

        return await this.dialog.open(ModalConfirmComponent, {
            width: width,
            disableClose: true,
            data: submit
        }).beforeClosed().toPromise();
    }

    showLoading() {
        this.loading = this.dialog.open(ModalLoadingComponent, {
            disableClose: true
        });
    }

    stopLoading() {
        if (this.loading != null)
            this.loading.close();

        this.loading = null;
    }
}