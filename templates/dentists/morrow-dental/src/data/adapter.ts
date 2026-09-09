import { CanonicalSiteData } from "./canonical";
import {
  defaultSiteMetadata,
  defaultClinicData,
  defaultNavbarContent,
  defaultHeroContent,
  defaultPhilosophyContent,
  defaultTreatmentsData,
  defaultTreatmentsContent,
  defaultConsultationContent,
  defaultDetailsContent,
  defaultDoctorContent,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultBookingModalContent,
  TreatmentNote,
  PhilosophyPillar,
  DetailImage,
} from "./defaultContent";

export function adaptMorrowDentalContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const seo = siteData?.seo;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultClinicData.name;
  const shortName = identity?.short_name || name.split(" ")[0] || defaultClinicData.shortName;
  const city = contact?.city || defaultClinicData.city;
  const state = contact?.state || defaultClinicData.state;
  const address = contact?.address || defaultClinicData.address;
  const phone = contact?.phone || defaultClinicData.phone;
  const phoneRaw = contact?.raw_phone || defaultClinicData.phoneRaw;
  const email = contact?.email || defaultClinicData.email;
  const hours = contact?.hours || defaultClinicData.hours;
  const tagline = identity?.tagline || defaultClinicData.tagline;

  const clinicData = {
    ...defaultClinicData,
    name,
    shortName,
    city,
    state,
    tagline,
    address: contact?.address ? `${contact.address}, ${city}` : defaultClinicData.address,
    cityStateZip: `${city}, ${state} ${contact?.postal_code || ""}`.trim(),
    phone,
    phoneRaw,
    email,
    hours,
    copyright: `© ${new Date().getFullYear()} ${name}`,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: seo?.title || `${name} — ${tagline} | ${city}`,
    description: seo?.meta_description || identity?.description || defaultSiteMetadata.description,
  };

  const heroContent = {
    ...defaultHeroContent,
    locationLabel: city.toUpperCase(),
    clinicLabel: name.toUpperCase(),
    headlineWords: editorial?.headline ? editorial.headline.toUpperCase().split(" ") : defaultHeroContent.headlineWords,
    serifLine: editorial?.value_proposition || defaultHeroContent.serifLine,
    copy: editorial?.subheadline || identity?.description || defaultHeroContent.copy,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const adaptedTreatments: TreatmentNote[] =
    offerings && offerings.length > 0
      ? offerings.slice(0, 6).map((o, i) => ({
          id: o.id,
          title: o.name.toUpperCase(),
          sentence: o.summary || `Specialized ${o.name.toLowerCase()} care designed around everyday life.`,
          annotation: o.category?.toLowerCase() || "care",
          image: defaultTreatmentsData[i % defaultTreatmentsData.length]?.image || defaultTreatmentsData[0].image,
          secondaryCrop: defaultTreatmentsData[i % defaultTreatmentsData.length]?.secondaryCrop || defaultTreatmentsData[0].secondaryCrop,
          alt: `${o.name} treatment`,
        }))
      : defaultTreatmentsData;

  const finalCtaContent = {
    ...defaultFinalCtaContent,
    eyebrow: `${city.toUpperCase()} · ${shortName.toUpperCase()} STUDIO`,
    phone,
    address,
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: shortName.toUpperCase(),
    tagline,
    locationLabel: `${city.toUpperCase()} · ${state.toUpperCase()}`,
    addressLine1: address,
    addressLine2: `${city}, ${state} ${contact?.postal_code || ""}`.trim(),
    hours,
    phone,
    email,
    copyright: `© ${new Date().getFullYear()} ${name}`,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    callDirectLabel: `Or call directly: ${phone}`,
  };

  return {
    siteMetadata,
    clinicData,
    navbarContent: defaultNavbarContent,
    heroContent,
    philosophyContent: defaultPhilosophyContent,
    treatmentsData: adaptedTreatments,
    treatmentsContent: defaultTreatmentsContent,
    consultationContent: defaultConsultationContent,
    detailsContent: defaultDetailsContent,
    doctorContent: defaultDoctorContent,
    finalCtaContent,
    footerContent,
    bookingModalContent,
  };
}

export type { TreatmentNote, PhilosophyPillar, DetailImage };
