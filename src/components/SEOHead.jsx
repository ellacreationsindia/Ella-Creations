import React, { useEffect } from 'react';
import { useStore, formatPrice } from '../context/StoreContext';

export default function SEOHead() {
  const { currentView, selectedProductId, selectedCategory, selectedBlogId, products, blogs } = useStore();

  useEffect(() => {
    const domain = 'https://ella-creations.com';
    const activeProduct = products.find(p => p.id === selectedProductId) || (selectedProductId ? products[0] : null);
    const activeBlog = blogs.find(b => b.id === selectedBlogId || b.slug === selectedBlogId) || (selectedBlogId ? blogs[0] : null);

    let title = 'Ella Creations | Handcrafted Artificial & Bridal Jewelry India';
    let description = 'Shop handcrafted luxury artificial jewelry online in India. Explore premium Kundan choker sets, AAA+ Cubic Zirconia drop earrings, solitaire rings, bridal necklaces, and festive bangles at Ella Creations.';
    let keywords = 'artificial jewelry, buy artificial jewelry online India, kundan choker set, bridal jewelry India, rose gold earrings, cubic zirconia rings, CZ solitaire jewelry, meenakari bangles, imitation jewelry, wedding jewelry sets India, Ella Creations';
    let canonicalUrl = `${domain}/`;
    let ogImage = `${domain}/logo.png`;
    let ogType = 'website';
    let robotsContent = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    // 1. Determine View-Specific Metadata
    if (currentView === 'home') {
      title = 'Ella Creations | Handcrafted Artificial & Bridal Jewelry India';
      description = 'Shop handcrafted luxury artificial jewelry online in India. Explore premium Kundan choker sets, AAA+ Cubic Zirconia drop earrings, solitaire rings, bridal necklaces, and festive bangles at Ella Creations.';
      canonicalUrl = `${domain}/`;
    } else if (currentView === 'shop') {
      const catName = selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'All Categories';
      title = selectedCategory && selectedCategory !== 'All'
        ? `Buy Handcrafted ${selectedCategory} Online | Artificial Jewelry India | Ella Creations`
        : 'Shop Artificial Jewelry Catalog | Kundan Chokers & CZ Drops | Ella Creations';
      description = `Browse our catalog of handcrafted ${catName.toLowerCase()}. Premium gold electroplating, AAA+ Cubic Zirconia crystals, and uncut Kundan with insured express delivery across India.`;
      keywords = `${catName.toLowerCase()}, artificial ${catName.toLowerCase()} online, buy kundan set, cz earrings, solitaire rings India, bridal jewelry catalog, Ella Creations`;
      canonicalUrl = selectedCategory && selectedCategory !== 'All'
        ? `${domain}/#${selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : `${domain}/#shop`;
    } else if (currentView === 'product' && activeProduct) {
      const priceText = formatPrice(activeProduct.price);
      title = `${activeProduct.title} - Buy Online ${priceText} | Ella Creations`;
      description = activeProduct.description 
        ? `${activeProduct.description.slice(0, 150)}... Handcrafted ${activeProduct.category} in India at ${priceText}. Insured shipping & luxury gift box.`
        : `Buy ${activeProduct.title} handcrafted in India with protective gold plating at ${priceText}. Exclusive artificial fine jewelry from Ella Creations.`;
      keywords = `${activeProduct.title}, ${activeProduct.category}, ${activeProduct.stoneType || 'artificial jewelry'}, buy ${activeProduct.title} online, kundan jewelry India, Ella Creations`;
      canonicalUrl = `${domain}/#product-${activeProduct.id}`;
      if (activeProduct.images && activeProduct.images.length > 0) {
        ogImage = activeProduct.images[0];
      }
      ogType = 'product';
    } else if (currentView === 'blog') {
      title = 'Ella Journal | Indian Jewelry Styling, Kundan Care & Bridal Guides';
      description = 'Read expert jewelry styling advice, bridal Kundan guides, AAA+ CZ maintenance tips, and contemporary accessory trends from Ella Creations editorial.';
      keywords = 'jewelry styling tips, bridal kundan guide, artificial jewelry care, cz jewelry maintenance, indian bridal fashion blog, Ella Creations blog';
      canonicalUrl = `${domain}/#blog`;
    } else if (currentView === 'blog-detail' && activeBlog) {
      title = `${activeBlog.title} | Ella Journal`;
      description = activeBlog.excerpt || `Read "${activeBlog.title}" on Ella Journal. Expert styling & care tips from Ella Creations.`;
      keywords = `${activeBlog.category}, ${activeBlog.title}, jewelry guide, artificial jewelry blog, Ella Creations`;
      canonicalUrl = `${domain}/#blog-${activeBlog.slug || activeBlog.id}`;
      if (activeBlog.coverImage) {
        ogImage = activeBlog.coverImage;
      }
      ogType = 'article';
    } else if (currentView === 'brand-guidelines') {
      title = 'Jewelry Craftsmanship & Care Guidelines | Ella Creations';
      description = 'Discover Ella Creations craftsmanship standards, lead-free brass metallurgy, gold electroplating, and proper artificial jewelry preservation guidelines.';
      canonicalUrl = `${domain}/#brand-guidelines`;
    } else if (currentView === 'terms') {
      title = 'Terms & Conditions, Shipping & Store Policies | Ella Creations';
      description = 'Review Ella Creations terms of service, payment methods via Razorpay, Pan-India courier shipping timelines, and customer policies.';
      canonicalUrl = `${domain}/#terms`;
    } else if (currentView === 'privacy') {
      title = 'Privacy Policy & Customer Security | Ella Creations';
      description = 'Learn how Ella Creations protects customer data, complies with DPDP regulations, and ensures encrypted transaction security with Razorpay.';
      canonicalUrl = `${domain}/#privacy`;
    } else if (currentView === 'sitemap') {
      title = 'Website Sitemap & Catalog Directory | Ella Creations India';
      description = 'Structured directory of all product categories, individual collections, editorial guides, and customer service resources on Ella Creations.';
      canonicalUrl = `${domain}/#sitemap`;
    } else if (currentView === 'account' || currentView === 'checkout') {
      title = 'Customer Portal & Checkout | Ella Creations';
      description = 'Secure customer account portal and order tracking on Ella Creations.';
      robotsContent = 'noindex, nofollow';
    } else if (currentView === 'admin') {
      title = 'Admin Control Panel | Ella Creations';
      description = 'Internal store management dashboard.';
      robotsContent = 'noindex, nofollow';
    } else if (currentView === '404') {
      title = '404: Page Not Found | Ella Creations India';
      description = 'The jewelry piece or page you are looking for cannot be found. Browse our handcrafted artificial Kundan, CZ and bridal jewelry collections.';
      robotsContent = 'noindex, nofollow';
      canonicalUrl = `${domain}/404`;
    }

    // 2. Update Document Title
    document.title = title;

    // 3. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 4. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // 5. Update Robots Directives
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', robotsContent);

    // 6. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 7. Open Graph Meta Tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:image': ogImage,
      'og:url': canonicalUrl,
      'og:type': ogType,
      'og:site_name': 'Ella Creations',
      'og:locale': 'en_IN'
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

    // 8. Twitter Card Tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage,
      'twitter:url': canonicalUrl
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

    // 9. Schema.org JSON-LD Structured Data Generation
    const existingJsonLd = document.getElementById('json-ld-seo');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        "name": "Ella Creations",
        "url": domain,
        "logo": `${domain}/logo.png`,
        "description": "Contemporary handcrafted artificial jewelry brand in India, specializing in bridal Kundan chokers, AAA+ CZ earrings, solitaire rings, and festive collections.",
        "email": "ellacreationsindia@gmail.com",
        "sameAs": [
          "https://www.instagram.com/ellacreationsindia/",
          "https://www.facebook.com/ellacreations"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        "url": domain,
        "name": "Ella Creations",
        "publisher": {
          "@id": `${domain}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${domain}/#shop?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ];

    // Add Breadcrumb Schema for structured search engine breadcrumbs
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": domain
      }
    ];

    if (currentView === 'shop') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": selectedCategory && selectedCategory !== 'All' ? selectedCategory : 'Catalog',
        "item": canonicalUrl
      });
    } else if (currentView === 'product' && activeProduct) {
      breadcrumbItems.push(
        {
          "@type": "ListItem",
          "position": 2,
          "name": activeProduct.category || 'Shop',
          "item": `${domain}/#${(activeProduct.category || 'shop').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": activeProduct.title,
          "item": canonicalUrl
        }
      );
    } else if (currentView === 'blog') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Ella Journal",
        "item": `${domain}/#blog`
      });
    } else if (currentView === 'blog-detail' && activeBlog) {
      breadcrumbItems.push(
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Ella Journal",
          "item": `${domain}/#blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": activeBlog.title,
          "item": canonicalUrl
        }
      );
    } else if (currentView === 'brand-guidelines') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Jewelry Care & Brand Heritage",
        "item": canonicalUrl
      });
    } else if (currentView === 'terms') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Terms & Conditions",
        "item": canonicalUrl
      });
    } else if (currentView === 'privacy') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Privacy Policy",
        "item": canonicalUrl
      });
    } else if (currentView === 'sitemap') {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Sitemap Directory",
        "item": canonicalUrl
      });
    }

    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    });

    // Add Product Schema if on Product Detail View
    if (currentView === 'product' && activeProduct) {
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": activeProduct.title,
        "image": (activeProduct.images && activeProduct.images.length > 0) ? activeProduct.images : [`${domain}/logo.png`],
        "description": activeProduct.description || `${activeProduct.title} handcrafted in India by Ella Creations.`,
        "sku": activeProduct.sku || `EC-${activeProduct.id}`,
        "category": activeProduct.category || "Jewelry",
        "material": activeProduct.stoneType || "Brass & Cubic Zirconia",
        "brand": {
          "@type": "Brand",
          "name": "Ella Creations"
        },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "INR",
          "price": activeProduct.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": activeProduct.price > 0 && activeProduct.stock > 0 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "Ella Creations"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "INR"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "IN"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "businessDays": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["https://schema.org/Monday", "https://schema.org/Saturday"]
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 3,
                "maxValue": 5,
                "unitCode": "DAY"
              }
            }
          }
        }
      };

      if (activeProduct.rating) {
        productSchema.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": activeProduct.rating,
          "reviewCount": activeProduct.reviewsCount || 1,
          "bestRating": "5",
          "worstRating": "1"
        };
      }

      schemas.push(productSchema);
    }

    // Add CollectionPage / ItemList Schema for Shop View
    if (currentView === 'shop') {
      const topItems = products.slice(0, 10).map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${domain}/#product-${p.id}`,
        "name": p.title
      }));

      schemas.push({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": selectedCategory && selectedCategory !== 'All' ? `${selectedCategory} Collection` : "Jewelry Catalog",
        "url": canonicalUrl,
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": topItems
        }
      });
    }

    // Add BlogPosting Schema if on Article Detail View
    if (currentView === 'blog-detail' && activeBlog) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": activeBlog.title,
        "description": activeBlog.excerpt,
        "image": activeBlog.coverImage || `${domain}/logo.png`,
        "author": {
          "@type": "Organization",
          "name": activeBlog.author || "Ella Editorial"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Ella Creations",
          "logo": {
            "@type": "ImageObject",
            "url": `${domain}/logo.png`
          }
        },
        "datePublished": activeBlog.publishedAt || new Date().toISOString(),
        "dateModified": activeBlog.publishedAt || new Date().toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        }
      });
    }

    const script = document.createElement('script');
    script.id = 'json-ld-seo';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas);
    document.head.appendChild(script);

  }, [currentView, selectedProductId, selectedCategory, selectedBlogId, products, blogs]);

  return null;
}

