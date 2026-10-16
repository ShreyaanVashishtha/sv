export interface Metric {
  label: string;
  value: string;
}

export interface Status {
  available: boolean;
  text: string;
}

export interface Profile {
  name: string;
  handle: string;
  title: string;
  tagline: string;
  avatar: string;
  status: Status;
  location: string;
  email: string;
  bio: string[];
  metrics: Metric[];
}

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  featured: boolean;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface SkillItem {
  name: string;
  level?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location?: string;
  score?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  score?: string;
  details?: string;
}

export interface SectionVisibility {
  heroMetrics: boolean;
  projects: boolean;
  skills: boolean;
  experience: boolean;
  education: boolean;
  certifications: boolean;
  terminalCard: boolean;
  contact: boolean;
}

export interface NavLink {
  name: string;
  href: string;
  enabled?: boolean;
}

export interface HeaderSettings {
  logoBadge: string;
  brandTitle: string;
  badgeSubtitle?: string;
  navLinks: NavLink[];
  ctaText: string;
  ctaHref: string;
  resumeButtonText: string;
  showResumeButton: boolean;
}

export interface HeroSettings {
  statusBadgePrefix: string;
  exploreButtonText: string;
  exploreButtonHref: string;
  copyEmailText: string;
  showAvatar: boolean;
  avatarUrl?: string;
}

export interface SectionHeadings {
  projectsEyebrow: string;
  projectsTitle: string;
  projectsSubtitle?: string;
  skillsEyebrow: string;
  skillsTitle: string;
  skillsSubtitle?: string;
  experienceEyebrow: string;
  experienceTitle: string;
  experienceSubtitle?: string;
  educationEyebrow: string;
  educationTitle: string;
  educationSubtitle?: string;
  certificationsEyebrow: string;
  certificationsTitle: string;
  contactEyebrow: string;
  contactTitle: string;
  contactSubtitle?: string;
}

export interface TerminalSettings {
  windowTitle: string;
  commandPrompt: string;
  customOutput: string;
  copyButtonText: string;
  copiedText: string;
  expandText: string;
  collapseText: string;
}

export interface ContactSettings {
  formTitle: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButtonText: string;
  directTitle: string;
  responseDisclaimer: string;
  copyAddressText: string;
  hideEmailAddress?: boolean;
  publicDisplayEmail?: string;
  webhookUrl?: string;
}

export interface FooterSettings {
  copyrightName: string;
  footerNote: string;
  customLinks?: { name: string; url: string }[];
}

export interface ThemeSettings {
  accentColor: string; // 'white' | 'emerald' | 'sky' | 'indigo' | 'amber' | 'rose'
  glowIntensity: string; // 'none' | 'subtle' | 'vivid'
}

export interface SiteSettings {
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  adminPassword?: string;
  adminPasskey?: string;
  biometricCredentialIds?: string[];
  accentColor: string;
  cvUrl?: string;
  contactMessage: string;
  footerNote: string;
  sectionVisibility: SectionVisibility;
  sectionOrder?: string[];
  header?: HeaderSettings;
  hero?: HeroSettings;
  headings?: SectionHeadings;
  terminal?: TerminalSettings;
  contact?: ContactSettings;
  footer?: FooterSettings;
  theme?: ThemeSettings;
}

export interface WebsiteData {
  profile: Profile;
  socials: Social[];
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  settings: SiteSettings;
}
