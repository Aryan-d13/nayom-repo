import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import { adaptFieldstoneContent } from "./adapter";
import {
  Interest,
  DayMoment,
  CampusLocation,
  PhilosophyPillar,
  AdmissionAction,
} from "./defaultContent";

export type {
  Interest,
  DayMoment,
  CampusLocation,
  PhilosophyPillar,
  AdmissionAction,
};

const adapted = adaptFieldstoneContent(
  rawSiteData as unknown as Partial<CanonicalSiteData>
);

export const SCHOOL_INFO = adapted.schoolInfo;
export const siteMetadata = adapted.siteMetadata;
export const navbarContent = adapted.navbarContent;
export const HERO_PHOTOS = adapted.heroPhotos;
export const heroContent = adapted.heroContent;
export const INTERESTS = adapted.interests;
export const interestsContent = adapted.interestsContent;
export const DAY_MOMENTS = adapted.dayMoments;
export const dayContent = adapted.dayContent;
export const CAMPUS_LOCATIONS = adapted.campusLocations;
export const campusContent = adapted.campusContent;
export const PHILOSOPHY_PILLARS = adapted.philosophyPillars;
export const philosophyContent = adapted.philosophyContent;
export const ADMISSION_ACTIONS = adapted.admissionActions;
export const admissionsContent = adapted.admissionsContent;
export const finalMomentContent = adapted.finalMomentContent;
export const footerContent = adapted.footerContent;
export const visitModalContent = adapted.visitModalContent;
