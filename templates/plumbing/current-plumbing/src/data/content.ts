import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptCurrentPlumbingContent,
  RoomData,
  PressureState,
  NotePoint,
  CallItem,
  ServiceLink,
  QuickLink,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptCurrentPlumbingContent(siteData);

export type { RoomData, PressureState, NotePoint, CallItem, ServiceLink, QuickLink };

export const businessInfo = adapted.businessInfo;
export const siteMetadata = adapted.siteMetadata;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const followWaterContent = adapted.followWaterContent;
export const dripContent = adapted.dripContent;
export const somethingsOffContent = adapted.somethingsOffContent;
export const theWorkContent = adapted.theWorkContent;
export const commonCallsContent = adapted.commonCallsContent;
export const finalCtaContent = adapted.finalCtaContent;
export const footerContent = adapted.footerContent;
export const bookingModalContent = adapted.bookingModalContent;
