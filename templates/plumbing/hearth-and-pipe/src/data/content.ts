import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptHearthAndPipeContent,
  MomentItem,
  RoomSection,
  StepItem,
  NavLink,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptHearthAndPipeContent(siteData);

export type { MomentItem, RoomSection, StepItem, NavLink };

export const businessInfo = adapted.businessInfo;
export const siteMetadata = adapted.siteMetadata;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const noticeContent = adapted.noticeContent;
export const insideHomeContent = adapted.insideHomeContent;
export const theFixContent = adapted.theFixContent;
export const waterHeaterContent = adapted.waterHeaterContent;
export const peopleContent = adapted.peopleContent;
export const backToNormalContent = adapted.backToNormalContent;
export const bookingModalContent = adapted.bookingModalContent;
export const footerContent = adapted.footerContent;
