import React from 'react';
import { Compass, ShoppingBag, ShieldCheck, FileText, Crown, ArrowLeft, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEOHead from '../components/SEOHead';

export default function SitemapView() {
  const { navigateTo, isAdmin } = useStore();

  const siteStructure = [
    {
      category: 'Main Navigation & Shop',
      icon: ShoppingBag,
      color: 'text-brand-rose',
      links: [
        { label: 'Home Page', view: 'home', desc: 'Hero showcase, featured Kundan sets & customer reviews' },
        { label: 'Shop Catalog', view: 'shop', desc: 'Complete collection of necklaces, earrings, rings & sets' },
        { label: 'About Ella Creations', view: 'home', desc: 'Our brand story & handcrafted craftsmanship' },
        { label: 'Contact Us & Concierge', view: 'contact', desc: 'Customer support & WhatsApp help' }
      ]
    },
    {
      category: 'Customer Care & Resources',
      icon: ShieldCheck,
      color: 'text-brand-gold',
      links: [
        { label: 'Jewelry Care Guide', view: 'brand-guidelines', desc: 'Maintenance tips for handcrafted jewelry longevity' },
        { label: 'Shipping & Delivery', view: 'terms', desc: 'Pincode serviceability & express shipping rates' },
        { label: 'No Return Policy & Terms', view: 'terms', desc: 'Store guidelines and shipping policies' },
        { label: 'VIP Sparkle Club', view: 'home', desc: 'Newsletter subscription for preview drops' }
      ]
    },
    {
      category: 'Legal & Brand Documentation',
      icon: FileText,
      color: 'text-emerald-600',
      links: [
        { label: 'Terms & Conditions', view: 'terms', desc: 'Store guidelines, pricing & Indian jurisdiction' },
        { label: 'Privacy Policy', view: 'privacy', desc: 'DPDP Act compliance & Razorpay payment security' },
        { label: 'Brand Guidelines & Heritage', view: 'brand-guidelines', desc: 'Brand story, colors, fonts & craftsmanship' },
        { label: 'XML Sitemap (Search Engines)', url: '/sitemap.xml', external: true, desc: 'Machine-readable XML sitemap for SEO crawlers' }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 text-stone-800">
      <SEOHead
        title="Site Directory & Sitemap | Ella Creations India"
        description="Navigate all pages, shop collections, legal terms, privacy policies, and brand guidelines on Ella Creations India."
      />

      {/* Header */}
      <div className="border-b border-brand-gold/30 pb-6 space-y-3">
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-stone-500 hover:text-brand-rose flex items-center gap-1 font-semibold transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>
        <span className="text-xs uppercase font-bold tracking-widest text-brand-gold flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-gold" /> Complete Site Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">Website Sitemap</h1>
        <p className="text-xs text-stone-500 font-mono">Structured overview of all pages, catalog routes & legal resources</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {siteStructure.map((group, idx) => {
          const IconComp = group.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-brand-gold/20 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <IconComp className={`w-5 h-5 ${group.color}`} />
                  <h3 className="font-serif text-base font-bold text-stone-900">{group.category}</h3>
                </div>

                <div className="space-y-3">
                  {group.links.map((link, linkIdx) => (
                    <div key={linkIdx} className="space-y-0.5">
                      {link.external ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-brand-rose hover:underline flex items-center gap-1"
                        >
                          {link.label} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          onClick={() => navigateTo(link.view)}
                          className="text-xs font-bold text-stone-900 hover:text-brand-rose transition-colors text-left"
                        >
                          {link.label}
                        </button>
                      )}
                      <p className="text-[11px] text-stone-500">{link.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Link if Admin */}
      {isAdmin && (
        <div className="bg-brand-cream/60 p-4 rounded-2xl border border-brand-gold/30 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
            <Crown className="w-4 h-4 text-brand-gold" /> Admin Dashboard Access Enabled
          </span>
          <button
            onClick={() => navigateTo('admin')}
            className="bg-brand-gold text-stone-950 font-bold text-xs px-4 py-2 rounded-xl"
          >
            Open Admin Panel
          </button>
        </div>
      )}

    </div>
  );
}
