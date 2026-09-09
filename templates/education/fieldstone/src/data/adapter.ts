import { CanonicalSiteData } from "./canonical";
import {
  Interest,
  DayMoment,
  CampusLocation,
  PhilosophyPillar,
  AdmissionAction,
  defaultSchoolInfo,
  defaultSiteMetadata,
  defaultNavbarContent,
  defaultHeroPhotos,
  defaultHeroContent,
  defaultInterests,
  defaultInterestsContent,
  defaultDayMoments,
  defaultDayContent,
  defaultCampusLocations,
  defaultCampusContent,
  defaultPhilosophyPillars,
  defaultPhilosophyContent,
  defaultAdmissionActions,
  defaultAdmissionsContent,
  defaultFinalMomentContent,
  defaultFooterContent,
  defaultVisitModalContent,
} from "./defaultContent";

export interface AdaptedFieldstoneContent {
  schoolInfo: typeof defaultSchoolInfo;
  siteMetadata: typeof defaultSiteMetadata;
  navbarContent: typeof defaultNavbarContent;
  heroPhotos: typeof defaultHeroPhotos;
  heroContent: typeof defaultHeroContent;
  interests: Interest[];
  interestsContent: typeof defaultInterestsContent;
  dayMoments: DayMoment[];
  dayContent: typeof defaultDayContent;
  campusLocations: CampusLocation[];
  campusContent: typeof defaultCampusContent;
  philosophyPillars: PhilosophyPillar[];
  philosophyContent: typeof defaultPhilosophyContent;
  admissionActions: AdmissionAction[];
  admissionsContent: typeof defaultAdmissionsContent;
  finalMomentContent: typeof defaultFinalMomentContent;
  footerContent: typeof defaultFooterContent;
  visitModalContent: typeof defaultVisitModalContent;
}

export function adaptFieldstoneContent(
  raw: Partial<CanonicalSiteData> | null | undefined
): AdaptedFieldstoneContent {
  const data = raw || {};

  const businessName = data.business_name || defaultSchoolInfo.name;
  const phone = data.phone || defaultSchoolInfo.phone;
  const email = data.email || defaultSchoolInfo.email;
  const address = data.address || defaultSchoolInfo.address;
  const hours = data.hours || defaultSchoolInfo.hours;

  const cityState = [data.city, data.state].filter(Boolean).join(", ");
  const fullLoc = cityState
    ? data.country && data.country !== "US"
      ? `${cityState}, ${data.country}`
      : cityState
    : defaultSchoolInfo.location;

  const schoolInfo = {
    ...defaultSchoolInfo,
    name: businessName.toUpperCase(),
    subname: data.tagline || defaultSchoolInfo.subname,
    location: fullLoc,
    locationShort: cityState || defaultSchoolInfo.locationShort,
    postcode: [cityState, data.postal_code].filter(Boolean).join(" ") || defaultSchoolInfo.postcode,
    phone,
    email,
    address,
    hours,
    copyright: `© ${new Date().getFullYear()} ${businessName}`,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title:
      data.meta_title ||
      `${businessName} | ${cityState || "K–12"} — Come Curious`,
    description: data.meta_description || defaultSiteMetadata.description,
    authors: [{ name: businessName }],
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: data.meta_title || `${businessName} — Come Curious`,
      description: data.meta_description || defaultSiteMetadata.description,
      siteName: businessName,
      type: "website" as const,
    },
  };

  const navbarContent = {
    ...defaultNavbarContent,
    brand: businessName.toUpperCase(),
    subBrand: cityState ? `${cityState} · K–12` : defaultNavbarContent.subBrand,
    mobileFooter: `${phone} · ${cityState || defaultSchoolInfo.locationShort}`,
  };

  const heroPhotos = defaultHeroPhotos;

  const heroContent = {
    ...defaultHeroContent,
    topBadge: cityState ? `${cityState.toUpperCase()} / K–12` : defaultHeroContent.topBadge,
    serifSubheading: data.tagline || defaultHeroContent.serifSubheading,
    bodyCopy: data.hero?.subheadline || defaultHeroContent.bodyCopy,
    primaryCta: data.hero?.primary_cta_text || defaultHeroContent.primaryCta,
    secondaryCta: data.hero?.secondary_cta_text || defaultHeroContent.secondaryCta,
    bottomBar: {
      ...defaultHeroContent.bottomBar,
      location: [cityState, data.postal_code].filter(Boolean).join(" ") || defaultHeroContent.bottomBar.location,
    },
  };

  if (data.hero?.headline) {
    const parts = data.hero.headline.trim().split(" ");
    if (parts.length > 1) {
      heroContent.headingMain = parts[0].toUpperCase();
      heroContent.headingAccent = parts.slice(1).join(" ").toUpperCase();
    } else {
      heroContent.headingMain = parts[0].toUpperCase();
      heroContent.headingAccent = "";
    }
  }

  const interests: Interest[] =
    data.offerings && data.offerings.length > 0
      ? data.offerings.slice(0, 8).map((offering, idx) => {
          const fallback = defaultInterests[idx % defaultInterests.length];
          return {
            id: offering.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || fallback.id,
            name: offering.name.toUpperCase(),
            subtitle: offering.description || fallback.subtitle,
            image: offering.image_url || fallback.image,
            alt: `${offering.name} at ${businessName}`,
            color: fallback.color,
            quote: fallback.quote,
          };
        })
      : defaultInterests;

  const interestsContent = {
    ...defaultInterestsContent,
    interests,
  };

  const dayMoments = defaultDayMoments;
  const dayContent = {
    ...defaultDayContent,
    moments: dayMoments,
  };

  const campusLocations = defaultCampusLocations;
  const campusContent = {
    ...defaultCampusContent,
    eyebrow: `${address} · ${cityState || "Campus"}`,
    locations: campusLocations,
  };

  const philosophyPillars: PhilosophyPillar[] =
    data.values && data.values.length > 0
      ? data.values.slice(0, 3).map((val, idx) => ({
          id: `pillar-${idx + 1}`,
          title: val.title.toUpperCase(),
          subtitle: val.description,
        }))
      : defaultPhilosophyPillars;

  const philosophyContent = {
    ...defaultPhilosophyContent,
    pillars: philosophyPillars,
  };

  const admissionActions = defaultAdmissionActions;
  const admissionsContent = {
    ...defaultAdmissionsContent,
    eyebrow: `Admissions · ${cityState || defaultSchoolInfo.locationShort}`,
    bottomPhone: phone,
  };

  const finalMomentContent = {
    ...defaultFinalMomentContent,
    brand: businessName.toUpperCase(),
    tagline: `${cityState || "Campus"} · 3:31 PM`,
  };

  const footerContent = {
    ...defaultFooterContent,
    name: businessName.toUpperCase(),
    tagline: data.tagline || defaultFooterContent.tagline,
    lead:
      data.meta_description ||
      `An independent school for students who like to ask why. Where mistakes are welcomed and questions are pursued.`,
    address,
    location: fullLoc,
    phone,
    email,
    hours,
    copyright: `© ${new Date().getFullYear()} ${businessName}`,
  };

  const visitModalContent = {
    ...defaultVisitModalContent,
    badge: `${businessName.toUpperCase()} ADMISSIONS · ${(data.city || "CAMPUS").toUpperCase()}`,
    labels: {
      ...defaultVisitModalContent.labels,
      directCall: `Call directly: ${phone}`,
    },
  };

  return {
    schoolInfo,
    siteMetadata,
    navbarContent,
    heroPhotos,
    heroContent,
    interests,
    interestsContent,
    dayMoments,
    dayContent,
    campusLocations,
    campusContent,
    philosophyPillars,
    philosophyContent,
    admissionActions,
    admissionsContent,
    finalMomentContent,
    footerContent,
    visitModalContent,
  };
}
