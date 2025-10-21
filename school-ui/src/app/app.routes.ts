import { Routes } from '@angular/router';
import { Login } from './login/login';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Layout } from './layout/layout';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { AuthGuard } from './auth-guard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'admin-dashboard',
        component: AdminDashboard,
        canActivate: [AuthGuard],
        data: { expectedRole: 'admin' },
      },
      {
        path: 'student-dashboard',
        component: StudentDashboard,
        canActivate: [AuthGuard],
        data: { expectedRole: 'student' },
      },
      {
        path: 'about',
        component: About,
      },
      {
        path: 'contact',
        component: Contact,
      },
    ],
  },
];
