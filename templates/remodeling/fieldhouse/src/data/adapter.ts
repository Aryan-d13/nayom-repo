import { CanonicalSiteData } from "./canonical";
import {
  defaultSiteMetadata,
  defaultBrand,
  defaultNavLinks,
  defaultHeroContent,
  defaultWhatWeKeepContent,
  defaultTransformationsSectionContent,
  defaultTransformationsContent,
  defaultFloorPlanContent,
  defaultMaterialTableContent,
  defaultPeopleContent,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultProjectModalContent,
  NavLink,
  KeepDetail,
  TransformationItem,
  FloorPlanRoom,
  MaterialSample,
} from "./defaultContent";

export function adaptFieldhouseContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBrand.name;
  const city = contact?.city || "Portland";
  const state = contact?.state || "Oregon";
  const phone = contact?.phone || defaultBrand.phone;
  const phoneRaw = contact?.raw_phone || defaultBrand.phoneRaw;
  const email = contact?.email || defaultBrand.email;
  const tagline = identity?.tagline || defaultBrand.tagline;

  const BRAND = {
    ...defaultBrand,
    name: name.toUpperCase(),
    location: `${city}, ${state}`,
    address: `${city}, ${state}`,
    tagline,
    phone,
    phoneRaw,
    email,
    primaryCTA: editorial?.primary_cta?.text || defaultBrand.primaryCTA,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 5).map((o) => o.name)
        : defaultBrand.services,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name.toUpperCase()} | Residential Remodeling ${city}, ${state}`,
    description: `${tagline} ${identity?.description || defaultSiteMetadata.description}`,
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: `${name.toUpperCase()} — Residential Remodeling`,
      description: `${tagline} ${city}, ${state}.`,
      type: "website" as const,
    },
  };

  const headlineWords = editorial?.headline ? editorial.headline.split(" ") : [];
  const HERO_CONTENT = {
    ...defaultHeroContent,
    label: `${city.toUpperCase()} / RESIDENTIAL REMODELING`,
    headline: editorial?.headline || defaultHeroContent.headline,
    headlineLines: headlineWords.length > 0 ? [headlineWords.slice(0, 2).join(" "), headlineWords.slice(2).join(" ")] : defaultHeroContent.headlineLines,
    serifLine: editorial?.value_proposition || defaultHeroContent.serifLine,
    supportingCopy: editorial?.subheadline || identity?.description || defaultHeroContent.supportingCopy,
    primaryCTA: editorial?.primary_cta?.text ? `${editorial.primary_cta.text} →` : defaultHeroContent.primaryCTA,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const FINAL_CTA_CONTENT = {
    ...defaultFinalCtaContent,
    serifLine: editorial?.value_proposition || defaultFinalCtaContent.serifLine,
    primaryCTA: editorial?.primary_cta?.text ? `${editorial.primary_cta.text} →` : defaultFinalCtaContent.primaryCTA,
    phone,
    location: `${city}, ${state}`,
  };

  const FOOTER_CONTENT = {
    ...defaultFooterContent,
    brand: name.toUpperCase(),
    tagline,
    description: identity?.description || defaultFooterContent.description,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 5).map((o) => o.name)
        : defaultFooterContent.services,
    contact: {
      phone,
      email,
      location: `${city}, ${state}`,
    },
    copyright: `© ${new Date().getFullYear()} ${name}`,
    colophon: {
      ...defaultFooterContent.colophon,
      location: `${city}, ${state.slice(0, 2).toUpperCase()}`,
    },
  };

  const PROJECT_MODAL_CONTENT = {
    ...defaultProjectModalContent,
    studioTag: `${name} · ${city}`,
    fields: {
      ...defaultProjectModalContent.fields,
      phonePlaceholder: phone,
      emailPlaceholder: email,
      neighborhoodPlaceholder: `e.g. Neighborhood in ${city}`,
    },
  };

  return {
    siteMetadata,
    BRAND,
    NAV_LINKS: defaultNavLinks,
    HERO_CONTENT,
    WHAT_WE_KEEP_CONTENT: defaultWhatWeKeepContent,
    transformationsSectionContent: defaultTransformationsSectionContent,
    TRANSFORMATIONS_CONTENT: defaultTransformationsContent,
    FLOOR_PLAN_CONTENT: defaultFloorPlanContent,
    MATERIAL_TABLE_CONTENT: defaultMaterialTableContent,
    PEOPLE_CONTENT: defaultPeopleContent,
    FINAL_CTA_CONTENT,
    FOOTER_CONTENT,
    PROJECT_MODAL_CONTENT,
  };
}

export type { NavLink, KeepDetail, TransformationItem, FloorPlanRoom, MaterialSample };
