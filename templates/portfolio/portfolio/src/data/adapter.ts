import { CanonicalSiteData } from "./canonical";
import {
  defaultPersonalInfo,
  defaultSiteMetadata,
  defaultNavigationContent,
  defaultHeroContent,
  defaultInterruptionThoughts,
  defaultRabbitHolesContent,
  defaultWorkContent,
  defaultBuildContent,
  defaultWritingContent,
  defaultPhysicsContent,
  defaultOutsideScreenContent,
  defaultAboutContent,
  defaultFutureContent,
  defaultContactContent,
  defaultFooterContent,
  defaultThoughtCursorContent,
  RabbitHoleItem,
  Project,
  BuildStep,
  WritingPiece,
  SocialLink,
} from "./defaultContent";

export function adaptPortfolioContent(siteData?: Partial<CanonicalSiteData> | null) {
  const identity = siteData?.identity;
  const contact = siteData?.contact;
  const editorial = siteData?.editorial;
  const offerings = siteData?.offerings;

  const name = identity?.name || defaultPersonalInfo.name;
  const tagline = identity?.tagline || defaultPersonalInfo.tagline;
  const email = contact?.email || defaultPersonalInfo.email;

  const socialLinks: SocialLink[] = contact?.social_links
    ? Object.entries(contact.social_links).map(([k, v]) => ({
        label: k.toUpperCase(),
        url: v,
      }))
    : defaultPersonalInfo.socialLinks;

  const personalInfo = {
    ...defaultPersonalInfo,
    name,
    nameUppercase: name.toUpperCase(),
    tagline,
    shortRole: identity?.description || defaultPersonalInfo.shortRole,
    email,
    currentStatus: editorial?.subheadline || defaultPersonalInfo.currentStatus,
    copyrightYear: `${new Date().getFullYear()}`,
    socialLinks,
  };

  const siteMetadata = {
    ...defaultSiteMetadata,
    title: `${name} — ${tagline}`,
    description: identity?.description || defaultSiteMetadata.description,
    authors: [{ name }],
    openGraph: {
      ...defaultSiteMetadata.openGraph,
      title: `${name} — ${tagline}`,
      description: identity?.description || defaultSiteMetadata.openGraph.description,
      type: "website" as const,
    },
  };

  const navigationContent = {
    ...defaultNavigationContent,
    brand: name,
    subtitle: tagline,
  };

  const headlineWords = editorial?.headline ? editorial.headline.split(" ") : [];
  const heroContent = {
    ...defaultHeroContent,
    sparseName: name,
    sparseRole: tagline,
    statementLine1: headlineWords[0] || defaultHeroContent.statementLine1,
    statementLine2: headlineWords[1] || defaultHeroContent.statementLine2,
    statementLine3: headlineWords.slice(2).join(" ") || defaultHeroContent.statementLine3,
    counterStatement: editorial?.value_proposition || defaultHeroContent.counterStatement,
    currentStatus: editorial?.subheadline || defaultHeroContent.currentStatus,
    exploreCta: editorial?.primary_cta?.text || defaultHeroContent.exploreCta,
  };

  const workContent = {
    ...defaultWorkContent,
    projects:
      offerings && offerings.length > 0
        ? offerings.map((o, idx) => {
            const fallback = defaultWorkContent.projects[idx] || defaultWorkContent.projects[0];
            return {
              id: o.id || fallback.id,
              num: `0${idx + 1}`,
              title: o.name.toUpperCase(),
              oneLiner: o.summary || fallback.oneLiner,
              year: `${new Date().getFullYear()}`,
              image: fallback.image,
              tryingToDo: o.summary || fallback.tryingToDo,
              learned: fallback.learned,
              tags: o.features && o.features.length > 0 ? o.features : fallback.tags,
            };
          })
        : defaultWorkContent.projects,
  };

  const aboutContent = {
    ...defaultAboutContent,
    name: name.toUpperCase(),
    bioParagraphs: identity?.description
      ? [identity.description, defaultAboutContent.bioParagraphs[1]]
      : defaultAboutContent.bioParagraphs,
  };

  const contactContent = {
    ...defaultContactContent,
    email,
  };

  const footerContent = {
    ...defaultFooterContent,
    copyrightName: name.toUpperCase(),
    copyrightYear: `© ${new Date().getFullYear()}`,
  };

  return {
    personalInfo,
    siteMetadata,
    navigationContent,
    heroContent,
    interruptionThoughts: defaultInterruptionThoughts,
    rabbitHolesContent: defaultRabbitHolesContent,
    workContent,
    buildContent: defaultBuildContent,
    writingContent: defaultWritingContent,
    physicsContent: defaultPhysicsContent,
    outsideScreenContent: defaultOutsideScreenContent,
    aboutContent,
    futureContent: defaultFutureContent,
    contactContent,
    footerContent,
    thoughtCursorContent: defaultThoughtCursorContent,
  };
}

export type { RabbitHoleItem, Project, BuildStep, WritingPiece, SocialLink };
