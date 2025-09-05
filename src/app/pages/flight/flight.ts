// ======================================================
// flight.ts - Collects Guest Flight Details
// ======================================================
// This component is responsible for displaying a guest’s
// reservation details (pulled from Firestore) and collecting
// their flight information before they arrive at the resort.
//
// Key Features:
//   1. Displays reservation info (name, destination, trip dates).
//   2. Provides a form for flight details.
//   3. Validates inputs and ensures arrival date is before trip end.
//   4. Sends the details securely to the backend API.
//   5. Caches submitted flight info so the user can update it later.
// ======================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-flight',                // Component selector
  standalone: true,                      // Standalone Angular component
  imports: [CommonModule, FormsModule],  // Needed for template forms
  templateUrl: './flight.html',          // HTML structure
  styleUrls: ['./flight.scss']           // Page-specific styling
})
export class FlightComponent {
  // -------------------------------
  // Reservation details (from Firestore)
  // -------------------------------
  customer: Customer | null = null;      // The currently logged-in guest
  tripStart = '';                        // Trip start date (formatted)
  tripEnd = '';                          // Trip end date (formatted)
  tripEndIso = '';                       // Trip end date (ISO format for HTML input max value)

  // -------------------------------
  // Flight form fields
  // -------------------------------
  airline = '';                          // Airline name
  flightNumber = '';                     // Flight number
  arrivalDate = '';                      // Arrival date (must be before tripEnd)
  arrivalTime = '';                      // Arrival time
  numOfGuests: number = 1;               // Number of guests traveling
  comments = '';                         // Optional comments (special requests)

  // -------------------------------
  // Error message state
  // -------------------------------
  errorMessage = '';

  constructor(
    private http: HttpClient,            // To send POST request to backend
    private router: Router,              // To navigate between pages
    private auth: Auth,                  // Firebase Auth (to get current user)
    private customers: CustomerService   // Service to load reservation details
  ) {
    // Listen for logged-in user changes
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Load customer data (cached or from Firestore)
        this.customer = this.customers.getCurrent() || await this.customers.loadForUser(user);

        // Extract and format trip start date
        if (this.customer?.tripStart) {
          const startDate = new Date(this.customer.tripStart.seconds * 1000);
          this.tripStart = startDate.toLocaleDateString(); // show only date
        }

        // Extract and format trip end date
        if (this.customer?.tripEnd) {
          const endDate = new Date(this.customer.tripEnd.seconds * 1000);
          this.tripEnd = endDate.toLocaleDateString();      // human-readable date
          this.tripEndIso = endDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        }

        // Pre-fill flight form with previously saved values (if any)
        const savedFlight = this.customers.getFlightInfo?.();
        if (savedFlight) {
          this.airline = savedFlight.airline || '';
          this.flightNumber = savedFlight.flightNumber || '';
          this.arrivalDate = savedFlight.arrivalDate || '';
          this.arrivalTime = savedFlight.arrivalTime || '';
          this.numOfGuests = savedFlight.numOfGuests || 1;
          this.comments = savedFlight.comments || '';
        }
      }
    });
  }

  // -------------------------------
  // Handle form submission
  // -------------------------------
  submitForm() {
    // Basic validation: required fields must be filled
    if (!this.airline || !this.flightNumber || !this.arrivalDate || !this.arrivalTime) {
      this.errorMessage = 'Please fill in all required fields (*)';
      return;
    }

    // Payload structure for backend
    const payload = {
      airline: this.airline,
      flightNumber: this.flightNumber,
      arrivalDate: this.arrivalDate,
      arrivalTime: this.arrivalTime,
      numOfGuests: this.numOfGuests,
      comments: this.comments || undefined
    };

    // Cache flight info locally so user can update later
    this.customers.setFlightInfo?.(payload);

    // Send POST request to backend API
    this.http.post(
      'https://us-central1-crm-sdk.cloudfunctions.net/flightInfoChallenge',
      payload,
      {
        headers: {
          // Security token provided in challenge
          token: 'WW91IG11c3QgYmUgdGhlIGN1cmlvdXMgdHlwZS4gIEJyaW5nIHRoaXMgdXAgYXQgdGhlIGludGVydmlldyBmb3IgYm9udXMgcG9pbnRzICEh',
          candidate: 'Koushik Yaganti' // Candidate identifier
        }
      }
    ).subscribe({
      // If submission succeeds → navigate to Done Page
      next: () => this.router.navigate(['/done']),

      // If submission fails → show error message
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Submission failed. Please try again.';
      }
    });
  }
}
