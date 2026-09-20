import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  Percent, 
  Tag, 
  Upload, 
  Eye, 
  Save, 
  AlertCircle, 
  Layers, 
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useStore, formatPrice } from '../../context/StoreContext';
import { uploadProductPhotoToSupabase, compressImageDataUrl } from '../../lib/supabase';
import { toISTInputString, parseCampaignDateTime, formatToIsoFromIST } from '../../utils/pricing';
import PromotionProductSelector from './PromotionProductSelector';
import PromotionPreview from './PromotionPreview';

export default function PromotionForm({
  isOpen = false,
  editingCampaign = null,
  initialTab = 'details',
  onClose = () => {},
  onSave = () => {}
}) {
  const { products, showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    description: '',
    discountPercentage: '50',
    startAt: '',
    endAt: '',
    isEnabled: true,
    priority: 1,
    allProducts: false,
    productIds: [],
    ctaText: 'SHOP THE SALE',
    ctaUrl: '#sale',
    imageUrl: '',
    popupEnabled: true,
    popupFrequency: 'once_per_session'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'details'); // 'details' | 'products' | 'popup'

  // Initialize or reset form data when opened
  useEffect(() => {
    if (!isOpen) return;

    if (editingCampaign) {
      setFormData({
        name: editingCampaign.name || '',
        headline: editingCampaign.headline || '',
        description: editingCampaign.description || '',
        discountPercentage: (editingCampaign.discount_percentage || editingCampaign.discountPercentage || 50).toString(),
        startAt: toISTInputString(editingCampaign.start_at || editingCampaign.startAt),
        endAt: toISTInputString(editingCampaign.end_at || editingCampaign.endAt),
        isEnabled: editingCampaign.is_enabled !== false && editingCampaign.isEnabled !== false,
        priority: Number(editingCampaign.priority || 1),
        allProducts: Boolean(editingCampaign.all_products || editingCampaign.allProducts),
        productIds: editingCampaign.product_ids || editingCampaign.productIds || [],
        ctaText: editingCampaign.cta_text || editingCampaign.ctaText || 'SHOP THE SALE',
        ctaUrl: editingCampaign.cta_url || editingCampaign.ctaUrl || '#sale',
        imageUrl: editingCampaign.image_url || editingCampaign.imageUrl || '',
        popupEnabled: editingCampaign.popup_enabled !== false && editingCampaign.popupEnabled !== false,
        popupFrequency: editingCampaign.popup_frequency || editingCampaign.popupFrequency || 'once_per_session'
      });
    } else {
      // Default: 7-day sale starting now in IST
      const now = new Date();
      const inSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      setFormData({
        name: 'Festive Season Sale',
        headline: 'Festive Sale — Flat 50% OFF',
        description: 'Celebrate the festive season with exclusive offers on selected Ella Creations handcrafted jewelry.',
        discountPercentage: '50',
        startAt: toISTInputString(now),
        endAt: toISTInputString(inSevenDays),
        isEnabled: true,
        priority: 1,
        allProducts: false,
        productIds: [],
        ctaText: 'SHOP THE SALE',
        ctaUrl: '#sale',
        imageUrl: '',
        popupEnabled: true,
        popupFrequency: 'once_per_session'
      });
    }
    setFormErrors({});
    setActiveTab(initialTab || 'details');
  }, [isOpen, editingCampaign, initialTab]);

  if (!isOpen) return null;

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      showToast('Compressing and uploading promotional banner...', 'info');
      const compressed = await compressImageDataUrl(file, 1200, 0.82);
      const uploadedUrl = await uploadProductPhotoToSupabase(compressed || file);
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
        showToast('Banner uploaded successfully!');
      }
    } catch (err) {
      console.error('Promotion image upload failed:', err);
      showToast('Image upload failed: ' + err.message, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Quick Schedule Presets
  const applyPresetSchedule = (days) => {
    const now = new Date();
    const end = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setFormData(prev => ({
      ...prev,
      startAt: toISTInputString(now),
      endAt: toISTInputString(end)
    }));
    showToast(`Schedule set for next ${days} days`);
  };

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Campaign name is required.';
    if (!formData.headline.trim()) errors.headline = 'Promotional headline is required.';
    
    const disc = Number(formData.discountPercentage);
    if (isNaN(disc) || disc < 1 || disc > 99) {
      errors.discountPercentage = 'Discount must be an integer between 1% and 99%.';
    }

    if (!formData.startAt) errors.startAt = 'Start date and time are required.';
    if (!formData.endAt) errors.endAt = 'End date and time are required.';

    if (formData.startAt && formData.endAt) {
      const startMs = parseCampaignDateTime(formData.startAt);
      const endMs = parseCampaignDateTime(formData.endAt);
      if (startMs && endMs && startMs >= endMs) {
        errors.endAt = 'End date must be strictly after the start date.';
      }
    }

    if (!formData.allProducts && formData.productIds.length === 0) {
      errors.productIds = 'Please select at least one product or enable "Apply to All Products".';
    }

    setFormErrors(errors);

    // Auto-navigate to whichever tab contains errors so user immediately sees what is needed
    if (errors.name || errors.headline || errors.discountPercentage || errors.startAt || errors.endAt) {
      setActiveTab('details');
    } else if (errors.productIds) {
      setActiveTab('products');
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the validation errors before saving.', 'error');
      return;
    }

    const startIso = formatToIsoFromIST(formData.startAt);
    const endIso = formatToIsoFromIST(formData.endAt);

    const payload = {
      id: editingCampaign?.id || `promo_${Date.now()}`,
      name: formData.name.trim(),
      headline: formData.headline.trim(),
      description: formData.description.trim(),
      discount_percentage: Number(formData.discountPercentage),
      discountPercentage: Number(formData.discountPercentage),
      start_at: startIso,
      startAt: startIso,
      end_at: endIso,
      endAt: endIso,
      is_enabled: Boolean(formData.isEnabled),
      isEnabled: Boolean(formData.isEnabled),
      priority: Number(formData.priority) || 1,
      all_products: Boolean(formData.allProducts),
      allProducts: Boolean(formData.allProducts),
      product_ids: formData.allProducts ? [] : formData.productIds,
      productIds: formData.allProducts ? [] : formData.productIds,
      cta_text: formData.ctaText.trim() || 'SHOP THE SALE',
      ctaText: formData.ctaText.trim() || 'SHOP THE SALE',
      cta_url: formData.ctaUrl.trim() || '#sale',
      ctaUrl: formData.ctaUrl.trim() || '#sale',
      image_url: formData.imageUrl || null,
      imageUrl: formData.imageUrl || null,
      popup_enabled: Boolean(formData.popupEnabled),
      popupEnabled: Boolean(formData.popupEnabled),
      popup_frequency: formData.popupFrequency || 'once_per_session',
      popupFrequency: formData.popupFrequency || 'once_per_session',
      created_at: editingCampaign?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onSave(payload);
  };

  const previewCampaignData = {
    ...formData,
    id: editingCampaign?.id || 'preview_id',
    discount_percentage: Number(formData.discountPercentage),
    start_at: formatToIsoFromIST(formData.startAt),
    end_at: formatToIsoFromIST(formData.endAt),
    image_url: formData.imageUrl
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-rose/20 border border-brand-rose/30 flex items-center justify-center text-brand-rose">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {editingCampaign ? 'Edit Promotional Campaign' : 'Create New Promotional Campaign'}
                </h3>
                <p className="text-[11px] text-stone-400">
                  Configure discounts, scheduling in IST, product scope, and responsive visitor popups.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-brand-gold px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-stone-800 bg-stone-950/80 px-6 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'border-brand-rose text-brand-rose'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              1. Campaign Details & Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'border-brand-rose text-brand-rose'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>2. Product Selection</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                formData.productIds.length > 0 ? 'bg-brand-rose text-white' : 'bg-stone-800 text-stone-400'
              }`}>
                {formData.productIds.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('popup')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'popup'
                  ? 'border-brand-rose text-brand-rose'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              3. Storefront Popup Settings
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: DETAILS & SCHEDULE */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                
                {/* Campaign Name & Discount Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                      Campaign Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Festive Season Sale 2026"
                      className="w-full bg-stone-950 text-white placeholder-stone-600 text-xs px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-brand-gold outline-none"
                    />
                    {formErrors.name && <p className="text-[11px] text-rose-400">{formErrors.name}</p>}
                  </div>

                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                      Discount Percentage (%) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                        placeholder="50"
                        className="w-full bg-stone-950 text-white text-xs pl-3.5 pr-8 py-2.5 rounded-xl border border-stone-800 focus:border-brand-gold outline-none font-bold"
                      />
                      <Percent className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                    {formErrors.discountPercentage && <p className="text-[11px] text-rose-400">{formErrors.discountPercentage}</p>}
                  </div>
                </div>

                {/* Promotional Headline */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                    Promotional Headline <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g. Festive Sale — Flat 50% OFF"
                    className="w-full bg-stone-950 text-white placeholder-stone-600 text-xs px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-brand-gold outline-none"
                  />
                  {formErrors.headline && <p className="text-[11px] text-rose-400">{formErrors.headline}</p>}
                </div>

                {/* Supporting Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                    Description / Supporting Text
                  </label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Celebrate the festive season with exclusive offers on selected Ella Creations jewelry."
                    className="w-full bg-stone-950 text-white placeholder-stone-600 text-xs p-3.5 rounded-xl border border-stone-800 focus:border-brand-gold outline-none resize-none"
                  />
                </div>

                {/* Scheduling Section (IST) */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Campaign Schedule (Indian Standard Time — Asia/Kolkata)
                      </span>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-stone-500 uppercase font-semibold">Presets:</span>
                      <button
                        type="button"
                        onClick={() => applyPresetSchedule(3)}
                        className="text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        3 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetSchedule(7)}
                        className="text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        7 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetSchedule(14)}
                        className="text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        14 Days
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-stone-400">
                        Start Date & Time (IST) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startAt}
                        onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                        className="w-full bg-stone-900 text-white text-xs px-3 py-2.5 rounded-xl border border-stone-700 focus:border-brand-gold outline-none"
                      />
                      {formErrors.startAt && <p className="text-[11px] text-rose-400">{formErrors.startAt}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-stone-400">
                        End Date & Time (IST) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endAt}
                        onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                        className="w-full bg-stone-900 text-white text-xs px-3 py-2.5 rounded-xl border border-stone-700 focus:border-brand-gold outline-none"
                      />
                      {formErrors.endAt && <p className="text-[11px] text-rose-400">{formErrors.endAt}</p>}
                    </div>
                  </div>
                </div>

                {/* Priority & Campaign Enable Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Campaign Priority
                      </label>
                      <span className="text-[10px] text-stone-500 font-medium">1 = Highest Priority</span>
                    </div>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                      className="w-full bg-stone-900 text-white text-xs px-3 py-2 rounded-xl border border-stone-700 focus:border-brand-gold outline-none cursor-pointer"
                    >
                      <option value={1}>Priority 1 (Primary / Overrides others)</option>
                      <option value={2}>Priority 2 (Standard)</option>
                      <option value={3}>Priority 3 (Secondary)</option>
                      <option value={4}>Priority 4 (Fallback)</option>
                    </select>
                    <p className="text-[10px] text-stone-500">
                      When multiple campaigns overlap, the highest-priority campaign controls the popup and product pricing.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Campaign Active Switch</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {formData.isEnabled ? 'Enabled (Will run during scheduled dates)' : 'Disabled manually'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isEnabled}
                        onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                    </label>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PRODUCT SELECTION */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                {/* Storewide vs Specific Product Scope Toggle */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Storewide Promotion (All Products)</span>
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      When enabled, the discount applies automatically to all current and future jewelry items in the catalog.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allProducts}
                      onChange={(e) => setFormData({ ...formData, allProducts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-rose" />
                  </label>
                </div>

                {formErrors.productIds && (
                  <div className="p-3 bg-rose-950/60 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formErrors.productIds}</span>
                  </div>
                )}

                {formData.allProducts ? (
                  <div className="p-6 bg-stone-950/80 rounded-2xl border border-brand-gold/30 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Storewide Discount Activated</h4>
                    <p className="text-xs text-stone-400 max-w-md mx-auto">
                      All {products.length} products across all categories will automatically receive the {formData.discountPercentage}% discount during this campaign.
                    </p>
                  </div>
                ) : (
                  <PromotionProductSelector
                    products={products}
                    selectedProductIds={formData.productIds}
                    onChange={(newIds) => setFormData({ ...formData, productIds: newIds })}
                    discountPercentage={formData.discountPercentage}
                  />
                )}
              </div>
            )}

            {/* TAB 3: POPUP SETTINGS */}
            {activeTab === 'popup' && (
              <div className="space-y-6">
                {/* Popup Enable Switch */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Visitor Promotional Popup</h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Show an automated luxury popup to visitors when this campaign is active.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popupEnabled}
                      onChange={(e) => setFormData({ ...formData, popupEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-rose" />
                  </label>
                </div>

                {formData.popupEnabled && (
                  <div className="space-y-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Frequency Setting */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                          Display Frequency
                        </label>
                        <select
                          value={formData.popupFrequency}
                          onChange={(e) => setFormData({ ...formData, popupFrequency: e.target.value })}
                          className="w-full bg-stone-900 text-white text-xs px-3 py-2.5 rounded-xl border border-stone-700 focus:border-brand-gold outline-none cursor-pointer"
                        >
                          <option value="once_per_session">Show once per visitor session (Recommended)</option>
                          <option value="once_per_day">Show once every 24 hours</option>
                          <option value="every_visit">Show on every fresh visit</option>
                        </select>
                      </div>

                      {/* CTA Text */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.ctaText}
                          onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                          placeholder="SHOP THE SALE"
                          className="w-full bg-stone-900 text-white text-xs px-3.5 py-2.5 rounded-xl border border-stone-700 focus:border-brand-gold outline-none"
                        />
                      </div>
                    </div>

                    {/* CTA Destination URL */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        CTA Destination
                      </label>
                      <input
                        type="text"
                        value={formData.ctaUrl}
                        onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                        placeholder="#sale"
                        className="w-full bg-stone-900 text-white text-xs px-3.5 py-2.5 rounded-xl border border-stone-700 focus:border-brand-gold outline-none"
                      />
                      <p className="text-[10px] text-stone-500">
                        Default <code className="text-brand-gold">#sale</code> automatically opens the filtered collection containing the products in this campaign.
                      </p>
                    </div>

                    {/* Optional Banner Image */}
                    <div className="space-y-2 pt-2 border-t border-stone-850">
                      <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                        Optional Promotional Banner Image
                      </label>
                      
                      <div className="flex items-center gap-4">
                        {formData.imageUrl ? (
                          <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-brand-gold/40 bg-stone-900 shrink-0">
                            <img src={formData.imageUrl} alt="Banner preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, imageUrl: '' })}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/80 hover:bg-rose-900 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-16 rounded-xl border border-dashed border-stone-700 bg-stone-900/50 flex items-center justify-center text-stone-500 shrink-0">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 space-y-1.5">
                          <label className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer border border-stone-700">
                            <Upload className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{isUploadingImage ? 'Uploading...' : 'Upload Banner Image'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUploadingImage}
                              className="hidden"
                            />
                          </label>
                          <p className="text-[10px] text-stone-500">
                            Recommended: 600x800px or 1200x800px JPG/PNG. If omitted, the default Ella Creations luxury motif is used.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="text-xs font-semibold text-brand-gold hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Popup (Desktop & Mobile)</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-brand-rose to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-semibold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-soft-rose flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingCampaign ? 'Save Changes' : 'Create & Activate'}</span>
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>

      {/* Embedded Live Preview Modal */}
      <PromotionPreview
        isOpen={isPreviewOpen}
        campaign={previewCampaignData}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
