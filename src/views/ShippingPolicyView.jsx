import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, PackageCheck, AlertCircle, ArrowLeft, Gift, Mail, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function ShippingPolicyView() {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-stone-800">
      <SEOHead
        title="Shipping & Delivery Policy | Ella Creations India"
        description="Comprehensive Shipping and Delivery Policy for Ella Creations India. Details on dispatch timelines, domestic pan-India delivery procedures, bulk bridal orders, and tamper-evident packaging."
      />

      {/* Header */}
      <div className="border-b border-brand-gold/30 pb-5 space-y-2.5">
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1 font-semibold transition-colors cursor-pointer mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Logistics & Pan-India Fulfillment</span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">Shipping & Delivery Policy</h1>
        <p className="text-xs text-stone-500 font-mono">Compliant with Indian Consumer Protection (E-Commerce) Rules, 2020 • Pan-India Operations</p>
      </div>

      {/* Policy Card Body */}
      <div className="bg-white p-5 sm:p-10 rounded-3xl border border-brand-gold/20 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Logistics Partners Banner */}
        <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-2xl border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-rose/20 text-brand-rose flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm text-brand-cream block">Pan-India Insured Logistics Handshake</span>
              <p className="text-[11px] text-stone-300">Handled via Shiprocket with premier couriers (Bluedart, Delhivery, DTDC & Smartr Logistics).</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20 shrink-0">
            100% Insured Transit
          </span>
        </div>

        {/* Section 1: Dispatch Timelines */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Clock className="w-4 h-4 text-brand-rose" /> 1. Order Processing & Dispatch Timelines
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              Every order placed on <strong>ella-creations.com</strong> is individually inspected by our jewelry artisans, cleaned with specialized microfiber jewelry wipes, and packed into protective foam and velvet gift casings.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Ready-to-Ship Pieces:</strong> Dispatched within <strong>24 to 48 business hours</strong> following payment confirmation (or COD phone verification).
              </li>
              <li>
                <strong>Dispatch Schedule:</strong> Dispatches occur Monday through Saturday (excluding national holidays and Sundays). Orders placed on Saturday afternoon or Sunday are scheduled for Monday dispatch.
              </li>
              <li>
                <strong>Live Tracking Activation:</strong> Once dispatched, an automated confirmation with live tracking Air Waybill (AWB) link is transmitted via SMS, WhatsApp, and email.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Domestic Delivery Timelines & Charges */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <MapPin className="w-4 h-4 text-brand-gold" /> 2. Domestic Delivery Procedures & Timeframes
          </h2>
          <p className="text-stone-700">
            We deliver to over 19,000+ PIN codes across all Indian states and Union Territories:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 bg-brand-cream/50 rounded-2xl border border-brand-gold/20 space-y-1">
              <span className="font-bold text-stone-900 text-xs block">Metro Hubs (Tier 1)</span>
              <span className="text-[11px] text-brand-rose font-bold block">2 to 4 Business Days</span>
              <p className="text-[11px] text-stone-500">Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad.</p>
            </div>
            <div className="p-3.5 bg-brand-cream/50 rounded-2xl border border-brand-gold/20 space-y-1">
              <span className="font-bold text-stone-900 text-xs block">Tier 2 & Tier 3 Cities</span>
              <span className="text-[11px] text-brand-rose font-bold block">4 to 6 Business Days</span>
              <p className="text-[11px] text-stone-500">State capitals, industrial clusters, and major district headquarters across India.</p>
            </div>
            <div className="p-3.5 bg-brand-cream/50 rounded-2xl border border-brand-gold/20 space-y-1">
              <span className="font-bold text-stone-900 text-xs block">Remote & Special Zones</span>
              <span className="text-[11px] text-brand-rose font-bold block">5 to 8 Business Days</span>
              <p className="text-[11px] text-stone-500">North-Eastern States, Jammu & Kashmir, Ladakh, Andaman & Nicobar, and Lakshadweep.</p>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mt-3 space-y-1.5 text-xs text-stone-700">
            <span className="font-bold text-stone-900 block uppercase tracking-wider">Shipping Rates Structure:</span>
            <p>• <strong>Free Standard Insured Shipping:</strong> Applicable on all prepaid and COD orders exceeding ₹999 across India.</p>
            <p>• <strong>Standard Ground Shipping (Orders &lt; ₹999):</strong> Flat nominal logistics fee of ₹99.</p>
            <p>• <strong>Air Priority Express (Optional):</strong> Expedited air dispatch available at ₹199 for guaranteed priority cargo routing.</p>
          </div>
        </section>

        {/* Section 3: Safe Delivery & Tamper-Evident Protocol */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 3. Safe Delivery Verification & Packaging Standards
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              To protect valuable jewelry items from pilferage, dust, and transit shock:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Triple Layer Security Packaging:</strong> Every piece is placed in an airtight protective film, secured inside a velvet jewelry gift box, and sealed in an authorized Ella Creations <strong>tamper-evident courier pouch with unique sequential serial numbers</strong>.
              </li>
              <li>
                <strong>Inspection at Handover:</strong> Customers are advised to <strong>refuse delivery</strong> if the outer courier bag appears torn, cut, taped over with non-branded tape, or visibly tampered with.
              </li>
              <li>
                <strong>OTP / Signature Verification:</strong> In high-value shipments, an encrypted One-Time Password (OTP) sent to your mobile phone must be shared with the delivery personnel to confirm physical handover.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Bulk Orders & Bridal Party Considerations */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <PackageCheck className="w-4 h-4 text-brand-rose" /> 4. Bulk Shipping & Bridal Troupe Considerations
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              For large celebrations, bridal troupes, bridesmaids' gift sets, or corporate festive gifting orders (orders exceeding 5 pieces or ₹25,000):
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Extended Production Lead Time:</strong> Handcrafted bulk collections may require <strong>7 to 14 business days</strong> for artisanal setting, electroplating quality checks, and personalized gift tags.
              </li>
              <li>
                <strong>Dedicated Dispatch Coordinator:</strong> A single point of contact from our bridal concierge team will coordinate dispatch schedules, staggered delivery dates, and direct logistics status updates.
              </li>
              <li>
                <strong>Special Cargo Insurance:</strong> High-volume bridal shipments travel under dedicated declared-value commercial transit insurance coverage.
              </li>
              <li>
                <strong>International Shipping:</strong> For non-resident Indian (NRI) bridal destination weddings outside India, please contact our concierge team for custom DHL/FedEx international air freight quotes.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5: Failed Delivery Attempts & Non-Availability */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <AlertCircle className="w-4 h-4 text-stone-600" /> 5. Non-Availability & Return to Origin (RTO)
          </h2>
          <div className="space-y-2 text-stone-700">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Our courier partners make up to <strong>three (3) delivery attempts</strong> and send SMS/call notifications prior to delivery.
              </li>
              <li>
                If delivery fails due to an incorrect address, phone unreachable, or refusal to accept without valid justification, the shipment will be marked Return to Origin (RTO).
              </li>
              <li>
                Re-dispatch of RTO shipments will incur a standard re-shipping fee of ₹150 to cover reverse and forward courier charges.
              </li>
            </ul>
          </div>
        </section>

      </div>

      {/* Customer Tracking Help Box */}
      <div className="bg-stone-950 text-white p-6 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif text-base font-bold text-white">Need Real-Time Tracking Assistance?</h3>
          <p className="text-xs text-stone-400">Our dispatch desk is available Monday to Saturday (10:00 AM – 7:00 PM IST).</p>
        </div>
        <a
          href="mailto:ellacreationsindia@gmail.com"
          className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
        >
          <Mail className="w-4 h-4" /> Contact Dispatch Desk
        </a>
      </div>
    </div>
  );
}
