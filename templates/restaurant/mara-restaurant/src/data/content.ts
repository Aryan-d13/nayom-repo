import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptMaraContent,
  MenuItem,
  MotionMoment,
  NavLinkItem,
  DiningHour,
  MenuCategoryItem,
  MenuCategory,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptMaraContent(siteData);

export type { MenuItem, MotionMoment, NavLinkItem, DiningHour, MenuCategoryItem, MenuCategory };

export const businessInfo = adapted.businessInfo;
export const siteMetadata = adapted.siteMetadata;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const menuContent = adapted.menuContent;
export const foodInMotionContent = adapted.foodInMotionContent;
export const theTableContent = adapted.theTableContent;
export const reservationContent = adapted.reservationContent;
export const quietFinaleContent = adapted.quietFinaleContent;
export const footerContent = adapted.footerContent;
export const fullMenuModalContent = adapted.fullMenuModalContent;
