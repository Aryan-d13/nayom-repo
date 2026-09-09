import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptSecondStoryContent,
  NavLink,
  RoomItem,
  MaterialItem,
  ProcessStage,
  ProjectStory,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptSecondStoryContent(siteData);

export type { NavLink, RoomItem, MaterialItem, ProcessStage, ProjectStory };

export const siteMetadata = adapted.siteMetadata;
export const BRAND = adapted.BRAND;
export const NAV_LINKS = adapted.NAV_LINKS;
export const HERO_CONTENT = adapted.HERO_CONTENT;
export const FIRST_TRANSFORMATION = adapted.FIRST_TRANSFORMATION;
export const roomExplorerContent = adapted.roomExplorerContent;
export const ROOMS_CONTENT = adapted.ROOMS_CONTENT;
export const materialsSectionContent = adapted.materialsSectionContent;
export const MATERIALS_CONTENT = adapted.MATERIALS_CONTENT;
export const processSectionContent = adapted.processSectionContent;
export const PROCESS_STAGES = adapted.PROCESS_STAGES;
export const projectStoriesSectionContent = adapted.projectStoriesSectionContent;
export const PROJECT_STORIES = adapted.PROJECT_STORIES;
export const TEAM_CONTENT = adapted.TEAM_CONTENT;
export const FINAL_TRANSFORMATION = adapted.FINAL_TRANSFORMATION;
export const footerContent = adapted.footerContent;
export const projectModalContent = adapted.projectModalContent;
export const projectDetailModalContent = adapted.projectDetailModalContent;
