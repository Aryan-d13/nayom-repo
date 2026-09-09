import { CanonicalSiteData } from "./canonical";
import {
  defaultSiteMetadata,
  defaultFirmInfo,
  defaultNavbarContent,
  defaultHeroContent,
  defaultFinePrintContent,
  defaultFinePrintItems,
  defaultPracticeIndexContent,
  defaultPracticeAreas,
  defaultPeopleContent,
  defaultPartners,
  defaultPartnerModalContent,
  defaultDocumentMomentContent,
  defaultDocumentChoices,
  defaultFinalCtaContent,
  defaultFooterContent,
  defaultContactDrawerContent,
  defaultNavLinks,
  PracticeArea,
  Partner,
  DocumentChoice,
} from "./defaultContent";

export function adaptHaleMercerContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;
  const assets = siteData?.assets || [];

  const heroAsset = assets.find((a) => a.kind === "hero");

  const name = identity?.name || defaultFirmInfo.name;
  const city = contact?.city || "New York City";
  const state = contact?.state || "NY";
  const address = contact?.address || "245 Madison Avenue";
  const fullAddress = `${address}, ${city}, ${state}`;
  const phone = contact?.phone || defaultFirmInfo.phone;
  const email = contact?.email || defaultFirmInfo.email;
  const tagline = identity?.tagline || defaultFirmInfo.tagline;

  const FIRM_INFO = {
    ...defaultFirmInfo,
    name: name.toUpperCase(),
    location: city,
    address: fullAddress,
    phone,
    email,
    tagline,
    subTagline: editorial?.value_proposition || defaultFirmInfo.subTagline,
    heroSupporting: editorial?.subheadline || identity?.description || defaultFirmInfo.heroSupporting,
    primaryCta: editorial?.primary_cta?.text || defaultFirmInfo.primaryCta,
    secondaryCta: editorial?.secondary_cta?.text || defaultFirmInfo.secondaryCta,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name} | Attorneys at Law — ${city}`,
    description: identity?.description || defaultSiteMetadata.description,
    author: name,
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: `${name} | Attorneys at Law — ${city}`,
      description: identity?.description || defaultSiteMetadata.openGraph.description,
    },
  };

  const heroContent = {
    ...defaultHeroContent,
    eyebrow: `${name.toUpperCase()} ${city.toUpperCase()}`,
    headline: editorial?.headline?.toUpperCase() || defaultHeroContent.headline,
    bottomMarginLeft: `CHAMBERS: ${address.toUpperCase()}`,
    image: {
      ...defaultHeroContent.image,
      src: heroAsset?.url_or_path || defaultHeroContent.image.src,
      location: `${city.toUpperCase()}, ${state.toUpperCase()}`,
    },
  };

  const PRACTICE_AREAS: PracticeArea[] =
    offerings && offerings.length > 0
      ? offerings.slice(0, 4).map((offering, idx) => {
          const defaultArea = defaultPracticeAreas[idx] || defaultPracticeAreas[0];
          return {
            id: offering.id || defaultArea.id,
            name: offering.name.toUpperCase(),
            summary: offering.summary || defaultArea.summary,
            detail: offering.features ? offering.features.join(". ") : defaultArea.detail,
            image: defaultArea.image,
            clauses: offering.features && offering.features.length > 0 ? offering.features : defaultArea.clauses,
          };
        })
      : defaultPracticeAreas;

  const footerContent = {
    ...defaultFooterContent,
    jurisdictionNote: `Practicing in the State of ${state}. Consultations arranged by appointment at our ${address} offices or by direct secure video link.`,
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
  };

  const contactDrawerContent = {
    ...defaultContactDrawerContent,
    contactPlaceholder: `${phone} or ${email}`,
  };

  return {
    siteMetadata,
    FIRM_INFO,
    navbarContent: defaultNavbarContent,
    heroContent,
    finePrintContent: defaultFinePrintContent,
    FINE_PRINT_ITEMS: defaultFinePrintItems,
    practiceIndexContent: defaultPracticeIndexContent,
    PRACTICE_AREAS,
    peopleContent: defaultPeopleContent,
    PARTNERS: defaultPartners,
    partnerModalContent: defaultPartnerModalContent,
    documentMomentContent: defaultDocumentMomentContent,
    DOCUMENT_CHOICES: defaultDocumentChoices,
    finalCtaContent: defaultFinalCtaContent,
    footerContent,
    contactDrawerContent,
    NAV_LINKS: defaultNavLinks,
  };
}

export type { PracticeArea, Partner, DocumentChoice };
