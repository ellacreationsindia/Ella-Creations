import React from 'react';
import { ShieldCheck, Scale, FileText, Truck, RotateCcw, AlertCircle, ArrowLeft, CheckCircle2, Award, Mail, Building } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function TermsView() {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-stone-800">
      <SEOHead
        title="Terms & Conditions of Service | Ella Creations India"
        description="Official Terms of Service and Commercial User Agreement for Ella Creations India. Strict compliance with Indian Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act, 2000."
      />

      {/* Header */}
      <div className="border-b border-brand-gold/30 pb-5 space-y-2.5">
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1 font-semibold transition-colors cursor-pointer mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">Legal & Commercial Agreement</span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">Terms & Conditions of Service</h1>
        <p className="text-xs text-stone-500 font-mono">
          Last Updated: August 2026 • Governed by the Laws of the Republic of India • Applicable to all transactions on ella-creations.com
        </p>
      </div>

      {/* Policy Card Body */}
      <div className="bg-white p-5 sm:p-10 rounded-3xl border border-brand-gold/20 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1: Overview & Acceptance */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Scale className="w-4 h-4 text-brand-rose" /> 1. Overview & Acceptance of Terms
          </h2>
          <p className="text-stone-700">
            This electronic document is published in accordance with the provisions of Rule 3(1) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
          </p>
          <p className="text-stone-700">
            The platform <strong>ella-creations.com</strong> (including related mobile interfaces and application services) is owned and operated by <strong>Ella Creations India</strong> ("Ella Creations", "we", "us", or "our"). By accessing, browsing, creating an account, or placing an order on this platform, you agree to be bound unconditionally by these Terms and Conditions ("Terms") along with our Privacy Policy, Refund Policy, and Shipping Policy.
          </p>
        </section>

        {/* Section 2: Artificial Jewelry Nature & Product Specifications */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Award className="w-4 h-4 text-brand-gold" /> 2. Jewelry Classification & Handcrafted Characteristics
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              In compliance with fair commercial disclosures, we explicitly state the nature and construction of our jewelry:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Artificial & Fashion Jewelry Classification:</strong> All jewelry pieces offered on Ella Creations are imitation, costume, and artificial fashion jewelry. They are electroplated in yellow gold, rose gold, antique gold, or rhodium finishes over high-grade brass or copper alloys. They are <strong>not made of solid hallmarked 22K/24K gold, solid silver, or mined platinum</strong> unless explicitly specified in writing.
              </li>
              <li>
                <strong>Crystals & Gemstones:</strong> We utilize AAA+ Cubic Zirconia (CZ), lab-simulated crystals, glass Polki, and cultured/synthetic pearls. They do not carry certified mined diamond or precious natural stone appraisals.
              </li>
              <li>
                <strong>Artisanal Nuances:</strong> Our Kundan, Meenakari, and bridal sets are handcrafted by traditional artisans. Minor variations in stone placement, enamel shading, weight (±5%), or polish tone are natural attributes of authentic artisanal craftsmanship and do not constitute manufacturing defects.
              </li>
              <li>
                <strong>Jewelry Care & Longevity:</strong> Plated jewelry requires care. Direct contact with water, perfumes, sweat, sanitizers, or chlorine will accelerate plating degradation. Customers are expected to adhere to our published Jewelry Care Guidelines.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Pricing, Taxes & Payment Gateways */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <FileText className="w-4 h-4 text-brand-rose" /> 3. Pricing, Invoicing & Payment Security
          </h2>
          <div className="space-y-2 text-stone-700">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Currency & Taxes:</strong> All prices displayed on our platform are denominated in <strong>Indian Rupees (₹ INR)</strong> and include all applicable Goods and Services Tax (GST) under Indian statutory law.
              </li>
              <li>
                <strong>Payment Channels:</strong> We accept online payments through Razorpay Software Pvt. Ltd. (supporting UPI, Credit Cards, Debit Cards, Net Banking, and authorized Wallets) and Cash on Delivery (COD) for eligible pincodes.
              </li>
              <li>
                <strong>Payment Security:</strong> Online transactions are routed via PCI-DSS Level 1 compliant architecture with 256-bit SSL encryption. Ella Creations never stores full credit card CVV codes or confidential banking passwords.
              </li>
              <li>
                <strong>Promotional Campaigns & Coupons:</strong> Promotional discounts and coupon codes are non-transferable, cannot be redeemed for cash, and are subject to the specific validity terms defined in the promotional banner or campaign announcement.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Shipping, Delivery & Inspection */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Truck className="w-4 h-4 text-brand-gold" /> 4. Shipping, Transit Risk & Delivery Handover
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              Deliveries are operated across India in partnership with reputable courier networks via Shiprocket. Detailed shipping terms are governed by our standalone <button onClick={() => navigateTo('shipping-policy')} className="text-brand-rose underline font-semibold cursor-pointer">Shipping & Delivery Policy</button>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Dispatch:</strong> Standard orders dispatch within 24 to 48 business hours. Delivery typically takes 2 to 6 business days depending on geographical destination.
              </li>
              <li>
                <strong>Tamper-Evident Packaging:</strong> Packages are sealed with serialized tamper-evident tape. Customers must inspect the exterior pouch before accepting delivery and refuse receipt if the seal is broken or tampered with.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5: Cancellations, Replacements & Returns */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <RotateCcw className="w-4 h-4 text-stone-600" /> 5. Cancellation, Replacement & Hygiene Standards
          </h2>
          <div className="space-y-2 text-stone-700">
            <p>
              Please refer to our standalone <button onClick={() => navigateTo('refund-policy')} className="text-brand-rose underline font-semibold cursor-pointer">Refund & Cancellation Policy</button> for full terms.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Final Sale Policy (Hygiene Standard):</strong> Due to the intimate, skin-contact nature of fashion jewelry, all delivered and opened products are strictly non-returnable and non-exchangeable for change of mind.
              </li>
              <li>
                <strong>Transit Defect Protection (48-Hour Reporting):</strong> In the rare event of transit breakage or manufacturing defect, customers must report the issue within <strong>48 hours of physical delivery</strong> accompanied by an unedited continuous unboxing video. Approved claims receive free replacement or full refund.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 6: Intellectual Property Rights */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-brand-rose" /> 6. Intellectual Property & Trademark Protection
          </h2>
          <p className="text-stone-700">
            The brand name "Ella Creations", logo trademarks, curated jewelry photographs, design layouts, graphics, promotional texts, and codebase are the exclusive intellectual property of <strong>Ella Creations India</strong>. Unauthorized reproduction, modification, scraping, or commercial exploitation is strictly prohibited and subject to legal prosecution under the Copyright Act, 1957 and the Trade Marks Act, 1999.
          </p>
        </section>

        {/* Section 7: Governing Law & Dispute Resolution */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Building className="w-4 h-4 text-stone-700" /> 7. Governing Law & Jurisdiction
          </h2>
          <p className="text-stone-700">
            These Terms of Service and any contractual relationship formed via our platform shall be governed by, interpreted, and construed strictly in accordance with the <strong>laws of the Republic of India</strong>. In the event of any legal dispute, claim, or controversy arising out of or relating to these Terms or purchases made on ella-creations.com, the <strong>courts of competent jurisdiction at Mumbai, Maharashtra, India</strong> shall have exclusive jurisdiction.
          </p>
        </section>

        {/* Section 8: Statutory Grievance Redressal */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <AlertCircle className="w-4 h-4 text-brand-gold" /> 8. Statutory Grievance Redressal Mechanism
          </h2>
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
            <p>
              In compliance with the Consumer Protection (E-Commerce) Rules, 2020, our Grievance Officer details are published below:
            </p>
            <p>• <strong>Grievance Officer:</strong> Customer Redressal & Legal Compliance Officer</p>
            <p>• <strong>Entity:</strong> Ella Creations India</p>
            <p>• <strong>Grievance Email:</strong> <a href="mailto:ellacreationsindia@gmail.com" className="text-brand-rose underline font-semibold">ellacreationsindia@gmail.com</a></p>
            <p>• <strong>Statutory Redressal Commitment:</strong> Acknowledgment within 48 hours; resolution within 1 month of receipt.</p>
          </div>
        </section>

      </div>

      {/* Customer Contact Footer */}
      <div className="bg-stone-950 text-white p-6 rounded-3xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif text-base font-bold text-white">Questions Regarding Our Terms?</h3>
          <p className="text-xs text-stone-400">Our customer concierge and legal support team is here to help.</p>
        </div>
        <a
          href="mailto:ellacreationsindia@gmail.com"
          className="bg-brand-rose hover:bg-brand-rose/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
        >
          <Mail className="w-4 h-4" /> Contact Legal Desk
        </a>
      </div>
    </div>
  );
}
