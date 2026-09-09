import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptElectricContent,
  DiagnosticItem,
  RoomZone,
  ProjectItem,
  TrustStatement,
} from "./adapter";

const adapted = adaptElectricContent(
  rawSiteData as unknown as Partial<CanonicalSiteData>
);

export const businessInfo = adapted.businessInfo;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const diagnosticContent = adapted.diagnosticContent;
export const roomServicesContent = adapted.roomServicesContent;
export const philosophyContent = adapted.philosophyContent;
export const projectCollageContent = adapted.projectCollageContent;
export const trustContent = adapted.trustContent;
export const finalLightsOnContent = adapted.finalLightsOnContent;
export const footerContent = adapted.footerContent;
export const bookingDrawerContent = adapted.bookingDrawerContent;

export type { DiagnosticItem, RoomZone, ProjectItem, TrustStatement };
