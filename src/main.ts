// ======================================================
// main.ts - Application Entry Point
// ======================================================
// This is the very first file that runs when the Angular application starts in the browser. It bootstraps the
// root component (AppComponent) using the configuration defined in app.config.ts.

// Key Responsibilities:
//   1. Initialize Angular application.
//   2. Load global app configuration (routing, Firebase, HTTP).
//   3. Render the root AppComponent (toolbar + router outlet).
// ======================================================

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Global configuration
import { AppComponent } from './app/app';      // Root component (toolbar + pages)

// -------------------------------
// Bootstrap Angular application
// -------------------------------
// - AppComponent is the starting point of the UI.
// - appConfig provides services (Firebase, routing, etc).
// If bootstrap fails, the error will be logged to console.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
