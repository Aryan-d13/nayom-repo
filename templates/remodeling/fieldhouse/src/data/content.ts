import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptFieldhouseContent,
  NavLink,
  KeepDetail,
  TransformationItem,
  FloorPlanRoom,
  MaterialSample,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptFieldhouseContent(siteData);

export type { NavLink, KeepDetail, TransformationItem, FloorPlanRoom, MaterialSample };

export const siteMetadata = adapted.siteMetadata;
export const BRAND = adapted.BRAND;
export const NAV_LINKS = adapted.NAV_LINKS;
export const HERO_CONTENT = adapted.HERO_CONTENT;
export const WHAT_WE_KEEP_CONTENT = adapted.WHAT_WE_KEEP_CONTENT;
export const transformationsSectionContent = adapted.transformationsSectionContent;
export const TRANSFORMATIONS_CONTENT = adapted.TRANSFORMATIONS_CONTENT;
export const FLOOR_PLAN_CONTENT = adapted.FLOOR_PLAN_CONTENT;
export const MATERIAL_TABLE_CONTENT = adapted.MATERIAL_TABLE_CONTENT;
export const PEOPLE_CONTENT = adapted.PEOPLE_CONTENT;
export const FINAL_CTA_CONTENT = adapted.FINAL_CTA_CONTENT;
export const FOOTER_CONTENT = adapted.FOOTER_CONTENT;
export const PROJECT_MODAL_CONTENT = adapted.PROJECT_MODAL_CONTENT;
