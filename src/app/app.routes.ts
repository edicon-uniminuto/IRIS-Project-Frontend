import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/components/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'tasks', canActivate: [authGuard], loadComponent: () => import('./features/tasks/components/task-list/task-list.component').then(m => m.TaskListComponent) },
  { path: '**', redirectTo: '' }
];
