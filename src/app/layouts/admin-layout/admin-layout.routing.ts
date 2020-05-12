import { PermissionGuardService } from './../../guard/permissionGuard.service';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TableListComponent } from '../../pages/table-list/table-list.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { AuthGuardService } from 'app/guard/authGuard.service';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }

    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService, PermissionGuardService] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService] },
    { path: 'table-list', component: TableListComponent, canActivate: [AuthGuardService] },
    { path: 'typography', component: TypographyComponent, canActivate: [AuthGuardService] },
    { path: 'icons', component: IconsComponent, canActivate: [AuthGuardService] },
    { path: 'maps', component: MapsComponent, canActivate: [AuthGuardService] },
    { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardService, PermissionGuardService] },
];
