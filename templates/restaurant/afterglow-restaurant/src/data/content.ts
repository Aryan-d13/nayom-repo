import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptAfterglowContent,
  DishItem,
  MenuItem,
  WineItem,
  BarDrink,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptAfterglowContent(siteData);

export type { DishItem, MenuItem, WineItem, BarDrink };

export const businessInfo = adapted.businessInfo;
export const siteMetadata = adapted.siteMetadata;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const nightChangesContent = adapted.nightChangesContent;
export const TONIGHT_DISHES = adapted.TONIGHT_DISHES;
export const menuTonightContent = adapted.menuTonightContent;
export const roomContent = adapted.roomContent;
export const barContent = adapted.barContent;
export const reservationContent = adapted.reservationContent;
export const finalMomentContent = adapted.finalMomentContent;
export const footerContent = adapted.footerContent;
export const EXTENDED_MENU = adapted.EXTENDED_MENU;
export const menuModalContent = adapted.menuModalContent;
export const BAR_DRINKS = adapted.BAR_DRINKS;
export const drinksModalContent = adapted.drinksModalContent;
export const findUsModalContent = adapted.findUsModalContent;
