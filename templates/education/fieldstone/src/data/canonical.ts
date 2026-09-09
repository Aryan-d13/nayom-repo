/**
 * Authoritative Canonical Site Data TypeScript Contract
 * Generated from Nayom's contracts/site_data.py
 *
 * DO NOT EDIT DIRECTLY IN TEMPLATES.
 * Nayom is the single source of truth for this contract.
 */

export interface CanonicalOffering {
  name: string;
  description?: string;
  price?: string;
  category?: string;
  features?: string[];
  image_url?: string;
}

export interface CanonicalTestimonial {
  author: string;
  text: string;
  rating?: number;
  date?: string;
  role?: string;
}

export interface CanonicalSocialProof {
  rating?: number;
  review_count?: number;
  reviews: CanonicalTestimonial[];
}

export interface CanonicalHero {
  headline?: string;
  subheadline?: string;
  primary_cta_text?: string;
  secondary_cta_text?: string;
}

export interface CanonicalValue {
  title: string;
  description: string;
  icon?: string;
}

export interface CanonicalSiteData {
  business_name: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  hours?: string;
  hero?: CanonicalHero;
  offerings: CanonicalOffering[];
  values: CanonicalValue[];
  social_proof: CanonicalSocialProof;
  meta_title?: string;
  meta_description?: string;
  extra?: Record<string, unknown>;
}
