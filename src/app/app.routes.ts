import { Routes } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Component } from '@angular/core'; // Keep if using inline placeholders still

// --- Guards ---
import { authGuard } from './core/guards/auth.guard';

// --- Page/Feature Components ---
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
// Correctly import Customer Dashboard (assuming renamed class)
import { CustomerDashboardComponent } from './features/customer/dashboard/dashboard.component';
import { BookTicketComponent } from './features/customer/book-ticket/book-ticket.component';
import { ViewTicketsComponent } from './features/customer/view-tickets/view-tickets.component';
// Correctly import Admin Dashboard (assuming renamed class)
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ManageTrainsComponent } from './features/admin/manage-trains/manage-trains.component';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users.component';

// --- Routes Array ---
export const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Welcome - Railway Portal' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  {
    path: 'customer',
    canActivate: [authGuard], // Apply guard
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CustomerDashboardComponent, title: 'Dashboard' }, // Use correct name
      { path: 'book-ticket', component: BookTicketComponent, title: 'Book Ticket' },
      { path: 'view-tickets', component: ViewTicketsComponent, title: 'View Tickets' },
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard], // Apply guard
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard' }, // Use correct name
        { path: 'manage-trains', component: ManageTrainsComponent, title: 'Manage Trains' },
        { path: 'manage-users', component: ManageUsersComponent, title: 'Manage Users' },
      ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route
];