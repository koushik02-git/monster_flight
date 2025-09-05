// ======================================================
// app.routes.ts - Application Routing Configuration
// ======================================================
// This file defines the navigation structure of the app.
// Each route points to a component (page). Some routes
// are protected with an auth guard, ensuring only logged-in
// and authorized users can access them.
// ======================================================

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';   // Login page
import { FlightComponent } from './pages/flight/flight'; // Flight details page
import { DoneComponent } from './pages/done/done';       // Confirmation page
import { authGuard } from './auth-guard';                // Guard for protected routes

// -------------------------------
// Routes definition
// -------------------------------
export const routes: Routes = [
  // Public route: login page
  { path: 'login', component: LoginComponent },

  // Protected route: flight details page
  // Only accessible if authGuard passes (user is authenticated + authorized)
  { path: 'flight', component: FlightComponent, canActivate: [authGuard] },

  // Protected route: done/confirmation page
  // Only accessible if authGuard passes
  { path: 'done', component: DoneComponent, canActivate: [authGuard] },

  // Wildcard route: anything else redirects to login
  // Prevents broken URLs from showing blank pages
  { path: '**', redirectTo: 'login' }
];
