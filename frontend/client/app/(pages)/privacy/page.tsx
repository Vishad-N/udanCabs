"use client";

import React from 'react';
import { ShieldCheck, MessageCircle, Database, Lock, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Privacy <span className="text-primary">Policy</span></h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Database size={24} className="text-primary"/> 1. Information We Collect</h2>
            <p>
              At Udan Cabs, your privacy is paramount. We collect personal information that you provide to us when creating an account, making a booking, or contacting customer support. This may include your name, email address, phone number, pickup/drop-off locations, and payment details.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><EyeOff size={24} className="text-primary"/> 2. How We Use Your Information</h2>
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

          <section className="space-y-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><MessageCircle size={24} className="text-primary"/> 3. WhatsApp Messaging & Meta Policies</h2>
            <p>
              To provide you with seamless updates about your bookings (such as driver assignments and trip status), we utilize the WhatsApp Business Platform provided by Meta.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Explicit Consent:</strong> We only send WhatsApp messages to users who have explicitly opted-in during the booking process or account creation.</li>
              <li><strong>Data Sharing with Meta:</strong> When you opt-in to WhatsApp updates, your phone number and the content of the notification messages are processed by Meta Platforms, Inc., strictly for the purpose of delivering these messages to you.</li>
              <li><strong>Opting Out:</strong> You can revoke your consent and stop receiving WhatsApp notifications at any time by replying "STOP" to our WhatsApp business number or by contacting our support team.</li>
              <li><strong>No Marketing Spam:</strong> We strictly adhere to Meta's commerce and messaging policies. We will not send you unsolicited marketing or promotional messages via WhatsApp without your separate, explicit consent.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><ShieldCheck size={24} className="text-primary"/> 4. Data Sharing and Security</h2>
            <p>
              We do not sell your personal information to third parties. We may share necessary details (such as your phone number and pickup location) with our verified drivers to facilitate your ride. We employ industry-standard security measures to protect your data from unauthorized access or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Lock size={24} className="text-primary"/> 5. Data Retention & User Rights</h2>
            <p>
              We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights or request complete data deletion, please contact our support team.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Cookies</h2>
            <p>
              Our website may use cookies to enhance your browsing experience, remember your preferences, and track website usage analytics. You can adjust your browser settings to refuse cookies, though this may limit some functionalities of our site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">7. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, our data practices, or our WhatsApp integration, please reach out to our support team via our Contact Us page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
