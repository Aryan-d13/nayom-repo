import { CanonicalSiteData } from "./canonical";
import {
  defaultSiteMetadata,
  defaultBrand,
  defaultNavLinks,
  defaultHeroContent,
  defaultFirstTransformation,
  defaultRoomExplorerContent,
  defaultRoomsContent,
  defaultMaterialsSectionContent,
  defaultMaterialsContent,
  defaultProcessSectionContent,
  defaultProcessStages,
  defaultProjectStoriesSectionContent,
  defaultProjectStories,
  defaultTeamContent,
  defaultFinalTransformation,
  defaultFooterContent,
  defaultProjectModalContent,
  defaultProjectDetailModalContent,
  NavLink,
  RoomItem,
  MaterialItem,
  ProcessStage,
  ProjectStory,
} from "./defaultContent";

export function adaptSecondStoryContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultBrand.name;
  const city = contact?.city || "San Francisco";
  const state = contact?.state || "California";
  const phone = contact?.phone || defaultBrand.phone;
  const phoneRaw = contact?.raw_phone || defaultBrand.phoneRaw;
  const email = contact?.email || defaultBrand.email;
  const tagline = identity?.tagline || defaultBrand.tagline;

  const BRAND = {
    ...defaultBrand,
    name: name.toUpperCase(),
    location: `${city}, ${state}`,
    address: `${city}, ${state}`,
    phone,
    phoneRaw,
    email,
    tagline,
    primaryCTA: editorial?.primary_cta?.text || defaultBrand.primaryCTA,
    secondaryCTA: editorial?.secondary_cta?.text || defaultBrand.secondaryCTA,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name.toUpperCase()} | Residential Remodeling ${city}`,
    description: `${tagline} ${identity?.description || defaultSiteMetadata.description}`,
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: `${name.toUpperCase()} — Residential Remodeling`,
      description: `${tagline} ${city}, ${state}.`,
      type: "website" as const,
    },
  };

  const HERO_CONTENT = {
    ...defaultHeroContent,
    category: `${city.toUpperCase()} RESIDENTIAL REMODELING`,
    headline: editorial?.headline?.toUpperCase() || defaultHeroContent.headline,
    serifSubhead: editorial?.value_proposition || defaultHeroContent.serifSubhead,
    supportingText: editorial?.subheadline || identity?.description || defaultHeroContent.supportingText,
    image: heroAsset?.url_or_path || defaultHeroContent.image,
  };

  const ROOMS_CONTENT: RoomItem[] =
    offerings && offerings.length > 0
      ? offerings.slice(0, 4).map((offering, idx) => {
          const fallback = defaultRoomsContent[idx] || defaultRoomsContent[0];
          return {
            id: offering.id || fallback.id,
            title: offering.name.toUpperCase(),
            tagline: offering.summary || fallback.tagline,
            description: offering.summary || fallback.description,
            image: fallback.image,
            beforeImage: fallback.beforeImage,
            details: offering.features && offering.features.length > 0 ? offering.features : fallback.details,
          };
        })
      : defaultRoomsContent;

  const footerContent = {
    ...defaultFooterContent,
    description: identity?.description || defaultFooterContent.description,
    location: `${city}, ${state.slice(0, 2).toUpperCase()}`,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const projectModalContent = {
    ...defaultProjectModalContent,
    neighborhoods:
      contact?.service_areas && contact.service_areas.length > 0
        ? contact.service_areas
        : defaultProjectModalContent.neighborhoods,
    phonePlaceholder: phone,
    emailPlaceholder: email,
    neighborhoodLabel: `${city} Neighborhood`,
  };

  return {
    siteMetadata,
    BRAND,
    NAV_LINKS: defaultNavLinks,
    HERO_CONTENT,
    FIRST_TRANSFORMATION: defaultFirstTransformation,
    roomExplorerContent: defaultRoomExplorerContent,
    ROOMS_CONTENT,
    materialsSectionContent: defaultMaterialsSectionContent,
    MATERIALS_CONTENT: defaultMaterialsContent,
    processSectionContent: defaultProcessSectionContent,
    PROCESS_STAGES: defaultProcessStages,
    projectStoriesSectionContent: defaultProjectStoriesSectionContent,
    PROJECT_STORIES: defaultProjectStories,
    TEAM_CONTENT: defaultTeamContent,
    FINAL_TRANSFORMATION: defaultFinalTransformation,
    footerContent,
    projectModalContent,
    projectDetailModalContent: defaultProjectDetailModalContent,
  };
}

export type { NavLink, RoomItem, MaterialItem, ProcessStage, ProjectStory };
