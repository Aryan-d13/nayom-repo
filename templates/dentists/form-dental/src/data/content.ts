import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import { adaptDentalContent, Treatment } from "./adapter";

const adapted = adaptDentalContent(rawSiteData as unknown as Partial<CanonicalSiteData>);

export const siteMetadata = adapted.siteMetadata;
export const clinicInfo = adapted.clinicInfo;
export const navbarContent = adapted.navbarContent;
export const heroContent = adapted.heroContent;
export const betterVisitContent = adapted.betterVisitContent;
export const treatmentsData = adapted.treatmentsData;
export const treatmentsContent = adapted.treatmentsContent;
export const theRoomContent = adapted.theRoomContent;
export const teamContent = adapted.teamContent;
export const finalCtaContent = adapted.finalCtaContent;
export const navLinks = adapted.navLinks;
export const footerLinks = adapted.footerLinks;
export const footerContent = adapted.footerContent;
export const bookingModalContent = adapted.bookingModalContent;

export type { Treatment };
