import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalPutPasswordComponent } from './../../modal/modal-put-password/modal-put-password.component';
import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/user_profile', title: 'Perfil de Usuário', icon: 'person', class: '' },
  { path: '/register_interview', title: 'Registro de pesquisas', icon: 'library_books', class: '' },
  { path: '/register_quest', title: 'Registro de perguntas', icon: 'assessment', class: '' },
  { path: '/interview', title: 'Pesquisas', icon: 'question_answer', class: '' },
  { path: '/notifications', title: 'Configurações', icon: 'settings', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isMaster: boolean = false;

  constructor(private router: Router, private modal: MatDialog) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    this.isMaster = sessionStorage.getItem('isMaster') == '1' ? true : false;
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };



  changePassword() {
    this.sidebarClose()
    this.modal.open(ModalPutPasswordComponent, {
      width: '500px',
      height: '400px',
      autoFocus: true,
    })
  }

  logout() {
    sessionStorage.removeItem('bearerToken');
    this.router.navigateByUrl('/login');
  }

  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('nav-open');
  };
}
