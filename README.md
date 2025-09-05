## 🏨 Monster Flight Information App

This project is a user-friendly web application built for Monster Reservations Group to collect and manage guest flight details before their arrival at an international resort. The app ensures a seamless check-in experience by authenticating guests, validating their reservation, and securely transmitting flight details to the backend.

It is designed with a focus on clean user experience, branding consistency, and secure authentication.

## ✨ Features

# 🔐 Authentication

Google Sign-In (only emails associated with reservations are allowed).

Phone Number Login with OTP Verification using Firebase.

# Smart Captcha Handling:

Captcha disappears after verification.

Resend OTP feature included.

Enter key triggers OTP submission or verification for a smooth experience.

# 📋 Reservation Integration

Guests are validated against Firestore Customer Records:

Email, phone number, trip ID, trip dates, destination.

Invalid login shows user-friendly error messages.

Refresh resets login state back to clean stage.

# ✈️ Flight Details Form
Collects:

Airline Name*

Flight Number*

Arrival Date*

Arrival Time*

Number of Guests*

Comments (optional)

Required fields marked with *.

Form validates inputs before submission.

Submits payload to Monster backend via secure API.

## ✅ Confirmation / Done Page

# Displays:
“You’re all set 🎉 We’ve received your arrival details!”

Personalized greeting with guest’s name and destination.

Option to Update Details (pre-fills the form on return).

Consistent green/white theme with Monster branding.

## 🎨 User Experience & Branding

Consistent green & white theme across all pages.

Mobile-friendly responsive design.

Centered captcha and inputs for better readability.

# Footer on all pages:
“Questions? CALL: 844-648-2229”.

## 🛠️ Technologies Used

Angular 16 – Frontend framework

Firebase Authentication – Google & Phone OTP login

Firebase Firestore – Stores customer reservation records

Firebase Hosting – Deployment & hosting

Bootstrap + SCSS – Styling and responsive UI

REST API – Sends flight info to Monster backend

##Database
Here's how the database storage looks like:
<img width="1530" height="581" alt="image" src="https://github.com/user-attachments/assets/d3611247-7e38-412c-9132-19c3f44b47cb" />

## 🚀 Installation & Setup
Prerequisites

Node.js
 v18+

Firebase project with Authentication + Firestore enabled

Steps

# 1. Clone the repository

git clone <your-repo-url>

cd monster-flight

# 2. Install dependencies

npm install

# 3. Start local dev server

ng serve -o

# 4. Build for production

ng build

# 5. Deploy to Firebase

firebase deploy --only hosting

## 🗂️ Project Structure

monster-flight/
│

├── src/

│   ├── app/

│   │   ├── pages/

│   │   │   ├── login/        # Login page (Google/Phone auth)

│   │   │   ├── flight/       # Flight form (guest fills arrival details)

│   │   │   └── done/         # Confirmation page (success message + update option)

│   │   ├── services/

│   │   │   └── customer.service.ts  # Handles Firestore queries & customer caching

│   │   ├── app.routes.ts    # Application routing (login → flight → done)

│   │   ├── auth-guard.ts    # Ensures only valid guests can access pages

│   │   └── app.config.ts    # Firebase & Angular app configuration

│   │

│   ├── assets/

│   │   ├── logo.png         # Monster Reservations Group logo

│   │   └── login-background.png # Background styling (optional)

│   │

│   ├── styles.scss          # Global SCSS styles

│   └── index.html           # Main entry point

│

├── dist/monster-flight/     # Production build output (deploys to Firebase Hosting)

├── angular.json             # Angular project config

├── firebase.json            # Firebase hosting config

├── .firebaserc              # Firebase project alias

├── package.json             # Dependencies & scripts

└── README.md                # Project documentation (this file)

## 🔗 API Integration

Flight details are sent via HTTP POST to Monster backend:

# URL:

https://us-central1-crm-sdk.cloudfunctions.net/flightInfoChallenge


# Headers:

token: provided secure token

candidate: candidate name

Payload Example:

{

  "airline": "Delta",

  "arrivalDate": "2025-10-01",
  
  "arrivalTime": "15:30",
  
  "flightNumber": "DL123",
  
  "numOfGuests": 2,
  
  "comments": "Need wheelchair assistance"

}

## 🌐 Deployment (Firebase Hosting)

Build project:

ng build

→ output will be in /dist/monster-flight

Deploy to Firebase:

firebase deploy

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
