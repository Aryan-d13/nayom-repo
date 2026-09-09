import { CanonicalSiteData } from "./canonical";
import {
  defaultSiteMetadata,
  defaultClinicInfo,
  defaultNavbarContent,
  defaultHeroContent,
  defaultBetterVisitContent,
  defaultTreatmentsData,
  defaultTreatmentsContent,
  defaultTheRoomContent,
  defaultTeamContent,
  defaultFinalCtaContent,
  navLinks,
  footerLinks,
  defaultFooterContent,
  defaultBookingModalContent,
  Treatment,
} from "./defaultContent";

export function adaptDentalContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const seo = siteData?.seo;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultClinicInfo.name;
  const shortName = identity?.short_name || name.split(" ")[0] || defaultClinicInfo.shortName;
  const city = contact?.city || "Chicago";
  const state = contact?.state || "Illinois";
  const address = contact?.address || defaultClinicInfo.address;
  const fullAddress = address && city ? `${address}, ${city}` : defaultClinicInfo.fullAddress;
  const phone = contact?.phone || defaultClinicInfo.phone;
  const phoneRaw = contact?.raw_phone || defaultClinicInfo.phoneRaw;
  const email = contact?.email || defaultClinicInfo.email;
  const hours = contact?.hours || defaultClinicInfo.hours;
  const tagline = identity?.tagline || defaultClinicInfo.tagline;

  const clinicInfo = {
    ...defaultClinicInfo,
    name,
    shortName,
    tagline,
    location: `${city}, ${state}`,
    address,
    cityStateZip: `${city}, ${state} ${contact?.postal_code || ""}`.trim(),
    fullAddress,
    phone,
    phoneRaw,
    email,
    hours,
    copyright: `© ${new Date().getFullYear()} ${name}`,
  };

  const siteMetadata = {
    title: seo?.title || `${name} · ${city} · Care, considered.`,
    description: seo?.meta_description || identity?.description || defaultSiteMetadata.description,
    keywords:
      seo?.keywords && seo.keywords.length > 0
        ? seo.keywords
        : [
            name,
            `Dentist ${city}`,
            "General Dentistry",
            "Cosmetic Dentistry",
            `Invisalign ${city}`,
            "Restorative Dentistry",
          ],
  };

  const heroContent = {
    ...defaultHeroContent,
    eyebrow: `${name.toUpperCase()} / ${city.toUpperCase()}`,
    headlineLine1: editorial?.headline ? editorial.headline.split(" ")[0] : defaultHeroContent.headlineLine1,
    headlineLine2: editorial?.headline ? editorial.headline.split(" ").slice(1).join(" ") : defaultHeroContent.headlineLine2,
    subheadingSerif: editorial?.value_proposition || defaultHeroContent.subheadingSerif,
    copy: editorial?.subheadline || identity?.description || defaultHeroContent.copy,
    cta: editorial?.primary_cta?.text || defaultHeroContent.cta,
    secondaryPhone: phone,
    verticalBadge: `EST. IN ${city.toUpperCase()}`,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const adaptedTreatments: Treatment[] =
    offerings && offerings.length > 0
      ? offerings.slice(0, 6).map((o, i) => ({
          id: o.id,
          title: o.name.toUpperCase(),
          description: o.summary || `Specialized ${o.name.toLowerCase()} care.`,
          image: defaultTreatmentsData[i % defaultTreatmentsData.length]?.image || defaultTreatmentsData[0].image,
          alt: `${o.name} treatment`,
        }))
      : defaultTreatmentsData;

  const treatmentsContent = {
    ...defaultTreatmentsContent,
    disciplineCount: `0${adaptedTreatments.length} Disciplines`,
  };

  const finalCtaContent = {
    ...defaultFinalCtaContent,
    phone,
    address,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    eyebrow: `${name} · ${city}`,
    topics:
      offerings && offerings.length > 0
        ? offerings.slice(0, 5).map((o) => o.name)
        : defaultBookingModalContent.topics,
    callPrompt: `Prefer to talk now? Call ${phone}`,
  };

  return {
    siteMetadata,
    clinicInfo,
    navbarContent: defaultNavbarContent,
    heroContent,
    betterVisitContent: defaultBetterVisitContent,
    treatmentsData: adaptedTreatments,
    treatmentsContent,
    theRoomContent: defaultTheRoomContent,
    teamContent: defaultTeamContent,
    finalCtaContent,
    navLinks,
    footerLinks,
    footerContent: defaultFooterContent,
    bookingModalContent,
  };
}

export type { Treatment };
