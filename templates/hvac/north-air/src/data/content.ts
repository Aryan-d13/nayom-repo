import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import { adaptNorthAirContent, Room, Symptom, Atmosphere } from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptNorthAirContent(siteData);

export type { Room, Symptom, Atmosphere };

export const companyInfo = adapted.companyInfo;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const temperatureRoomContent = adapted.temperatureRoomContent;
export const houseWeatherContent = adapted.houseWeatherContent;
export const symptomsContent = adapted.symptomsContent;
export const technicianLoupeContent = adapted.technicianLoupeContent;
export const serviceAtmospheresContent = adapted.serviceAtmospheresContent;
export const finalCtaContent = adapted.finalCtaContent;
export const footerContent = adapted.footerContent;
export const bookingModalContent = adapted.bookingModalContent;
