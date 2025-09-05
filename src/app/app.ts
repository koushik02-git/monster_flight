// ======================================================
// app.ts - Root Application Component
// ======================================================
// This is the entry point of the Angular app. It manages:
//   - The global toolbar (logo + logout button).
//   - Tracking the current logged-in user.
//   - Handling logout and redirecting to login page.
// ======================================================

import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Auth, signOut, User } from '@angular/fire/auth';

@Component({
  selector: 'app-root', // Root component, used in index.html
  standalone: true,     // Standalone Angular component
  imports: [
    CommonModule,       // Basic Angular directives
    RouterOutlet,       // Enables routing (login/flight/done)
    MatToolbarModule,   // Angular Material toolbar (header bar)
    MatButtonModule     // Angular Material buttons (logout)
  ],
  templateUrl: './app.html',  // HTML structure (toolbar + router outlet)
  styleUrls: ['./app.scss']   // Styles for toolbar/header
})
export class AppComponent {
  // -------------------------------
  // Current authenticated user
  // -------------------------------
  user: User | null = null;

  constructor(
    private auth: Auth,   // Firebase Auth service
    private router: Router // Angular Router for navigation
  ) {
    // Track authentication state
    // Whenever the user signs in/out, this callback fires
    this.auth.onAuthStateChanged(u => this.user = u);
  }

  // -------------------------------
  // Logout Function
  // -------------------------------
  logout() {
    // Signs out the current user and navigates back to login page
    signOut(this.auth).then(() => this.router.navigate(['/login']));
  }
}
