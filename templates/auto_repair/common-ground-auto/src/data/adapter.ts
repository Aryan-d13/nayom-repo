import { CanonicalSiteData } from "./canonical";
import {
  defaultBusinessInfo,
  defaultNavigationContent,
  defaultHeroContent,
  defaultSymptomsContent,
  defaultDiagnosisContent,
  defaultShopContent,
  defaultServicesContent,
  defaultHandoffContent,
  defaultBookingContent,
  defaultFooterContent,
  SymptomItem,
  FocusZone,
  ServiceItem,
} from "./defaultContent";

export function adaptAutoRepairContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const seo = siteData?.seo;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBusinessInfo.name;
  const shortName = identity?.short_name || name.split(" ")[0] || defaultBusinessInfo.shortName;
  const city = contact?.city || defaultBusinessInfo.city;
  const state = contact?.state || defaultBusinessInfo.state;
  const address = contact?.address || defaultBusinessInfo.address;
  const fullAddress = address && city ? `${address}, ${city}, ${state || ""}` : defaultBusinessInfo.fullAddress;
  const phone = contact?.phone || defaultBusinessInfo.phone;
  const phoneRaw = contact?.raw_phone ? `tel:${contact.raw_phone}` : defaultBusinessInfo.phoneRaw;
  const email = contact?.email || defaultBusinessInfo.email;
  const tagline = identity?.tagline || defaultBusinessInfo.tagline;
  const manifesto = identity?.description || defaultBusinessInfo.manifesto;

  const businessInfo = {
    ...defaultBusinessInfo,
    name,
    shortName,
    tagline,
    city,
    state,
    est: `${city.toUpperCase()} / INDEPENDENT AUTO`,
    shopSubtitle: `${city.toUpperCase()} / INDEPENDENT AUTO REPAIR`,
    address,
    cityStateZip: `${city}, ${state || ""} ${contact?.postal_code || ""}`.trim(),
    fullAddress,
    phone,
    phoneRaw,
    email,
    manifesto,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brandTitle: shortName.toUpperCase(),
    badge: `${city.toUpperCase()} / AUTO CARE`,
    phone,
    drawerAddress: address ? `${address}, ${city}` : defaultNavigationContent.drawerAddress,
    drawerHours: contact?.hours || defaultNavigationContent.drawerHours,
    ctaText: editorial?.primary_cta?.text || defaultNavigationContent.ctaText,
  };

  const heroContent = {
    ...defaultHeroContent,
    shopLabel: `${city.toUpperCase()} / INDEPENDENT AUTO REPAIR`,
    headline: editorial?.headline ? editorial.headline.split("?")[0] + "?" : defaultHeroContent.headline,
    subHeadline: editorial?.subheadline || defaultHeroContent.subHeadline,
    paragraph: editorial?.value_proposition || manifesto,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    secondaryCta: phone,
    secondaryPhone: phone,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  // Map canonical offerings to services items if provided
  const adaptedServiceItems: ServiceItem[] =
    offerings && offerings.length > 0
      ? offerings.slice(0, 8).map((o, i) => ({
          id: o.id,
          name: o.name.toUpperCase(),
          description: o.summary || `Professional ${o.name.toLowerCase()} services for your vehicle.`,
          image: defaultServicesContent.items[i % defaultServicesContent.items.length]?.image || "/images/symptom_engine_noise.jpg",
          alt: `${o.name} service inspection`,
          index: `0${i + 1}`,
        }))
      : defaultServicesContent.items;

  const servicesContent = {
    ...defaultServicesContent,
    items: adaptedServiceItems,
  };

  const bookingContent = {
    ...defaultBookingContent,
    shopBrand: shortName.toUpperCase(),
    submitSuccess: {
      ...defaultBookingContent.submitSuccess,
      urgentNote: `If this is urgent or your car won't move, call us at ${phone}.`,
    },
    form: {
      ...defaultBookingContent.form,
      phonePlaceholder: phone,
    },
  };

  const footerContent = {
    ...defaultFooterContent,
    brandName: name,
    tagline,
    manifesto,
    establishment: `${city.toUpperCase()} / INDEPENDENT WORKSHOP`,
    addressLine1: address,
    addressLine2: `${city}, ${state || ""} ${contact?.postal_code || ""}`.trim(),
    phone,
    email,
    hours: contact?.hours ? [contact.hours] : defaultFooterContent.hours,
    services: adaptedServiceItems.slice(0, 6).map((s) => ({
      name: s.name,
      href: "#services",
    })),
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    locationTag: `${city.toUpperCase()}, ${state?.toUpperCase() || ""}`,
  };

  return {
    businessInfo,
    navigationContent,
    heroContent,
    symptomsContent: defaultSymptomsContent,
    diagnosisContent: defaultDiagnosisContent,
    shopContent: defaultShopContent,
    servicesContent,
    handoffContent: defaultHandoffContent,
    bookingContent,
    footerContent,
  };
}

export type { SymptomItem, FocusZone, ServiceItem };
