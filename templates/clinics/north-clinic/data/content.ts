import rawSiteData from "../site-data.json";
import {
  adaptClinicContent,
  ConcernItem,
  CareStep,
  VisitMoment,
  DoctorProfile,
} from "./adapter";

const adapted = adaptClinicContent(rawSiteData as any);

export const clinicInfo = adapted.clinicInfo;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const whatBringsYouInContent = adapted.whatBringsYouInContent;
export const careWithoutMenuContent = adapted.careWithoutMenuContent;
export const theVisitContent = adapted.theVisitContent;
export const thePeopleContent = adapted.thePeopleContent;
export const eveningCtaContent = adapted.eveningCtaContent;
export const bookingModalContent = adapted.bookingModalContent;
export const footerContent = adapted.footerContent;

export type { ConcernItem, CareStep, VisitMoment, DoctorProfile };
