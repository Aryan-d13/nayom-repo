import rawSiteData from "../../site-data.json";
import { CanonicalSiteData } from "./canonical";
import {
  adaptPortfolioContent,
  RabbitHoleItem,
  Project,
  BuildStep,
  WritingPiece,
  SocialLink,
} from "./adapter";

const siteData = rawSiteData as unknown as Partial<CanonicalSiteData>;
const adapted = adaptPortfolioContent(siteData);

export type { RabbitHoleItem, Project, BuildStep, WritingPiece, SocialLink };

export const personalInfo = adapted.personalInfo;
export const siteMetadata = adapted.siteMetadata;
export const navigationContent = adapted.navigationContent;
export const heroContent = adapted.heroContent;
export const interruptionThoughts = adapted.interruptionThoughts;
export const rabbitHolesContent = adapted.rabbitHolesContent;
export const workContent = adapted.workContent;
export const buildContent = adapted.buildContent;
export const writingContent = adapted.writingContent;
export const physicsContent = adapted.physicsContent;
export const outsideScreenContent = adapted.outsideScreenContent;
export const aboutContent = adapted.aboutContent;
export const futureContent = adapted.futureContent;
export const contactContent = adapted.contactContent;
export const footerContent = adapted.footerContent;
export const thoughtCursorContent = adapted.thoughtCursorContent;
