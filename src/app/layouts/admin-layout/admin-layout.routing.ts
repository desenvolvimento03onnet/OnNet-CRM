import { RegisterQuestComponent } from './../../pages/register-quest/register-quest.component';
import { PermissionGuardService } from './../../guard/permissionGuard.service';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { RegisterInterviewComponet } from '../../pages/register-interview/register-interview.component';
import { InterviewComponent } from '../../pages/interview/interview.component';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { AuthGuardService } from 'app/guard/authGuard.service';

export const AdminLayoutRoutes: Routes = [

    {
        path: '',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuardService, PermissionGuardService]
    },
    {
        path: 'user_profile',
        component: UserProfileComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'register_interview',
        component: RegisterInterviewComponet,
        canActivate: [AuthGuardService]
    },
    {
        path: 'register_quest',
        component: RegisterQuestComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'interview',
        component: InterviewComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'notifications',
        component: SettingsComponent,
        canActivate: [AuthGuardService, PermissionGuardService]
    }
];
