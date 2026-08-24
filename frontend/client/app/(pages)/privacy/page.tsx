"use client";

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Privacy <span className="text-primary">Policy</span></h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
            <p>
              At Udan Cabs, your privacy is paramount. We collect personal information that you provide to us when creating an account, making a booking, or contacting customer support. This may include your name, email address, phone number, pickup/drop-off locations, and payment details.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
            <p>
              The information we collect is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your bookings and rentals.</li>
              <li>Communicate with you regarding your rides (e.g., driver details, delays).</li>
              <li>Improve our services, website, and customer experience.</li>
              <li>Ensure the safety and security of our drivers and passengers.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Data Sharing and Security</h2>
            <p>
              We do not sell your personal information to third parties. We may share necessary details (such as your phone number and pickup location) with our verified drivers to facilitate your ride. We employ industry-standard security measures to protect your data from unauthorized access or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Cookies</h2>
            <p>
              Our website may use cookies to enhance your browsing experience, remember your preferences, and track website usage analytics. You can adjust your browser settings to refuse cookies, though this may limit some functionalities of our site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how we handle your data, please reach out to our support team via the Contact Us page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
