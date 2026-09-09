/**
 * Authoritative Canonical Business Site Contract
 * Synchronized with Nayom (contracts/site_data.py)
 */

export interface CanonicalBusinessIdentity {
  name: string;
  short_name?: string | null;
  tagline?: string | null;
  category?: string | null;
  description?: string | null;
}

export interface CanonicalContact {
  phone?: string | null;
  raw_phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  hours?: string | null;
  social_links?: Record<string, string>;
  service_areas?: string[];
}

export interface CanonicalCTA {
  text: string;
  link?: string | null;
  phone_action?: boolean;
}

export interface CanonicalEditorial {
  headline?: string | null;
  subheadline?: string | null;
  value_proposition?: string | null;
  differentiators?: string[];
  primary_cta?: CanonicalCTA | null;
  secondary_cta?: CanonicalCTA | null;
}

export interface CanonicalOffering {
  id: string;
  name: string;
  category?: string | null;
  summary?: string | null;
  features?: string[];
  pricing?: string | null;
}

export interface CanonicalTestimonial {
  quote: string;
  author?: string | null;
  rating?: number | null;
  source?: string | null;
}

export interface CanonicalSocialProof {
  rating?: number | null;
  review_count?: number | null;
  testimonials?: CanonicalTestimonial[];
}

export interface CanonicalSEO {
  title?: string | null;
  meta_description?: string | null;
  keywords?: string[];
  json_ld?: Record<string, unknown> | null;
}

export interface CanonicalAsset {
  url_or_path: string;
  alt?: string | null;
  kind?: string;
}

export interface CanonicalSiteData {
  schema_version: string;
  business_id: string;
  generated_at: string;
  identity: CanonicalBusinessIdentity;
  contact: CanonicalContact;
  editorial: CanonicalEditorial;
  offerings?: CanonicalOffering[];
  social_proof?: CanonicalSocialProof;
  seo?: CanonicalSEO;
  assets?: CanonicalAsset[];
  metadata?: Record<string, unknown>;
}
