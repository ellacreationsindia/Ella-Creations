import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  Percent, 
  CheckCircle2, 
  AlertCircle, 
  Power, 
  Tag, 
  ShoppingBag, 
  Layers,
  ArrowUpRight,
  Search,
  Filter,
  ExternalLink,
  Play,
  Sliders
} from 'lucide-react';
import { useStore, formatPrice } from '../../context/StoreContext';
import { getCampaignStatus, formatISTDateTime, getActivePromotions } from '../../utils/pricing';
import PromotionForm from './PromotionForm';
import PromotionPreview from './PromotionPreview';

export default function PromotionManager() {
  const { 
    promotions = [], 
    products = [],
    activePopupCampaign,
    addPromotion, 
    updatePromotion, 
    deletePromotion, 
    togglePromotionStatus,
    togglePopupEnabled,
    triggerPromotionPopup,
    showToast,
    navigateTo
  } = useStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialTab, setFormInitialTab] = useState('details');
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [previewCampaign, setPreviewCampaign] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Scheduled' | 'Expired' | 'Disabled'

  // Identify current popup campaign
  const currentPopupCampaign = activePopupCampaign || promotions.find(p => p.popup_enabled !== false && p.popupEnabled !== false) || promotions[0] || null;
  const isPopupLive = Boolean(activePopupCampaign && (activePopupCampaign.popup_enabled !== false && activePopupCampaign.popupEnabled !== false));

  // Calculate Metrics
  const activeList = getActivePromotions(promotions);
  const scheduledCount = promotions.filter(p => getCampaignStatus(p) === 'Scheduled').length;
  const expiredCount = promotions.filter(p => getCampaignStatus(p) === 'Expired').length;
  const avgDiscount = promotions.length > 0 
    ? Math.round(promotions.reduce((sum, p) => sum + (Number(p.discount_percentage || p.discountPercentage) || 0), 0) / promotions.length)
    : 0;

  // Filter campaigns
  const filteredPromotions = promotions.filter(campaign => {
    const status = getCampaignStatus(campaign);
    if (statusFilter !== 'All' && status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (campaign.name || '').toLowerCase().includes(q);
      const matchHeadline = (campaign.headline || '').toLowerCase().includes(q);
      if (!matchName && !matchHeadline) return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setFormInitialTab('details');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (campaign, tab = 'details') => {
    setEditingCampaign(campaign);
    setFormInitialTab(tab);
    setIsFormOpen(true);
  };

  const handleSaveCampaign = async (campaignData) => {
    if (editingCampaign) {
      await updatePromotion(campaignData);
    } else {
      await addPromotion(campaignData);
    }
    setIsFormOpen(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = async (campaign) => {
    if (window.confirm(`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`)) {
      await deletePromotion(campaign.id);
    }
  };

  const handleTestOnWebsite = (campaign) => {
    if (!campaign) return;
    triggerPromotionPopup(campaign.id);
    showToast('🚀 Opening website with fresh promotional pop-up active!', 'success');
    navigateTo('home');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-400 border border-amber-800">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-400 border border-stone-700">
            Expired
          </span>
        );
      case 'Disabled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-800">
            Disabled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-300">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 p-4 sm:p-5 rounded-2xl border border-brand-gold/30 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-rose/20 border border-brand-rose/30 flex items-center justify-center text-brand-rose">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
              Sales & Promotions Engine
            </h2>
          </div>
          <p className="text-xs text-stone-400 max-w-xl">
            Create scheduled flash sales, festive promotions, and device-responsive visitor popups. Discounts automatically apply server-side across the storefront.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-brand-rose to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-semibold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-soft-rose flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotion</span>
        </button>
      </div>

      {/* STOREFRONT PROMOTIONAL POP-UP QUICK CONTROL CARD */}
      <div className="bg-stone-900 border border-brand-gold/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* Left: Info & Live Status */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" />
                Storefront Promotional Pop-up Hub
              </span>

              {isPopupLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live on Website
                </span>
              ) : currentPopupCampaign ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-400 border border-stone-700">
                  <Power className="w-3 h-3" />
                  Pop-up Inactive / Disabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-stone-400 border border-stone-700">
                  No Campaign Configured
                </span>
              )}

              {currentPopupCampaign && (
                <span className="text-[10px] font-medium text-stone-400 bg-stone-950 px-2.5 py-1 rounded-full border border-stone-800">
                  Frequency: <strong className="text-stone-300 capitalize">{String(currentPopupCampaign.popup_frequency || currentPopupCampaign.popupFrequency || 'once_per_session').replace(/_/g, ' ')}</strong>
                </span>
              )}
            </div>

            {currentPopupCampaign ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                    {currentPopupCampaign.headline || currentPopupCampaign.name}
                  </h3>
                  <span className="text-xs font-black text-brand-gold bg-brand-gold/15 px-2.5 py-0.5 rounded-lg border border-brand-gold/30">
                    FLAT {currentPopupCampaign.discount_percentage || currentPopupCampaign.discountPercentage || 0}% OFF
                  </span>
                </div>
                <p className="text-xs text-stone-300 max-w-2xl line-clamp-2">
                  {currentPopupCampaign.description || 'Exclusive luxury artificial jewelry promotional offer shown to storefront visitors.'}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-1 flex-wrap">
                  <span>Campaign: <strong className="text-stone-300">{currentPopupCampaign.name}</strong></span>
                  <span>CTA: <code className="text-brand-gold font-mono">{currentPopupCampaign.cta_text || 'SHOP THE SALE'}</code></span>
                  {currentPopupCampaign.end_at && (
                    <span>Valid Till: <strong className="text-stone-300">{formatISTDateTime(currentPopupCampaign.end_at)}</strong></span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400">
                You currently have no promotional campaigns set up. Create a campaign to show an automated luxury pop-up to store visitors.
              </p>
            )}
          </div>

          {/* Right: Quick Action Controls */}
          {currentPopupCampaign && (
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
              {/* Quick Toggle Switch */}
              <button
                type="button"
                onClick={() => togglePopupEnabled(currentPopupCampaign.id, currentPopupCampaign.popup_enabled !== false && currentPopupCampaign.popupEnabled !== false)}
                className={`text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isPopupLive
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 hover:bg-rose-900/70'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/70'
                }`}
                title={isPopupLive ? 'Disable pop-up on website' : 'Enable pop-up on website'}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isPopupLive ? 'Disable Pop-up' : 'Enable Pop-up'}</span>
              </button>

              {/* Edit Pop-up Details */}
              <button
                type="button"
                onClick={() => handleOpenEdit(currentPopupCampaign, 'popup')}
                className="text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-stone-700"
              >
                <Sliders className="w-3.5 h-3.5 text-brand-gold" />
                <span>Edit Pop-up Details</span>
              </button>

              {/* Live Preview */}
              <button
                type="button"
                onClick={() => setPreviewCampaign(currentPopupCampaign)}
                className="text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-brand-gold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-stone-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              {/* Test / View Live on Website */}
              <button
                type="button"
                onClick={() => handleTestOnWebsite(currentPopupCampaign)}
                className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-gold to-amber-500 hover:from-amber-400 hover:to-amber-600 text-stone-950 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-gold-glow hover:scale-105"
                title="Immediately opens storefront and blooms the promotional popup"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test on Website</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Summary Analytics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Active Campaigns</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{activeList.length}</span>
            <span className="text-[10px] text-stone-500">Running Live</span>
          </div>
        </div>

        <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Scheduled Ahead</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{scheduledCount}</span>
            <span className="text-[10px] text-stone-500">Upcoming in IST</span>
          </div>
        </div>

        <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Campaigns</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{promotions.length}</span>
            <span className="text-[10px] text-stone-500">In Database</span>
          </div>
        </div>

        <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Average Discount</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-brand-gold">{avgDiscount}%</span>
            <span className="text-[10px] text-stone-500">Promotional Avg</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900 p-3 rounded-2xl border border-stone-800">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by name or headline..."
            className="w-full bg-stone-950 text-white placeholder-stone-500 text-xs pl-9 pr-4 py-2 rounded-xl border border-stone-700 focus:border-brand-gold outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Active', 'Scheduled', 'Expired', 'Disabled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                statusFilter === status
                  ? 'bg-brand-rose text-white shadow-sm'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table / Cards */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        {filteredPromotions.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-stone-850 border border-stone-750 flex items-center justify-center mx-auto text-brand-gold">
              <Tag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No promotional campaigns found</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                {promotions.length === 0 
                  ? 'Get started by creating your first promotional sale campaign with custom discounts and visitor popups.'
                  : 'No campaigns match the current search query or status filter.'}
              </p>
            </div>
            {promotions.length === 0 ? (
              <button
                onClick={handleOpenCreate}
                className="bg-brand-rose hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Campaign</span>
              </button>
            ) : (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="text-xs text-brand-gold hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 text-[10px] uppercase tracking-wider font-semibold border-b border-stone-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Campaign / Headline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Schedule (IST)</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Active Switch</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredPromotions.map(campaign => {
                  const status = getCampaignStatus(campaign);
                  const discountVal = campaign.discount_percentage || campaign.discountPercentage || 0;
                  const productCount = (campaign.product_ids || campaign.productIds || []).length;
                  const startStr = formatISTDateTime(campaign.start_at || campaign.startAt);
                  const endStr = formatISTDateTime(campaign.end_at || campaign.endAt);
                  const isEnabled = campaign.is_enabled !== false && campaign.isEnabled !== false;

                  return (
                    <tr key={campaign.id} className="hover:bg-stone-850/50 transition-colors">
                      
                      {/* Campaign Name & Headline */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="space-y-0.5 max-w-xs sm:max-w-sm">
                          <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                            <span>{campaign.name}</span>
                            {campaign.popup_enabled !== false && (
                              <span className="text-[9px] font-bold text-brand-gold bg-brand-gold/10 px-1.5 py-0.2 rounded border border-brand-gold/20" title="Visitor popup active">
                                POPUP
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 truncate">{campaign.headline}</p>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(status)}
                      </td>

                      {/* Discount Percentage */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-sm font-black text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 rounded-xl">
                          {discountVal}% OFF
                        </span>
                      </td>

                      {/* Included Products */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
                          <span className="font-semibold text-white">{productCount}</span>
                          <span className="text-stone-500 text-[10px]">items</span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-4 text-[11px] whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="text-stone-300 flex items-center gap-1">
                            <span className="text-stone-500 font-mono text-[10px]">Start:</span>
                            <span>{startStr}</span>
                          </div>
                          <div className="text-stone-400 flex items-center gap-1">
                            <span className="text-stone-500 font-mono text-[10px]">End:</span>
                            <span>{endStr}</span>
                          </div>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                          Priority {campaign.priority || 1}
                        </span>
                      </td>

                      {/* Manual Enable/Disable Switch */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => togglePromotionStatus(campaign.id, isEnabled)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-colors cursor-pointer border ${
                            isEnabled
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/50'
                              : 'bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700'
                          }`}
                          title={isEnabled ? 'Click to disable campaign' : 'Click to enable campaign'}
                        >
                          <Power className="w-3 h-3" />
                          <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Preview */}
                          <button
                            type="button"
                            onClick={() => setPreviewCampaign(campaign)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-brand-gold transition-colors cursor-pointer"
                            title="Preview Popup"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(campaign)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Campaign"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaign(campaign)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950/80 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Promotion Create / Edit Modal */}
      <PromotionForm
        isOpen={isFormOpen}
        editingCampaign={editingCampaign}
        initialTab={formInitialTab}
        onClose={() => { setIsFormOpen(false); setEditingCampaign(null); }}
        onSave={handleSaveCampaign}
      />

      {/* Popup Preview Modal */}
      <PromotionPreview
        isOpen={Boolean(previewCampaign)}
        campaign={previewCampaign}
        onClose={() => setPreviewCampaign(null)}
      />

    </div>
  );
}
