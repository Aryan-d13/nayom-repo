import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import { adaptTemperContent, ConditionState, RoomScene, Symptom, ServiceChapter } from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptTemperContent(siteData);

export type { ConditionState, RoomScene, Symptom, ServiceChapter };

export const businessInfo = adapted.businessInfo;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const conditionsContent = adapted.conditionsContent;
export const roomsStoryContent = adapted.roomsStoryContent;
export const diagnosticsContent = adapted.diagnosticsContent;
export const servicesContent = adapted.servicesContent;
export const technicianContent = adapted.technicianContent;
export const finalCtaContent = adapted.finalCtaContent;
export const footerContent = adapted.footerContent;
export const temperatureBadgeContent = adapted.temperatureBadgeContent;
export const bookingModalContent = adapted.bookingModalContent;
