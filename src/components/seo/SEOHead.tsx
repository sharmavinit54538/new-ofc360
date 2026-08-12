import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_TITLE = "OFC360 – AI-Powered HR & Workforce Management Platform | EquinoxSphere";
const DEFAULT_DESC =
  "OFC360 is an AI-powered HR and workforce management platform by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth, built to simplify HR, payroll, attendance, recruitment and employee operations.";
const DEFAULT_CANONICAL = "https://www.ofc360.com/";
const DEFAULT_OG_IMAGE = "https://www.ofc360.com/og-image.png";

// Base Organization Schema for EquinoxSphere & Founders
export const EQUINOX_SPHERE_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EquinoxSphere",
  "url": "https://www.ofc360.com/",
  "logo": "https://www.ofc360.com/logo.png",
  "brand": {
    "@type": "Brand",
    "name": "OFC360",
    "description": "AI-Powered HR & Workforce Management Platform"
  },
  "founder": [
    {
      "@type": "Person",
      "name": "Vinit Sharma",
      "jobTitle": "Co-Founder & Owner",
      "worksFor": {
        "@type": "Organization",
        "name": "EquinoxSphere"
      }
    },
    {
      "@type": "Person",
      "name": "Banoth Siddarth",
      "jobTitle": "Co-Founder & Owner",
      "worksFor": {
        "@type": "Organization",
        "name": "EquinoxSphere"
      }
    }
  ],
  "knowsAbout": [
    "Workforce Management",
    "AI HR Technology",
    "Payroll Automation",
    "Attendance Tracking",
    "Recruitment Intelligence"
  ]
};

// Base Product/SoftwareApplication Schema for OFC360
export const OFC360_SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "OFC360",
  "operatingSystem": "All (Cloud SaaS)",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "HR Management Software",
  "author": {
    "@type": "Organization",
    "name": "EquinoxSphere"
  },
  "creator": {
    "@type": "Organization",
    "name": "EquinoxSphere"
  },
  "publisher": {
    "@type": "Organization",
    "name": "EquinoxSphere"
  },
  "description": "OFC360 is an AI-powered HR and workforce management platform developed by EquinoxSphere, founded by Vinit Sharma and Banoth Siddarth.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
};

export function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = "OFC360, EquinoxSphere, Vinit Sharma, Banoth Siddarth, HRMS, AI HR management, workforce management, payroll automation, attendance software, recruitment AI",
  canonicalUrl = DEFAULT_CANONICAL,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', "name", "description", description);
    setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);
    setMetaTag('meta[name="author"]', "name", "author", "EquinoxSphere");

    // 3. Open Graph Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
    setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "OFC360 by EquinoxSphere");
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 6. JSON-LD Structured Data Injection
    const scriptId = "seo-json-ld-data";
    let jsonLdScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = scriptId;
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }

    const schemasToInject = jsonLd
      ? Array.isArray(jsonLd)
        ? jsonLd
        : [jsonLd]
      : [EQUINOX_SPHERE_ORGANIZATION_SCHEMA, OFC360_SOFTWARE_SCHEMA];

    jsonLdScript.textContent = JSON.stringify(schemasToInject, null, 2);
  }, [title, description, keywords, canonicalUrl, ogType, ogImage, jsonLd]);

  return null;
}
