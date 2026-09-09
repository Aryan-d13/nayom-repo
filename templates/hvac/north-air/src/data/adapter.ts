import { CanonicalSiteData } from "./canonical";
import {
  defaultCompanyInfo,
  defaultNavigationContent,
  defaultHeroContent,
  defaultTemperatureRoomContent,
  defaultHouseWeatherContent,
  defaultSymptomsContent,
  defaultTechnicianLoupeContent,
  defaultServiceAtmospheresContent,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultBookingModalContent,
  Room,
  Symptom,
  Atmosphere,
} from "./defaultContent";

export function adaptNorthAirContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultCompanyInfo.brand;
  const city = contact?.city || "Nashville";
  const state = contact?.state || "Tennessee";
  const phone = contact?.phone || defaultCompanyInfo.phone;
  const phoneRaw = contact?.raw_phone || defaultCompanyInfo.phoneRaw;
  const phoneTel = contact?.raw_phone ? `tel:${contact.raw_phone}` : defaultCompanyInfo.phoneTel;
  const email = contact?.email || defaultCompanyInfo.email;
  const emailHref = contact?.email ? `mailto:${contact.email}` : defaultCompanyInfo.emailHref;
  const hours = contact?.hours || defaultCompanyInfo.hours;
  const tagline = identity?.tagline || defaultCompanyInfo.tagline;

  const companyInfo = {
    ...defaultCompanyInfo,
    brand: name.toUpperCase(),
    name,
    tagline,
    location: `${city}, ${state}`,
    shortLocation: `${city}, ${state}`,
    phone,
    phoneRaw,
    phoneTel,
    email,
    emailHref,
    hours,
    copyright: `© ${new Date().getFullYear()} ${name}. Heating & Cooling.`,
  };

  const navigationContent = {
    ...defaultNavigationContent,
    logo: name.toUpperCase(),
    phone,
    mobileLocation: `${city}, ${state}`,
    mobileCall: `CALL ${phone}`,
    mobileTagline: tagline,
    bookCta: editorial?.primary_cta?.text || defaultNavigationContent.bookCta,
  };

  const words = editorial?.headline ? editorial.headline.toUpperCase().split(" ") : [];

  const heroContent = {
    ...defaultHeroContent,
    locationLabel: `${city.toUpperCase()} / HEATING + COOLING`,
    headlineWord1: words[0] || defaultHeroContent.headlineWord1,
    headlineWord2: words[1] || defaultHeroContent.headlineWord2,
    headlineWord3: words.slice(2).join(" ") || defaultHeroContent.headlineWord3,
    serifItalic: editorial?.value_proposition || defaultHeroContent.serifItalic,
    bodyCopy: editorial?.subheadline || identity?.description || defaultHeroContent.bodyCopy,
    bookCta: editorial?.primary_cta?.text || defaultHeroContent.bookCta,
    phoneCta: phone,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const symptomsContent = {
    ...defaultSymptomsContent,
    phone,
  };

  const finalCtaContent = {
    ...defaultFinalCtaContent,
    bookCta: editorial?.primary_cta?.text || defaultFinalCtaContent.bookCta,
    phone,
    location: `${city}, ${state}`,
  };

  const footerContent = {
    ...defaultFooterContent,
    brand: name.toUpperCase(),
    tagline,
    officeHeader: `${city} Office`,
    location: `${city}, ${state}`,
    phone,
    email,
    hours,
    copyright: `© ${new Date().getFullYear()} ${name}. Heating & Cooling.`,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    badge: `${city.toUpperCase()} RESIDENTIAL SERVICE`,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 6).map((o) => o.name)
        : defaultBookingModalContent.services,
    form: {
      ...defaultBookingModalContent.form,
      phonePlaceholder: phone,
      addressPlaceholder: `e.g. Neighborhood in ${city}...`,
    },
    success: {
      ...defaultBookingModalContent.success,
      defaultPhone: phone,
    },
  };

  return {
    companyInfo,
    navigationContent,
    heroContent,
    temperatureRoomContent: defaultTemperatureRoomContent,
    houseWeatherContent: defaultHouseWeatherContent,
    symptomsContent,
    technicianLoupeContent: defaultTechnicianLoupeContent,
    serviceAtmospheresContent: defaultServiceAtmospheresContent,
    finalCtaContent,
    footerContent,
    bookingModalContent,
  };
}

export type { Room, Symptom, Atmosphere };
