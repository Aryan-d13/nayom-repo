import rawSiteData from "../../site-data.json";
import {
  adaptGarageDoorContent,
  StyleItem,
  RepairSituation,
  ArchitecturePoint,
  MomentItem,
} from "./adapter";

const adapted = adaptGarageDoorContent(rawSiteData as any);

export const businessInfo = adapted.businessInfo;
export const siteMetadata = adapted.siteMetadata;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const styleSelectorContent = adapted.styleSelectorContent;
export const DOOR_STYLES = adapted.DOOR_STYLES;
export const openCloseContent = adapted.openCloseContent;
export const MOMENTS = adapted.MOMENTS;
export const repairContent = adapted.repairContent;
export const REPAIR_SITUATIONS = adapted.REPAIR_SITUATIONS;
export const architectureContent = adapted.architectureContent;
export const ARCH_POINTS = adapted.ARCH_POINTS;
export const ARCHITECTURE_HOTSPOTS = adapted.ARCHITECTURE_HOTSPOTS;
export const finalCtaContent = adapted.finalCtaContent;
export const footerContent = adapted.footerContent;
export const quoteModalContent = adapted.quoteModalContent;

export type { StyleItem, RepairSituation, ArchitecturePoint, MomentItem };
