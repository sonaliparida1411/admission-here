const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in";

export interface CollegeJsonLdParams {
  name: string;
  slug: string;
  city: string;
  state: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  overviewText: string;
  ratingOverall?: number;
  reviewCount?: number;
  establishedYear?: number | null;
}

export function generateCollegeJsonLd(params: CollegeJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: params.name,
    url: `${BASE_URL}/college/${params.slug}`,
    logo: params.logoUrl || `${BASE_URL}/images/default-college-logo.png`,
    image: params.coverImageUrl || `${BASE_URL}/images/default-campus.jpg`,
    description: params.overviewText.replace(/<[^>]+>/g, "").slice(0, 300),
    address: {
      "@type": "PostalAddress",
      addressLocality: params.city,
      addressRegion: params.state,
      addressCountry: "IN",
    },
    ...(params.ratingOverall && params.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: params.ratingOverall.toFixed(1),
            reviewCount: params.reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    ...(params.establishedYear ? { foundingDate: params.establishedYear.toString() } : {}),
  };
}

export interface CourseJsonLdParams {
  courseName: string;
  degree: string;
  collegeName: string;
  totalFeesInr: number;
  durationYrs: number;
  slug: string;
}

export function generateCourseJsonLd(params: CourseJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${params.degree} in ${params.courseName}`,
    description: `${params.degree} program offered at ${params.collegeName} with a duration of ${params.durationYrs} years.`,
    provider: {
      "@type": "CollegeOrUniversity",
      name: params.collegeName,
    },
    offers: {
      "@type": "Offer",
      price: params.totalFeesInr,
      priceCurrency: "INR",
      category: "Tuition",
    },
    timeRequired: `P${params.durationYrs}Y`,
  };
}

export interface NewsArticleJsonLdParams {
  title: string;
  slug: string;
  metaDescription?: string | null;
  featuredImageUrl?: string | null;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  authorName: string;
}

export function generateNewsArticleJsonLd(params: NewsArticleJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: params.title,
    description: params.metaDescription || params.title,
    image: [params.featuredImageUrl || `${BASE_URL}/images/og-blog.jpg`],
    datePublished: params.publishedAt ? new Date(params.publishedAt).toISOString() : new Date().toISOString(),
    dateModified: params.updatedAt ? new Date(params.updatedAt).toISOString() : new Date().toISOString(),
    author: {
      "@type": "Person",
      name: params.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "AdmissionsHub Editorial Desk",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${params.slug}`,
    },
  };
}

export function generateFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

