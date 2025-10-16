import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Layout } from './Components/layout/layout';
import { Dashboard1 } from './Components/dashboard1/dashboard1';
import { Dashboard2 } from './Components/dashboard2/dashboard2';
import { Dashboard3 } from './Components/dashboard3/dashboard3';
import { authGuard } from './Guards/auth-guard';
import { Register } from './Components/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Login,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard1',
        component: Dashboard1,
        title: 'Dashboard 1',
      },
      {
        path: 'dashboard2',
        component: Dashboard2,
        title: 'Dashboard 2',
      },
      {
        path: 'dashboard3',
        component: Dashboard3,
        title: 'Dashboard 3',
      },
    ],
  },
];
