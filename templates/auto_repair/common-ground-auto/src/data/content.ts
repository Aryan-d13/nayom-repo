import rawSiteData from "../../site-data.json";
import {
  adaptAutoRepairContent,
  SymptomItem,
  FocusZone,
  ServiceItem,
} from "./adapter";

const adapted = adaptAutoRepairContent(rawSiteData as any);

export const businessInfo = adapted.businessInfo;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const symptomsContent = adapted.symptomsContent;
export const diagnosisContent = adapted.diagnosisContent;
export const shopContent = adapted.shopContent;
export const servicesContent = adapted.servicesContent;
export const handoffContent = adapted.handoffContent;
export const bookingContent = adapted.bookingContent;
export const footerContent = adapted.footerContent;

export type { SymptomItem, FocusZone, ServiceItem };
