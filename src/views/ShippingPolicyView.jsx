import React from 'react';
import { 
  Truck, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  PackageCheck, 
  AlertCircle, 
  ArrowLeft, 
  Gift, 
  Mail, 
  Sparkles,
  CheckCircle2,
  Phone,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useStore, formatPrice } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function ShippingPolicyView() {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-stone-800">
      <SEOHead
        title="Shipping & Delivery Policy | Ella Creations India"
        description="Comprehensive Shipping & Delivery Policy for Ella Creations India. Free insured delivery on orders over ₹999 across 19,000+ Indian pincodes, 24-48h dispatch, and tamper-evident packaging."
      />

      {/* Header Banner */}
      <div className="border-b border-brand-gold/30 pb-6 space-y-3">
        <a
          href="/"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            navigateTo('home');
          }}
          className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1.5 font-semibold transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </a>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-brand-gold">
              Logistics & Pan-India Fulfillment
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
              Shipping & Delivery Policy
            </h1>
          </div>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pan-India Insured Transit
          </span>
        </div>
        <p className="text-xs text-stone-500 font-mono">
          Last Updated: 2026 • Governed under Consumer Protection (E-Commerce) Rules, 2020
        </p>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Policy Content (8 Columns) */}
        <div className="lg:col-span-8 space-y-6 text-xs sm:text-sm leading-relaxed">
          
          {/* Logistics Partners Banner */}
          <div className="p-5 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl border border-brand-gold/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-rose/20 text-brand-rose flex items-center justify-center shrink-0 border border-brand-rose/30">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="font-serif font-bold text-base text-brand-cream block">
                  Express Insured Logistics Handshake
                </span>
                <p className="text-xs text-stone-300">
                  Handled via Shiprocket with tier-1 air couriers: Bluedart, Delhivery, DTDC, and Smartr Logistics.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full border border-white/20 inline-block">
                100% Insured Transit
              </span>
            </div>
          </div>

          {/* Section 1: Order Processing & Dispatch Timelines */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-xs space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Clock className="w-5 h-5 text-brand-rose" /> 1. Order Processing & Dispatch Timelines
            </h2>
            <div className="space-y-3 text-stone-700">
              <p>
                Every order placed on <strong>ella-creations.com</strong> is individually inspected by our jewelry artisans, cleaned with specialized microfiber jewelry wipes, and packed into protective foam and velvet gift casings.
              </p>
              <ul className="list-disc pl-5 space-y-2">
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
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-xs space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="w-5 h-5 text-brand-gold" /> 2. Domestic Delivery Procedures & Timeframes
            </h2>
            <p className="text-stone-700">
              We deliver to over 19,000+ PIN codes across all Indian states and Union Territories:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div className="p-4 bg-brand-cream/60 rounded-2xl border border-brand-gold/25 space-y-1.5">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">Metro Hubs (Tier 1)</span>
                <span className="text-xs text-brand-rose font-bold block">2 to 4 Business Days</span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad.
                </p>
              </div>
              <div className="p-4 bg-brand-cream/60 rounded-2xl border border-brand-gold/25 space-y-1.5">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">Tier 2 & Tier 3 Cities</span>
                <span className="text-xs text-brand-rose font-bold block">4 to 6 Business Days</span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  State capitals, industrial clusters, and major district headquarters across India.
                </p>
              </div>
              <div className="p-4 bg-brand-cream/60 rounded-2xl border border-brand-gold/25 space-y-1.5">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">Remote & Special Zones</span>
                <span className="text-xs text-brand-rose font-bold block">5 to 8 Business Days</span>
                <p className="text-[11px] text-stone-600 leading-snug">
                  North-Eastern States, Jammu & Kashmir, Ladakh, Andaman & Nicobar, and Lakshadweep.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 mt-4 space-y-2">
              <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider">
                Transparent Shipping Fee Structure:
              </span>
              <ul className="space-y-1.5 text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free Standard Insured Shipping:</strong> Applicable automatically on all prepaid and COD orders exceeding ₹999 across India.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span><strong>Standard Ground Shipping (Orders &lt; ₹999):</strong> Flat nominal logistics fee of ₹99.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span><strong>Air Priority Express (Optional):</strong> Expedited air dispatch available for guaranteed priority cargo routing.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Safe Delivery & Tamper-Evident Protocol */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-xs space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 3. Safe Delivery Verification & Packaging Standards
            </h2>
            <div className="space-y-3 text-stone-700">
              <p>
                To protect valuable jewelry items from pilferage, dust, and transit shock during transit:
              </p>
              <ul className="list-disc pl-5 space-y-2">
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
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-xs space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <PackageCheck className="w-5 h-5 text-brand-rose" /> 4. Bulk Shipping & Bridal Troupe Considerations
            </h2>
            <div className="space-y-3 text-stone-700">
              <p>
                For large celebrations, bridal troupes, bridesmaids' gift sets, or corporate festive gifting orders (orders exceeding 5 pieces or ₹25,000):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Production Lead Time:</strong> Handcrafted bulk collections may require <strong>7 to 14 business days</strong> for artisanal setting, electroplating quality checks, and personalized gift tags.
                </li>
                <li>
                  <strong>Dedicated Dispatch Coordinator:</strong> A single point of contact from our bridal concierge team will coordinate dispatch schedules, staggered delivery dates, and direct logistics status updates.
                </li>
                <li>
                  <strong>Commercial Transit Insurance:</strong> High-volume bridal shipments travel under dedicated declared-value commercial transit insurance coverage.
                </li>
                <li>
                  <strong>International Shipping:</strong> For destination weddings outside India, please contact our concierge team for custom DHL/FedEx international air freight quotes.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Failed Delivery Attempts & Non-Availability */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/20 shadow-xs space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <AlertCircle className="w-5 h-5 text-stone-600" /> 5. Non-Availability & Return to Origin (RTO)
            </h2>
            <div className="space-y-3 text-stone-700">
              <ul className="list-disc pl-5 space-y-2">
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

        {/* Sidebar Summary & Quick Help (4 Columns, Sticky on Desktop) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Quick Glace Logistics Summary Card */}
          <div className="bg-brand-cream/70 rounded-3xl p-6 border border-brand-gold/30 shadow-xs space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">
              Logistics at a Glance
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Key Shipping Rules
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-brand-gold/20 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Free Shipping on ₹999+</span>
                  <span className="text-stone-500">Orders under ₹999 ship for flat ₹99.</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-brand-gold/20 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-rose shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">24–48 Hour Dispatch</span>
                  <span className="text-stone-500">Mon–Sat dispatch with SMS tracking.</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-brand-gold/20 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">100% Transit Insured</span>
                  <span className="text-stone-500">Full damage and loss protection.</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-brand-gold/20 flex items-start gap-2.5">
                <Gift className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Velvet Gift Packaging</span>
                  <span className="text-stone-500">Arrives in signature keepsake box.</span>
                </div>
              </div>
            </div>

            <a
              href="/shop"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                navigateTo('shop');
              }}
              className="w-full bg-brand-rose hover:bg-brand-rose/90 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-soft-rose transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Shop Jewelry Catalog &rarr;
            </a>
          </div>

          {/* Related Policy Links */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-rose" /> Related Customer Policies
            </h4>
            <div className="space-y-2">
              <a
                href="/refund-policy"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  navigateTo('refund-policy');
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-cream/60 text-stone-700 hover:text-brand-rose transition-colors"
              >
                <span>Refund & Damage Replacement</span>
                <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              </a>
              <a
                href="/terms"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  navigateTo('terms');
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-cream/60 text-stone-700 hover:text-brand-rose transition-colors"
              >
                <span>Terms of Service</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-stone-400" />
              </a>
              <a
                href="/brand-guidelines"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  navigateTo('brand-guidelines');
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-cream/60 text-stone-700 hover:text-brand-rose transition-colors"
              >
                <span>Jewelry Care & Metallurgy</span>
                <Sparkles className="w-3.5 h-3.5 text-stone-400" />
              </a>
            </div>
          </div>

          {/* Customer Dispatch Desk Contact Box */}
          <div className="bg-stone-950 text-white p-6 rounded-3xl border border-stone-800 space-y-3">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-white text-sm">Need Tracking Assistance?</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Our logistics dispatch desk is available Monday through Saturday (10:00 AM – 7:00 PM IST).
              </p>
            </div>
            <a
              href="mailto:ellacreationsindia@gmail.com"
              className="w-full bg-stone-800 hover:bg-stone-700 text-brand-cream font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-brand-rose" /> ellacreationsindia@gmail.com
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
