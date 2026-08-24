"use client";

import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    { question: "How do I book a cab with Udan Cabs?", answer: "You can easily book a cab through our website homepage. Simply enter your pickup and drop-off locations, select the type of vehicle, and confirm your booking." },
    { question: "Are your drivers verified?", answer: "Yes, all our drivers undergo strict background checks and are fully verified to ensure your safety and comfort." },
    { question: "Can I book a cab for outstation travel?", answer: "Absolutely! We offer outstation travel options. Please check our Tours section or select outstation booking during your ride setup." },
    { question: "Do you offer two-wheeler rentals?", answer: "Yes, we offer two-wheeler rentals. Visit the Bike Rentals section in our menu to see available vehicles and pricing." },
    { question: "How can I contact customer support?", answer: "You can reach us 24/7 via the Contact Us page, where you'll find our phone number, email address, and a direct messaging form." }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our services in Ujjain.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-border/50">
          <p className="text-muted-foreground">
            Still have questions? <Link href="/contact" className="text-primary font-semibold hover:underline">Contact our support team</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
