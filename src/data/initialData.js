// Curated initial catalog for Ella Creations - Contemporary Artificial Jewelry
export const INITIAL_PRODUCTS = [
  {
    id: "ec-101",
    title: "Royal Kundan & Pearl Choker Set",
    category: "Sets",
    price: 4999,
    comparePrice: 7999,
    taxPercent: 18,
    rating: 4.9,
    reviewsCount: 38,
    stock: 12,
    sku: "EC-SET-101",
    isFeatured: true,
    isNew: true,
    variants: [
      { id: "v-101-1", name: "22k Gold Polish", sku: "EC-SET-101-GLD", price: 4999, stock: 8, swatchColor: "#D4AF37" },
      { id: "v-101-2", name: "Antique Gold Finish", sku: "EC-SET-101-ANT", price: 5299, stock: 4, swatchColor: "#B8860B" }
    ],
    stoneType: "Uncut Kundan & Fresh Pearls",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000"
    ],
    videos: [],
    description: "An opulent 22k gold-plated Kundan choker set embellished with faux emerald drops and lustrous pearl clusters. Perfectly designed for grand weddings and festive celebrations.",
    customSections: [
      {
        title: "Craftsmanship & Materials",
        items: [
          { label: "Base Alloy", value: "Premium Brass (100% Lead & Nickel Free)" },
          { label: "Plating", value: "22k Yellow Gold Electroplated Finish" },
          { label: "Stones", value: "Hand-set AAA+ Grade Kundan & Fresh Water Pearls" }
        ]
      },
      {
        title: "Dimensions & Fit",
        items: [
          { label: "Choker Length", value: "8.5 inches (Adjustable Silk Dori Attachment)" },
          { label: "Earrings Height", value: "2.8 inches with Push-Back Closure" },
          { label: "Net Weight", value: "145 grams" }
        ]
      },
      {
        title: "Care & Warranty",
        items: [
          { label: "Care Instructions", value: "Avoid contact with water, perfume, and cosmetics. Store in velvet pouch." },
          { label: "Warranty", value: "1-Year Ella Creations Anti-Tarnish Guarantee" }
        ]
      }
    ],
    occasionTags: ["Bridal", "Wedding", "Festive"]
  },
  {
    id: "ec-102",
    title: "Starlight Solitaire Cubic Zirconia Drop Earrings",
    category: "Earrings",
    price: 1899,
    comparePrice: 2999,
    taxPercent: 18,
    rating: 4.8,
    reviewsCount: 52,
    stock: 25,
    sku: "EC-ER-102",
    isFeatured: true,
    isNew: true,
    variants: [
      { id: "v-102-1", name: "18k Rose Gold", sku: "EC-ER-102-RG", price: 1899, stock: 15, swatchColor: "#B76E79" },
      { id: "v-102-2", name: "Pure Silver Polish", sku: "EC-ER-102-SLV", price: 1899, stock: 10, swatchColor: "#C0C0C0" }
    ],
    stoneType: "AAA+ Cubic Zirconia (CZ)",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000"
    ],
    videos: [],
    description: "Dazzling solitaire drop earrings with diamond-cut AAA+ cubic zirconia crystals set in 18k rose gold plating. Lightweight and hypoallergenic for effortless evening wear.",
    customSections: [
      {
        title: "Specifications",
        items: [
          { label: "Metal", value: "18k Rose Gold / Rhodium Plated Silver" },
          { label: "Posts", value: "Hypoallergenic 925 Sterling Silver" },
          { label: "Stone Cut", value: "Hearts & Arrows Precision CZ" }
        ]
      }
    ],
    occasionTags: ["Cocktail", "Party", "Workwear"]
  },
  {
    id: "ec-103",
    title: "Celestial Rose Gold Flower Ring",
    category: "Rings",
    price: 1299,
    comparePrice: 1999,
    taxPercent: 18,
    rating: 4.9,
    reviewsCount: 29,
    stock: 18,
    sku: "EC-RG-103",
    isFeatured: true,
    isNew: false,
    variants: [
      { id: "v-103-1", name: "Rose Gold", sku: "EC-RG-103-RG", price: 1299, stock: 12, swatchColor: "#B76E79" },
      { id: "v-103-2", name: "Yellow Gold", sku: "EC-RG-103-YG", price: 1299, stock: 6, swatchColor: "#FFD700" }
    ],
    stoneType: "Cubic Zirconia (CZ)",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000"
    ],
    videos: [],
    description: "An adjustable statement ring adorned with shimmering floral petals crafted with brilliant micro-pave CZ stones in dual tone 18k rose gold.",
    customSections: [
      {
        title: "Sizing & Fit",
        items: [
          { label: "Size", value: "Universal Adjustable (Fits US 6 to 10)" },
          { label: "Motif Diameter", value: "2.0 cm" }
        ]
      }
    ],
    occasionTags: ["Daily Elegance", "Gifting", "Anniversary"]
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    productId: "ec-101",
    author: "Pooja Verma (Mumbai)",
    rating: 5,
    title: "Breathtaking Kundan set!",
    comment: "I wore this for my sister's sangeet and received endless compliments! The shine is indistinguishable from real gold Kundan. Packaging was royal velvet box.",
    photo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300",
    date: "2026-07-28",
    verified: true
  },
  {
    id: "rev-2",
    productId: "ec-102",
    author: "Rhea Sen (Bangalore)",
    rating: 5,
    title: "Obsessed with the CZ sparkle",
    comment: "The earrings look super premium. Doesn't irritate my sensitive ears at all. 100% anti-tarnish so far after 3 months of wear!",
    photo: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=300",
    date: "2026-08-01",
    verified: true
  }
];

export const INITIAL_ORDERS = [];

export const ACTIVE_COUPONS = {};
