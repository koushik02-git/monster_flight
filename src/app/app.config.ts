// ======================================================
// app.config.ts - Global Application Configuration
// ======================================================
// This file sets up the Angular application with:
//   - Routing (page navigation)
//   - Firebase services (Auth + Firestore)
//   - HTTP client (for API requests)
//
// It ensures all parts of the app (login, flight, done)
// share the same Firebase instance and can access backend APIs.
// ======================================================


import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// -------------------------------
// Firebase Project Configuration
// -------------------------------
// This object contains credentials for the Firebase project.
// These values come from the Firebase console when the app was set up.
const firebaseConfig = {
  apiKey: "AIzaSyBmkQuWMYNiHuGfBFLQ26WHx0mm_8R0pKY",
  authDomain: "monster-flight.firebaseapp.com",
  projectId: "monster-flight",
  storageBucket: "monster-flight.firebasestorage.app",
  messagingSenderId: "523724381050",
  appId: "1:523724381050:web:f5d5b15ff284c7859c14c3",
  measurementId: "G-G1PVEZFT10"
};

// -------------------------------
// Global App Config
// -------------------------------
// This exports the main configuration object used by Angular.
// Providers listed here are available throughout the app.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), 
    provideHttpClient()
  ]
};