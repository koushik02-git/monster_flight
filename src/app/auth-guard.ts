// ======================================================
// auth-guard.ts - Route Guard for Protected Pages
// ======================================================
// This guard runs before navigating to protected routes
// (e.g., /flight and /done). It ensures:
//
//   1. A user is logged in with Firebase Auth.
//   2. The logged-in user matches a reservation in Firestore.
//   3. If validation fails, the user is redirected to login.
//
// This prevents unauthorized users from directly accessing
// flight or confirmation pages without a valid reservation.
// ======================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { CustomerService } from './services/customer.service';

// -------------------------------
// authGuard function
// -------------------------------
// Implements Angular's CanActivate guard as a function.
// Returns true → allow navigation
// Returns false → block navigation and redirect
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);               // Firebase Authentication service
  const router = inject(Router);           // Angular Router (for redirects)
  const customers = inject(CustomerService); // Service to validate reservation

  return new Promise<boolean>((resolve) => {
    // Listen for auth state changes (login/logout)
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // 🚫 No user logged in → redirect to login
        router.navigate(['/login']);
        return resolve(false);
      }

      // 🔍 Validate user against Firestore Customers collection
      const customer = await customers.loadForUser(user);

      if (customer) {
        // ✅ Found a reservation match → allow access
        return resolve(true);
      }

      // ❌ Logged-in user not found in Firestore → force logout
      await auth.signOut();

      // Redirect back to login with "not authorized" message
      router.navigate(['/login'], { queryParams: { reason: 'not-authorized' } });

      resolve(false);
    });
  });
};
