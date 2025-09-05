// ======================================================
// done.ts - Confirmation / Success Page
// ======================================================
// This component is shown after a guest successfully submits
// their flight details. It provides a confirmation message
// and an option to return to the flight form to update info.
//
// Key Features:
//   1. Shows a friendly confirmation message.
//   2. Displays guest information (pulled from CustomerService).
//   3. Provides a button to "Update Details", which takes the
//      user back to the flight page with pre-filled info.
// ======================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-done',            // Component selector
  standalone: true,                // Standalone Angular component
  imports: [CommonModule],         // Imports CommonModule for template features
  templateUrl: './done.html',      // HTML layout for the done page
  styleUrls: ['./done.scss']       // Page-specific styling
})
export class DoneComponent {
  // -------------------------------
  // Reservation details for greeting
  // -------------------------------
  customer: Customer | null = null;

  constructor(
    private router: Router,         // Angular Router (to navigate back to flight page)
    private customers: CustomerService // Service holding cached customer info
  ) {
    // Load the current customer from cache (set during login/flight entry)
    this.customer = this.customers.getCurrent();
  }

  // -------------------------------
  // Navigate back to flight form
  // -------------------------------
  updateDetails() {
    // Redirects user to flight page
    // Pre-filled details will be shown thanks to cached flight info
    this.router.navigate(['/flight']);
  }
}
