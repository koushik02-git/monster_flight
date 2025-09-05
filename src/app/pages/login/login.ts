// ================================================
// login.ts - Handles User Authentication
// ================================================
// This component is responsible for user login. It provides
// two options for authentication:
//   1. Google Sign-In
//   2. Phone number with OTP verification
//
// Only guests with reservations in Firestore are allowed to continue.
// On successful login, users are redirected to the Flight Details page.
// ================================================

import { Component, OnInit } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

@Component({
  selector: 'app-login',                   // Selector to embed this component
  standalone: true,                        // Standalone Angular component (no NgModule)
  templateUrl: './login.html',             // HTML template for the login page
  styleUrls: ['./login.scss'],             // SCSS file for styling
  imports: [CommonModule, FormsModule]     // Import Angular modules used here
})

export class LoginComponent implements OnInit {
  // -------------------------------
  // State variables (form values)
  // -------------------------------
  countryCode: string = '+1';              // Default country code
  phoneNumber: string = '';                // User phone number input
  otp: string = '';                        // OTP input by the user
  confirmationResult?: ConfirmationResult; // Firebase result for OTP verification

  // -------------------------------
  // Error message states
  // -------------------------------
  googleError: string = '';                // Error shown when Google sign-in fails
  phoneError: string = '';                 // Error shown when phone number/OTP is invalid


  constructor(
    private auth: Auth,                    // Firebase Authentication service
    private router: Router,                // Angular Router for navigation
    private route: ActivatedRoute          // To capture query params (e.g., errors from guards)
  ) {}

  
  ngOnInit() {
    // Reset all fields to a clean state when page loads or refreshes
    this.resetState();

    // Check if redirected with a "not-authorized" reason
    // This happens when the user logs in with a valid Google account,
    // but the account is not in Firestore reservation records.
    this.route.queryParams.subscribe(params => {
      if (params['reason'] === 'not-authorized') {
        this.googleError = 'Please sign in with the email or phone number reserved to your trip';
      }
    });
  }

  // Resets all variables so login page starts fresh
  resetState() {
    this.countryCode = '+1';
    this.phoneNumber = '';
    this.otp = '';
    this.confirmationResult = undefined;
    this.googleError = '';
    this.phoneError = '';
    // ✅ Remove old reCAPTCHA verifier
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear(); // destroys widget if possible
      } catch {}
      window.recaptchaVerifier = undefined;
    }

    // ✅ Recreate verifier immediately for a fresh session
    window.recaptchaVerifier = new RecaptchaVerifier(
      this.auth,
      'recaptcha-container',
      { size: 'normal' }
    );
  }

  // -------------------------------
  // Google Sign-In
  // -------------------------------
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      // Opens Google popup for login
      await signInWithPopup(this.auth, provider);

      // If successful, redirect to flight details page
      this.router.navigate(['/flight']);
    } catch (error) {
      // If login fails (e.g., popup closed or invalid credentials)
      this.googleError = 'Google login failed. Please try again.';
    }
  }

  // -------------------------------
  // Send OTP to phone number
  // -------------------------------
  async sendOTP() {
    const fullPhone = `${this.countryCode}${this.phoneNumber}`;

    // Clear old error messages
    this.phoneError = '';
    this.googleError = '';

    // Basic validation before calling Firebase
    if (!this.countryCode || !this.phoneNumber) {
      this.phoneError = 'Phone number not valid. Please use the phone number used to reserve your trip.';
      return;
    }

    try {
      // If a previous verifier exists, clear it
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', { size: 'normal' });
      }

      // Ask Firebase to send OTP
      this.confirmationResult = await signInWithPhoneNumber(this.auth, fullPhone, window.recaptchaVerifier);

      // Hide captcha once verified successfully
      const captchaEl = document.getElementById('recaptcha-container');
      if (captchaEl) captchaEl.style.display = 'none';

    } catch (error) {
      // If phone number is invalid or Firebase rejects it
      this.phoneError = 'Phone number not valid. Please use the phone number used to reserve your trip.';
    }
  }

  // -------------------------------
  // Verify OTP entered by user
  // -------------------------------
  async verifyOTP() {
    try {
      if (!this.confirmationResult) return;

      // Ask Firebase to verify OTP
      await this.confirmationResult.confirm(this.otp);

      // If OTP is correct → redirect to flight page
      this.router.navigate(['/flight']);
    } catch (error) {
      // Wrong OTP entered
      this.phoneError = 'Invalid OTP, please try again.';
    }
  }
}
