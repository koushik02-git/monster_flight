// ======================================================
// customer.service.ts - Manages Customer Reservation Data
// ======================================================
// This Angular service connects authentication (Google/Phone)
// with reservation records stored in Firestore. It ensures
// that only valid customers with a reservation can log in
// and access the flight details page.
//
// Key Features:
//   1. Looks up customer records by email or phone.
//   2. Normalizes data (case-insensitive email, cleaned phone).
//   3. Caches customer data so all components can access it.
//   4. Stores temporary flight info entered by the guest.
// ======================================================

import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

// -------------------------------
// Customer data model
// -------------------------------
// This defines what a customer record looks like in Firestore.
// Not all fields are mandatory (hence most are optional).
export interface Customer {
  customerId?: string;   // Unique ID for customer
  email?: string;        // Email used for reservation
  phone?: string;        // Phone number used for reservation
  firstName?: string;    // Guest first name
  lastName?: string;     // Guest last name
  tripId?: string;       // Reservation/trip ID
  tripStart: any;        // Trip start date (Firestore Timestamp)
  tripEnd: any;          // Trip end date (Firestore Timestamp)
  destination?: string;  // Resort / destination
  validUntil?: any;      // Last valid day for trip
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  // -------------------------------
  // Internal state management
  // -------------------------------
  private customer$ = new BehaviorSubject<Customer | null>(null); 
  // Holds the current logged-in customer (or null if none)

  private flightInfo: any = null; 
  // Stores cached flight details entered by the user (optional)

  // -------------------------------
  // Flight info cache methods
  // -------------------------------
  setFlightInfo(info: any) {
    this.flightInfo = info; // Save flight details temporarily
  }

  getFlightInfo() {
    return this.flightInfo; // Retrieve cached flight details
  }

  constructor(private db: Firestore) {}

  // -------------------------------
  // Load reservation for signed-in user
  // -------------------------------
  /**
   * Given a Firebase Auth user, find the matching reservation record
   * in Firestore. Matching order:
   *   1. Email (preferred, normalized to lowercase).
   *   2. Phone number (normalized: removes spaces/dashes).
   *
   * If found → returns and caches the customer record.
   * If not found → returns null and clears cache.
   */
  async loadForUser(user: User): Promise<Customer | null> {
    // Normalize email (lowercase, no spaces)
    const normalizedEmail = user.email ? user.email.trim().toLowerCase() : null;

    // Normalize phone (remove spaces, dashes)
    const normalizedPhone = user.phoneNumber
      ? user.phoneNumber.replace(/\s|-/g, '')
      : null;

    console.log('🔎 Checking Firestore for user:', {
      rawEmail: user.email,
      normalizedEmail,
      rawPhone: user.phoneNumber,
      normalizedPhone
    });

    // 🔍 Try to match by email first
    if (normalizedEmail) {
      const q1 = query(
        collection(this.db, 'Customers'),
        where('email', '==', normalizedEmail)
      );
      const s1 = await getDocs(q1);
      if (!s1.empty) {
        console.log('✅ Email match found:', normalizedEmail);
        return this.returnAndCache(s1.docs[0].data() as Customer);
      } else {
        console.warn('❌ No Firestore match for email:', normalizedEmail);
      }
    }

    // 🔍 If no email match, try phone number
    if (normalizedPhone) {
      const q2 = query(
        collection(this.db, 'Customers'),
        where('phone', '==', normalizedPhone)
      );
      const s2 = await getDocs(q2);
      if (!s2.empty) {
        console.log('✅ Phone match found:', normalizedPhone);
        return this.returnAndCache(s2.docs[0].data() as Customer);
      } else {
        console.warn('❌ No Firestore match for phone:', normalizedPhone);
      }
    }

    // 🚫 If neither email nor phone match
    console.error('🚫 No matching customer record found for this user.');
    this.customer$.next(null);
    return null;
  }

  // -------------------------------
  // Cache management helpers
  // -------------------------------

  /** Store and return the customer object */
  private returnAndCache(customer: Customer) {
    this.customer$.next(customer);
    return customer;
  }

  /** Observable so components can react to customer changes */
  getCustomer$() {
    return this.customer$.asObservable();
  }

  /** Current cached customer value */
  getCurrent() {
    return this.customer$.value;
  }
}
