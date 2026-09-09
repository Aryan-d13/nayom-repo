import { CanonicalSiteData } from "./canonical";
import {
  defaultSiteMetadata,
  defaultCompany,
  defaultNavbarContent,
  defaultHeroContent,
  defaultSmallProblemsContent,
  defaultSmallProblems,
  defaultInteractiveHouseContent,
  defaultRoomStories,
  defaultHouseRooms,
  defaultLeakDetectionContent,
  defaultEmergencyStripContent,
  defaultDialogueProcessContent,
  defaultConversationSteps,
  defaultProjectCollageContent,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultBookingModalContent,
  ServiceProblem,
  HouseRoom,
  RoomData,
  ProjectItem,
} from "./defaultContent";

export function adaptGoodflowContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultCompany.name;
  const city = contact?.city || "Portland";
  const state = contact?.state || "Oregon";
  const phone = contact?.phone || defaultCompany.phone;
  const phoneRaw = contact?.raw_phone ? `tel:${contact.raw_phone}` : defaultCompany.phoneRaw;
  const email = contact?.email || defaultCompany.email;
  const tagline = identity?.tagline || defaultCompany.tagline;

  const COMPANY = {
    ...defaultCompany,
    name: name.toUpperCase(),
    shortName: identity?.short_name || name,
    city: `${city}, ${state}`,
    tagline,
    phone,
    phoneRaw,
    email,
    serviceAreas: contact?.service_areas && contact.service_areas.length > 0 ? contact.service_areas : defaultCompany.serviceAreas,
    services:
      offerings && offerings.length > 0
        ? offerings.slice(0, 5).map((o) => o.name)
        : defaultCompany.services,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name} — ${city}, ${state} Residential Plumbing`,
    description: `${tagline} Everyday residential repairs, drain cleaning, water heaters, and leak detection in ${city}, ${state}.`,
    author: name,
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: `${name} — ${city}, ${state} Residential Plumbing`,
      description: `${tagline} Everyday residential repairs, drain cleaning, water heaters, and leak detection in ${city}, ${state}.`,
    },
  };

  const navbarContent = {
    ...defaultNavbarContent,
    locationTag: `${city}, ${state.slice(0, 2).toUpperCase()}`,
    bookButtonLabel: editorial?.primary_cta?.text || defaultNavbarContent.bookButtonLabel,
  };

  const headlineWords = editorial?.headline ? editorial.headline.split(" ") : [];
  const midPoint = Math.ceil(headlineWords.length / 2);

  const heroContent = {
    ...defaultHeroContent,
    eyebrow: `${city.toUpperCase()}, ${state.toUpperCase()} RESIDENTIAL PLUMBING`,
    headlineLine1: headlineWords.length > 0 ? headlineWords.slice(0, midPoint).join(" ") : defaultHeroContent.headlineLine1,
    headlineLine2: headlineWords.length > 0 ? headlineWords.slice(midPoint).join(" ") : defaultHeroContent.headlineLine2,
    serifSentence: editorial?.value_proposition || defaultHeroContent.serifSentence,
    supportingCopy: editorial?.subheadline || identity?.description || defaultHeroContent.supportingCopy,
    primaryCta: editorial?.primary_cta?.text || defaultHeroContent.primaryCta,
    secondaryCta: editorial?.secondary_cta?.text || defaultHeroContent.secondaryCta,
    image: {
      ...defaultHeroContent.image,
      src: heroAsset?.url_or_path || defaultHeroContent.image.src,
    },
  };

  const interactiveHouseContent = {
    ...defaultInteractiveHouseContent,
    residenceLabel: `${city.toUpperCase()} RESIDENCE`,
  };

  const emergencyStripContent = {
    ...defaultEmergencyStripContent,
    badge: `CALL ${name.toUpperCase()} · URGENT ASSISTANCE`,
  };

  const finalCtaContent = {
    ...defaultFinalCtaContent,
    serifLine: editorial?.value_proposition || defaultFinalCtaContent.serifLine,
    description: editorial?.subheadline || identity?.description || defaultFinalCtaContent.description,
    ctaLabel: editorial?.primary_cta?.text || defaultFinalCtaContent.ctaLabel,
    image: {
      ...defaultFinalCtaContent.image,
      captionLeft: `${city.toUpperCase()} MORNING`,
    },
  };

  const footerContent = {
    ...defaultFooterContent,
    description: identity?.description || defaultFooterContent.description,
    copyright: `© ${new Date().getFullYear()} ${name}. ${tagline}`,
    locationNote: `${city}, ${state} Residential Plumbing`,
  };

  const bookingModalContent = {
    ...defaultBookingModalContent,
    eyebrow: `${name.toUpperCase()} SERVICE REQUEST`,
    phonePlaceholder: phone,
    addressPlaceholder: `e.g. ${city} Neighborhood / Zip`,
    confirmedMessage: {
      ...defaultBookingModalContent.confirmedMessage,
      defaultAddress: city,
      part3: `A ${name} plumber will ring you at`,
    },
  };

  return {
    siteMetadata,
    COMPANY,
    navbarContent,
    heroContent,
    smallProblemsContent: defaultSmallProblemsContent,
    SMALL_PROBLEMS: defaultSmallProblems,
    interactiveHouseContent,
    ROOM_STORIES: defaultRoomStories,
    HOUSE_ROOMS: defaultHouseRooms,
    leakDetectionContent: defaultLeakDetectionContent,
    emergencyStripContent,
    dialogueProcessContent: defaultDialogueProcessContent,
    CONVERSATION_STEPS: defaultConversationSteps,
    projectCollageContent: defaultProjectCollageContent,
    REAL_PROJECTS: defaultProjectCollageContent.projects,
    finalCtaContent,
    footerContent,
    bookingModalContent,
  };
}

export type { ServiceProblem, HouseRoom, RoomData, ProjectItem };
