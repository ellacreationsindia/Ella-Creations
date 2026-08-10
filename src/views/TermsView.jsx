import React from 'react';
import { ShieldCheck, Scale, FileText, Truck, RotateCcw, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function TermsView() {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-stone-800">
      <SEOHead
        title="Terms & Conditions | Ella Creations India"
        description="Official Terms of Service & Store Guidelines for purchasing handcrafted artificial, Kundan, and CZ jewelry from Ella Creations India."
      />

      {/* Header */}
      <div className="border-b border-brand-gold/30 pb-6 space-y-3">
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1 font-semibold transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Legal Agreement</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">Terms & Conditions of Service</h1>
        <p className="text-xs text-stone-500 font-mono">Last Updated: August 10, 2026 • Effective for all orders placed within India & Internationally</p>
      </div>

      {/* Content Sections */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-gold/20 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-rose" /> 1. Overview & Acceptable Use
          </h2>
          <p>
            Welcome to <strong>Ella Creations</strong> ("we", "us", or "our"). These Terms & Conditions govern your access to and use of our web platform, mobile interface, and purchasing services for artificial, semi-precious, Kundan, and Cubic Zirconia (CZ) jewelry.
          </p>
          <p>
            By accessing our store, registering an account, or completing an order, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please refrain from using our services.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-gold" /> 2. Jewelry Product Specifications & Handcrafted Variations
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-stone-700">
            <li>
              <strong>Artificial & Imitation Nature:</strong> All items listed under Ella Creations are fashion and artificial jewelry electroplated in 22K/18K Yellow Gold, Rose Gold, or Rhodium over high-grade brass/copper alloys unless explicitly stated otherwise.
            </li>
            <li>
              <strong>Gemstones & Crystals:</strong> We utilize AAA+ Cubic Zirconia, glass Polki, synthetic pearls, and lab-created gemstones. They do not carry certified diamond or natural mined gemstone appraisals.
            </li>
            <li>
              <strong>Handcrafted Nuances:</strong> Because our Kundan and Meenakari pieces are handcrafted by artisan jewelers in Jaipur and Mumbai, slight variations in enamel tint, stone placement, or weight (±5%) are natural hallmarks of authenticity.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-rose" /> 3. Pricing, GST Taxes & Payment Processing
          </h2>
          <p>
            All prices displayed on Ella Creations are in <strong>Indian Rupees (₹ INR)</strong> and include applicable Goods and Services Tax (GST Tax - standard 18%).
          </p>
          <div className="bg-brand-cream/60 p-4 rounded-2xl border border-brand-gold/30 space-y-2 text-xs">
            <span className="font-bold text-stone-900 block">Accepted Payment Channels:</span>
            <div className="flex flex-wrap gap-2 text-stone-700">
              <span className="bg-white px-2.5 py-1 rounded-lg border border-stone-200">Razorpay Online Gateway (UPI / Cards / NetBanking)</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-stone-200">Cash on Delivery (COD)</span>
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              Online payments are processed securely through PCI-DSS Level 1 compliant Razorpay infrastructure. Ella Creations never stores full credit card CVV or bank PIN details.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-gold" /> 4. Shipping, Delivery & Shiprocket Tracking
          </h2>
          <p>
            Orders are dispatched via our integrated logistics partner <strong>Shiprocket</strong> (utilizing BlueDart, Delhivery, DTDC, and Xpressbees).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
            <li><strong>Standard Shipping:</strong> 3-5 business days across major Indian metros. Complimentary on orders over ₹2,500.</li>
            <li><strong>Air Priority Express:</strong> 1-2 business days express dispatch available at checkout.</li>
            <li><strong>Tracking:</strong> An Air Waybill (AWB) tracking number and live Shiprocket link are assigned upon dispatch.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-brand-rose" /> 5. Returns, Exchanges & 1-Year Anti-Tarnish Guarantee
          </h2>
          <p>
            We take pride in our 3.5 Micron Anti-Tarnish E-Coating process. If your jewelry experiences unprompted tarnishing within 1 year of purchase (excluding damage from direct perfume spraying or harsh chemical exposure), we offer complimentary re-plating or store credit.
          </p>
          <p>
            For damaged or defective items received upon unboxing, customers must notify support within 48 hours with an unboxing video clip.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-brand-gold" /> 6. Intellectual Property & Indian Jurisdiction
          </h2>
          <p>
            All website design, brand logos, imagery, product titles, custom section formats, and code are the exclusive intellectual property of <strong>Ella Creations India</strong>.
          </p>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the Republic of India under the jurisdiction of the courts at Mumbai, Maharashtra.
          </p>
        </section>

      </div>

      {/* Footer Contact Callout */}
      <div className="bg-stone-950 text-white p-6 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base font-bold text-white">Questions Regarding Our Terms?</h3>
          <p className="text-xs text-stone-400">Reach out to our legal concierge team at ellacreationsindia@gmail.com</p>
        </div>
        <button
          onClick={() => navigateTo('contact')}
          className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors flex-shrink-0"
        >
          Contact Legal Team
        </button>
      </div>

    </div>
  );
}
