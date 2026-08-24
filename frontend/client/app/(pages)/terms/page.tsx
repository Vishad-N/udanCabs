"use client";

import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Terms & <span className="text-primary">Conditions</span></h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
            <p>
              Welcome to Udan Cabs. By accessing and using our website and services, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of the Udan Cabs platform in Ujjain and surrounding areas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Booking and Services</h2>
            <p>
              Udan Cabs provides taxi booking, outstation travel, and two-wheeler rental services. All bookings are subject to vehicle availability and confirmation. We reserve the right to cancel or modify bookings in case of unforeseen circumstances such as natural disasters or vehicle breakdowns.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users must provide accurate information during the booking process.</li>
              <li>Any damage caused to the vehicle during the rental or ride period by the user will be the user's financial responsibility.</li>
              <li>Users must carry valid identification during travel. For vehicle rentals, a valid driver's license is strictly required.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Payment and Cancellation</h2>
            <p>
              Payments can be made via cash, UPI, or other supported digital methods. In the event of a cancellation by the user, cancellation fees may apply depending on how close to the scheduled pickup time the cancellation occurs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Changes to Terms</h2>
            <p>
              Udan Cabs reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting to this website. Your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
