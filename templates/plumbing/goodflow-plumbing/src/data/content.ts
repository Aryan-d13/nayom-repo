import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptGoodflowContent,
  ServiceProblem,
  HouseRoom,
  RoomData,
  ProjectItem,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptGoodflowContent(siteData);

export type { ServiceProblem, HouseRoom, RoomData, ProjectItem };

export const siteMetadata = adapted.siteMetadata;
export const COMPANY = adapted.COMPANY;
export const navbarContent = adapted.navbarContent;
export const heroContent = adapted.heroContent;
export const smallProblemsContent = adapted.smallProblemsContent;
export const SMALL_PROBLEMS = adapted.SMALL_PROBLEMS;
export const interactiveHouseContent = adapted.interactiveHouseContent;
export const ROOM_STORIES = adapted.ROOM_STORIES;
export const HOUSE_ROOMS = adapted.HOUSE_ROOMS;
export const leakDetectionContent = adapted.leakDetectionContent;
export const emergencyStripContent = adapted.emergencyStripContent;
export const dialogueProcessContent = adapted.dialogueProcessContent;
export const CONVERSATION_STEPS = adapted.CONVERSATION_STEPS;
export const projectCollageContent = adapted.projectCollageContent;
export const REAL_PROJECTS = adapted.REAL_PROJECTS;
export const finalCtaContent = adapted.finalCtaContent;
export const footerContent = adapted.footerContent;
export const bookingModalContent = adapted.bookingModalContent;
