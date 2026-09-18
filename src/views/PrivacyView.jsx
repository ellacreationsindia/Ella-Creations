import React from 'react';
import { Lock, ShieldCheck, Eye, Database, Bell, ArrowLeft, CheckCircle2, Server, Cookie, UserCheck, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function PrivacyView() {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-stone-800">
      <SEOHead
        title="Privacy Policy | Ella Creations India"
        description="Comprehensive Privacy Policy for Ella Creations India. Details our rigorous compliance with the Digital Personal Data Protection (DPDP) Act, 2023, cookie policy, and secure data sharing protocols with logistics and payment processors."
      />

      {/* Header */}
      <div className="border-b border-brand-gold/30 pb-5 space-y-2.5">
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1 font-semibold transition-colors cursor-pointer mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Data Protection & Privacy Compliance</span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">Privacy Policy</h1>
        <p className="text-xs text-stone-500 font-mono">
          Last Updated: August 2026 • Compliant with the Digital Personal Data Protection (DPDP) Act, 2023 & Information Technology Act, 2000
        </p>
      </div>

      {/* Content Body */}
      <div className="bg-white p-5 sm:p-10 rounded-3xl border border-brand-gold/20 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1: Introduction & Legal Basis */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Lock className="w-4 h-4 text-brand-rose" /> 1. Commitment to Personal Data Protection
          </h2>
          <p className="text-stone-700">
            <strong>Ella Creations</strong> ("we", "us", or "our", operating through <a href="https://ella-creations.com" className="text-brand-rose font-medium underline">ella-creations.com</a>) recognizes the paramount importance of safeguarding the personal data of our esteemed patrons. This Privacy Policy sets forth our practices regarding the collection, processing, storage, sharing, and protection of your personal information in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA 2023)</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
          </p>
          <p className="text-stone-700">
            By visiting our website, creating an account, registering for the VIP Sparkle Club, or purchasing jewelry from us, you acknowledge that you have read and consented to the data practices described herein.
          </p>
        </section>

        {/* Section 2: Categories of Data Collected */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Database className="w-4 h-4 text-brand-gold" /> 2. Personal Data We Collect
          </h2>
          <p className="text-stone-700">
            We collect only the minimum necessary personal data required to fulfill our contractual and statutory e-commerce obligations:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            <div className="bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/20 space-y-1.5">
              <span className="font-bold text-stone-900 text-xs block">A. Identity & Contact Information:</span>
              <p className="text-xs text-stone-600">
                Full legal name, billing address, physical shipping address (including state, city, and 6-digit postal PIN code), contact telephone/mobile number, and email address.
              </p>
            </div>
            <div className="bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/20 space-y-1.5">
              <span className="font-bold text-stone-900 text-xs block">B. Transaction & Order Details:</span>
              <p className="text-xs text-stone-600">
                Items ordered, selected finishes (e.g. Gold Polish, Rose Gold), order quantities, invoice records, payment transaction identifiers, and order status histories.
              </p>
            </div>
            <div className="bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/20 space-y-1.5">
              <span className="font-bold text-stone-900 text-xs block">C. Technical & Device Metadata:</span>
              <p className="text-xs text-stone-600">
                Internet Protocol (IP) address, operating system, browser type and version, time zone setting, screen resolution, and session identifiers.
              </p>
            </div>
            <div className="bg-brand-cream/40 p-4 rounded-2xl border border-brand-gold/20 space-y-1.5">
              <span className="font-bold text-stone-900 text-xs block">D. Customer Reviews & Preferences:</span>
              <p className="text-xs text-stone-600">
                Verified customer reviews, jewelry star ratings, product photographs voluntarily uploaded, wishlist selections, and VIP Sparkle Club promotional coupon redemptions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cookies & Local Storage */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Cookie className="w-4 h-4 text-brand-rose" /> 3. Cookies & Browser Storage Technologies
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              We utilize cookies and HTML5 browser Local Storage to ensure seamless navigation, preserve your active shopping bag items across sessions, and provide personalized jewelry suggestions.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Strictly Essential Cookies & Storage:</strong> Necessary for core site functionality, including authentication states, shopping bag persistence, and active discount application.
              </li>
              <li>
                <strong>Performance & Experience Cookies:</strong> Help us remember your recently viewed jewelry pieces and preferred catalog sorting order without requiring re-entry.
              </li>
              <li>
                <strong>Cookie Management:</strong> You may adjust your browser settings to decline or clear cookies at any time; however, disabling essential cookies may impact your ability to checkout or manage your shopping bag.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Data Sharing with Logistics & Payment Processors */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Server className="w-4 h-4 text-brand-gold" /> 4. Third-Party Data Sharing (Payment Gateways & Couriers)
          </h2>
          <p className="text-stone-700">
            <strong>Ella Creations does NOT sell, rent, lease, or monetize your personal information to third-party marketing brokers.</strong> We share specific subsets of your personal data strictly with authorized, vetted operational partners under stringent contractual confidentiality:
          </p>
          <div className="space-y-3 pt-1">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs">A. Payment Processors (Razorpay Software Pvt. Ltd.)</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PCI-DSS Level 1</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                When you make an online payment, your transaction is processed directly through <strong>Razorpay</strong>, an RBI-regulated payment aggregator. Ella Creations <strong>never captures, stores, or sees your credit/debit card numbers, CVV codes, bank login credentials, or UPI MPINs</strong>. All transactions are protected via 256-bit SSL encryption.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-xs">B. Logistics & Fulfillment Providers (Shiprocket & Courier Partners)</span>
                <span className="text-[10px] font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded">Fulfillment Only</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                To effectuate doorstep delivery, your recipient name, physical shipping address, postal PIN code, and contact mobile number are shared with logistics aggregator <strong>Shiprocket (BigFoot Retail Solutions Pvt. Ltd.)</strong> and carrier partners (e.g. Bluedart, Delhivery, DTDC, or Smartr Logistics) solely for printing shipping waybills, dispatching packages, and transmitting real-time SMS/WhatsApp delivery updates.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-900 text-xs block">C. Statutory Compliance & Legal Disclosure:</span>
              <p className="text-xs text-stone-600 leading-relaxed">
                We may disclose personal data if required to do so by applicable Indian law, court subpoena, or bona fide governmental request for the investigation of financial fraud, anti-money laundering compliance, or prevention of cybersecurity breaches.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Data Principal Rights under DPDP Act 2023 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <UserCheck className="w-4 h-4 text-emerald-600" /> 5. Your Rights as a Data Principal (DPDPA 2023)
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              Under the Digital Personal Data Protection Act, 2023, you enjoy statutory rights regarding your personal information held by us:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Right to Access:</strong> You may request a summary of the personal data being processed by us and identities of third parties with whom it has been shared.</li>
              <li><strong>Right to Correction & Erasure:</strong> You may request correction of inaccurate or misleading personal data, updating of incomplete data, or erasure of personal data that is no longer necessary for the purpose it was collected.</li>
              <li><strong>Right to Withdraw Consent:</strong> You may withdraw consent previously granted for promotional communications or account data retention at any time.</li>
              <li><strong>Right to Nominate:</strong> You have the right to nominate another individual who shall, in the event of death or incapacity, exercise your data rights.</li>
            </ul>
          </div>
        </section>

        {/* Section 6: Grievance Redressal Officer */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-brand-rose" /> 6. Grievance Redressal Officer (IT Rules & DPDPA)
          </h2>
          <div className="bg-brand-cream/60 p-5 rounded-2xl border border-brand-gold/30 space-y-2 text-stone-800">
            <p className="text-xs leading-relaxed">
              In accordance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 12 of the DPDPA 2023, our designated Grievance Officer details are:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="font-bold block text-stone-900">Designated Grievance Officer:</span>
                <span className="text-stone-700">Data Compliance & Grievance Desk</span>
              </div>
              <div>
                <span className="font-bold block text-stone-900">Official Compliance Email:</span>
                <a href="mailto:ellacreationsindia@gmail.com" className="text-brand-rose underline font-semibold">ellacreationsindia@gmail.com</a>
              </div>
              <div>
                <span className="font-bold block text-stone-900">Registered Office:</span>
                <span className="text-stone-700">Ella Creations India, Mumbai, Maharashtra, PIN: 400001</span>
              </div>
              <div>
                <span className="font-bold block text-stone-900">Statutory Resolution Timeline:</span>
                <span className="text-stone-700">Acknowledgment within 48 hours • Resolution within 30 days</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Trust Seal Banner */}
      <div className="bg-emerald-950 text-emerald-100 p-6 rounded-3xl border border-emerald-800 flex items-center gap-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        <div className="text-xs">
          <span className="font-serif font-bold text-sm text-white block">100% Data Confidentiality Guarantee</span>
          <p className="text-emerald-300">Ella Creations maintains banking-grade data security protocols and never sells, barters, or commercializes your personal details.</p>
        </div>
      </div>
    </div>
  );
}
