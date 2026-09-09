import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import { adaptHaleMercerContent, PracticeArea, Partner, DocumentChoice } from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptHaleMercerContent(siteData);

export type { PracticeArea, Partner, DocumentChoice };

export const siteMetadata = adapted.siteMetadata;
export const FIRM_INFO = adapted.FIRM_INFO;
export const navbarContent = adapted.navbarContent;
export const heroContent = adapted.heroContent;
export const finePrintContent = adapted.finePrintContent;
export const FINE_PRINT_ITEMS = adapted.FINE_PRINT_ITEMS;
export const practiceIndexContent = adapted.practiceIndexContent;
export const PRACTICE_AREAS = adapted.PRACTICE_AREAS;
export const peopleContent = adapted.peopleContent;
export const PARTNERS = adapted.PARTNERS;
export const partnerModalContent = adapted.partnerModalContent;
export const documentMomentContent = adapted.documentMomentContent;
export const DOCUMENT_CHOICES = adapted.DOCUMENT_CHOICES;
export const finalCtaContent = adapted.finalCtaContent;
export const footerContent = adapted.footerContent;
export const contactDrawerContent = adapted.contactDrawerContent;
export const NAV_LINKS = adapted.NAV_LINKS;
