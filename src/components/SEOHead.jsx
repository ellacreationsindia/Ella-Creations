import React, { useEffect } from 'react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function SEOHead() {
  const { currentView, selectedProductId, products } = useStore();

  useEffect(() => {
    const activeProduct = products.find(p => p.id === selectedProductId);
    const domain = 'https://ellacreations.co';

    let title = 'Ella Creations | Contemporary Artificial Jewelry India';
    let description = 'Shop 100% anti-tarnish artificial jewelry at Ella Creations. Explore Kundan chokers, rose gold crystal drop earrings, CZ solitaire rings, and bridal sets in India.';
    let keywords = 'artificial jewelry, kundan choker set, rose gold earrings, cubic zirconia rings, bridal jewelry India, anti tarnish jewelry, Ella Creations';
    let canonicalUrl = domain;
    let ogImage = `${domain}/logo.png`;
    let ogType = 'website';

    if (currentView === 'home') {
      title = 'Ella Creations | Contemporary Artificial Jewelry India';
      description = 'Contemporary artificial jewelry crafted for the modern, confident and elegant woman. Shop Kundan chokers, rose gold earrings, CZ rings, and bridal sets.';
      canonicalUrl = domain;
    } else if (currentView === 'shop') {
      title = 'Shop Artificial Jewelry Catalog | Kundan & Rose Gold | Ella Creations';
      description = 'Browse our complete catalog of handcrafted artificial jewelry. Filter by category, metal finish, stone type, and price range with express shipping across India.';
      keywords = 'artificial jewelry shop, buy kundan set online, rose gold drop earrings, cz rings catalog, artificial bridal sets India';
      canonicalUrl = `${domain}/#shop`;
    } else if (currentView === 'product' && activeProduct) {
      title = `${activeProduct.title} - Buy Online ${formatPrice(activeProduct.price)} | Ella Creations`;
      description = activeProduct.description || `Buy ${activeProduct.title} online at Ella Creations. Plated in 22K Gold / Rose Gold with anti-tarnish protective coating.`;
      keywords = `${activeProduct.title}, ${activeProduct.category}, ${activeProduct.stoneType}, artificial jewelry, Ella Creations`;
      canonicalUrl = `${domain}/#product-${activeProduct.id}`;
      if (activeProduct.images && activeProduct.images.length > 0) {
        ogImage = activeProduct.images[0];
      }
      ogType = 'product';
    } else if (currentView === 'admin') {
      title = 'Admin Dashboard & Store Inventory | Ella Creations';
      description = 'Internal store management and real analytics dashboard for Ella Creations.';
      canonicalUrl = `${domain}/#admin`;
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // 4. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 5. Open Graph Meta Tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:image': ogImage,
      'og:url': canonicalUrl,
      'og:type': ogType,
      'og:site_name': 'Ella Creations'
    };

    Object.entries(ogTags).forEach(([prop, val]) => {
      let ogMeta = document.querySelector(`meta[property="${prop}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', prop);
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute('content', val);
    });

    // 6. Twitter Card Tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage
    };

    Object.entries(twitterTags).forEach(([name, val]) => {
      let twMeta = document.querySelector(`meta[name="${name}"]`);
      if (!twMeta) {
        twMeta = document.createElement('meta');
        twMeta.setAttribute('name', name);
        document.head.appendChild(twMeta);
      }
      twMeta.setAttribute('content', val);
    });

    // 7. Dynamic Schema.org JSON-LD Injection
    const existingJsonLd = document.getElementById('json-ld-seo');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Ella Creations",
        "url": domain,
        "logo": `${domain}/logo.png`,
        "description": "Contemporary artificial jewelry brand crafted for the modern, confident and elegant woman.",
        "email": "ellacreationsindia@gmail.com",
        "sameAs": [
          "https://www.instagram.com/ellacreationsindia/",
          "https://www.instagram.com/ellacreationsindia/"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ella Creations",
        "url": domain,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${domain}/#search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": domain
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": currentView === 'shop' ? 'Shop Catalog' : currentView === 'product' ? 'Product Details' : 'Collections',
            "item": canonicalUrl
          }
        ]
      }
    ];

    // Append Product Schema if on Product Detail view
    if (currentView === 'product' && activeProduct) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": activeProduct.title,
        "image": activeProduct.images || [],
        "description": activeProduct.description,
        "sku": activeProduct.sku,
        "brand": {
          "@type": "Brand",
          "name": "Ella Creations"
        },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "INR",
          "price": activeProduct.price,
          "itemCondition": "https://schema.org/NewCondition",
          "availability": activeProduct.price > 0 && activeProduct.stock > 0 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": activeProduct.rating || 5.0,
          "reviewCount": activeProduct.reviewsCount || 1
        }
      });
    }

    const script = document.createElement('script');
    script.id = 'json-ld-seo';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas);
    document.head.appendChild(script);

  }, [currentView, selectedProductId, products]);

  return null;
}
