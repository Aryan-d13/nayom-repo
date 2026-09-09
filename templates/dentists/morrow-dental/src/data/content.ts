import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptMorrowDentalContent,
  TreatmentNote,
  PhilosophyPillar,
  DetailImage,
} from "./adapter";

const adapted = adaptMorrowDentalContent(
  rawSiteData as unknown as Partial<CanonicalSiteData>
);

export const siteMetadata = adapted.siteMetadata;
export const clinicData = adapted.clinicData;
export const navbarContent = adapted.navbarContent;
export const heroContent = adapted.heroContent;
export const philosophyContent = adapted.philosophyContent;
export const treatmentsData = adapted.treatmentsData;
export const treatmentsContent = adapted.treatmentsContent;
export const consultationContent = adapted.consultationContent;
export const detailsContent = adapted.detailsContent;
export const doctorContent = adapted.doctorContent;
export const finalCtaContent = adapted.finalCtaContent;
export const footerContent = adapted.footerContent;
export const bookingModalContent = adapted.bookingModalContent;

export type { TreatmentNote, PhilosophyPillar, DetailImage };
