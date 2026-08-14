import React from 'react';
import { Lock, ShieldCheck, Eye, Database, Bell, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function PrivacyView() {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-stone-800">
      <SEOHead
        title="Privacy Policy | Ella Creations India"
        description="Learn how Ella Creations protects customer data, complies with the DPDP Act 2023, and handles secure Razorpay payments."
      />

      {/* Header */}
      <div className="border-b border-brand-gold/30 pb-6 space-y-3">
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1 font-semibold transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Data Protection & Trust</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">Privacy Policy & Data Security</h1>
        <p className="text-xs text-stone-500 font-mono">Compliant with Digital Personal Data Protection (DPDP) Act 2023 • India</p>
      </div>

      {/* Content Body */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-gold/20 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-rose" /> 1. Commitment to Data Privacy
          </h2>
          <p>
            At <strong>Ella Creations</strong>, we respect your personal privacy and are committed to maintaining the confidentiality of information provided by our jewelry patrons. This Privacy Policy outlines what information we collect, how it is stored, and your rights under Indian data laws.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-gold" /> 2. Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-brand-cream/50 p-3.5 rounded-2xl border border-brand-gold/20 space-y-1">
              <span className="font-bold text-stone-900 block">Personal Identity Data:</span>
              <p className="text-stone-600">Full Name, Email Address, Mobile Phone (+91), Shipping & Billing Addresses.</p>
            </div>
            <div className="bg-brand-cream/50 p-3.5 rounded-2xl border border-brand-gold/20 space-y-1">
              <span className="font-bold text-stone-900 block">Transaction & Order Details:</span>
              <p className="text-stone-600">Items purchased, selected variants, invoice history, payment IDs.</p>
            </div>
            <div className="bg-brand-cream/50 p-3.5 rounded-2xl border border-brand-gold/20 space-y-1">
              <span className="font-bold text-stone-900 block">VIP Sparkle Club Data:</span>
              <p className="text-stone-600">Newsletter subscription preferences, coupon usages, review submissions.</p>
            </div>
            <div className="bg-brand-cream/50 p-3.5 rounded-2xl border border-brand-gold/20 space-y-1">
              <span className="font-bold text-stone-900 block">Technical Cookies:</span>
              <p className="text-stone-600">IP address, browser session identifiers, local storage cart states.</p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-rose" /> 3. Payment Processing & Razorpay Security
          </h2>
          <p>
            We do <strong>NOT</strong> collect, store, or process raw banking credentials, debit card numbers, credit card CVV codes, or UPI MPIN numbers on our servers.
          </p>
          <p>
            All online transactions are processed through <strong>Razorpay Software Private Limited</strong>, which is certified PCI-DSS Level 1 compliant. Your session with Razorpay uses 256-bit SSL encryption.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-gold" /> 4. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
            <li>Processing orders, dispatching via Shiprocket, and sending SMS/WhatsApp delivery updates.</li>
            <li>Enforcing verified buyer review restrictions to ensure authentic feedback.</li>
            <li>Delivering VIP Sparkle Club drops, secret sale announcements, and promotional discount codes.</li>
            <li>Preventing fraudulent orders and maintaining platform security.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-rose" /> 5. Data Retention & Customer Rights
          </h2>
          <p>
            Under the Digital Personal Data Protection (DPDP) Act 2023, you have the right to request access to your personal data, update inaccuracies, or request account/data erasure.
          </p>
          <p>
            To request data erasure or unsubscribe from VIP Sparkle Club emails, contact our Data Officer at <strong>ellacreationsindia@gmail.com</strong>.
          </p>
        </section>

      </div>

      {/* Footer Assurance Banner */}
      <div className="bg-emerald-950 text-emerald-100 p-6 rounded-3xl border border-emerald-800 flex items-center gap-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        <div className="text-xs">
          <span className="font-serif font-bold text-sm text-white block">100% Data Confidentiality Guarantee</span>
          <p className="text-emerald-300">Ella Creations never sells, rents, or shares your contact information with third-party advertising networks.</p>
        </div>
      </div>

    </div>
  );
}
