import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in";

interface MetadataOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  keywords?: string[];
  type?: "website" | "article";
}

export function constructSeoMetadata({
  title,
  description,
  canonicalPath = "",
  ogImage = "/images/og-default.jpg",
  keywords = [],
  type = "website",
}: MetadataOptions): Metadata {
  const url = `${BASE_URL}${canonicalPath}`;

  const defaultKeywords = [
    "Colleges in India",
    "College Admissions 2026",
    "B.Tech Cutoffs",
    "NIRF Rankings",
    "College Predictor",
    "Exam Dates",
    "Placement Statistics",
    ...keywords,
  ];

  return {
    title: `${title} | AdmissionsHub`,
    description,
    keywords: defaultKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | AdmissionsHub`,
      description,
      url,
      siteName: "AdmissionsHub Discovery & CMS",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AdmissionsHub`,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

