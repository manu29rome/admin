import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/component/layout/layout.component'),
        children: 
        [
            {
                path: 'dashboard',
                loadComponent: () => import('./bussines/dashboard/dashboard.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'domain',
                loadComponent: () => import('./bussines/domain/domain.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'roles',
                loadComponent: () => import('./bussines/roles/roles.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'users',
                loadComponent: () => import('./bussines/users/users.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'permission',
                loadComponent: () => import('./bussines/permission/permission.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'mail',
                loadComponent: () => import('./bussines/mail/mail.component'),
                canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ]

    },
    {
        path: 'login',
        loadComponent: () => import('./authentication/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'login/:code',
        loadComponent: () => import('./authentication/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'email-recovery',
        loadComponent: () => import('./authentication/email-recovery/email-recovery.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'logintwo',
        loadComponent: () => import('./authentication/login-two/login-two.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'password-update',
        loadComponent: () => import('./authentication/password-update/password-update.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];