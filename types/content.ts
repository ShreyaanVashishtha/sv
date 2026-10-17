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
  logoStyle?: 'delta' | 'classic';
  navLinks: NavLink[];
  ctaText: string;
  ctaHref: string;
  resumeButtonText: string;
  showResumeButton: boolean;
}

export interface HeroSettings {
  showStatusBadge?: boolean;
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
  notificationEmail?: string;
  webhookUrl?: string;
}

export interface FooterSettings {
  copyrightName: string;
  footerNote: string;
  customLinks?: { name: string; url: string }[];
  showLegalLinks?: boolean;
}

export interface ThemeSettings {
  accentColor: string; // 'white' | 'emerald' | 'sky' | 'indigo' | 'amber' | 'rose'
  glowIntensity: string; // 'none' | 'subtle' | 'vivid'
}

export interface SiteSettings {
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  ogImageUrl?: string;
  faviconUrl?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
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

export interface PhotoItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait?: string;
    landscape?: string;
    tiny?: string;
  };
  width: number;
  height: number;
  url: string;
  photographer?: string;
  photographerUrl?: string;
  avgColor?: string;
  alt?: string;
  location?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  featured?: boolean;
  hidden?: boolean;
  date?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  videoUrl: string; // Direct MP4/WebM, Instagram Reel URL, YouTube, or Vimeo
  posterUrl?: string; // Thumbnail preview image
  instagramUrl?: string; // Link to the reel on @sv.snap
  duration?: string; // e.g. "0:30", "Reel"
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:5';
  resolution?: string; // e.g. "4K 60fps", "1080p 120fps Log"
  camera?: string; // e.g. "Sony Alpha 7 IV"
  lens?: string; // e.g. "FE 24-70mm f/2.8 GM"
  fps?: string; // e.g. "60fps"
  location?: string; // e.g. "Hong Kong SAR"
  date?: string; // e.g. "Oct 2024"
  featured?: boolean;
  hidden?: boolean;
}

export interface PhotographySettings {
  title: string;
  subtitle: string;
  bio?: string;
  pexelsProfileUrl?: string;
  pexelsUsername?: string;
  pexelsCollectionId?: string;
  pexelsApiKey?: string;
  instagramHandle?: string;
  instagramProfileUrl?: string;
  instagramBio?: string;
  enableVideos?: boolean;
  beholdFeedUrl?: string;
  beholdFeedId?: string;
  categories?: string[];
  enableExif?: boolean;
  photosPerPage?: number;
}

export interface CADModelItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  modelUrl: string; // path or URL to .glb, .gltf, or .stl
  format: 'glb' | 'gltf' | 'stl';
  thumbnailUrl?: string;
  cadSoftware?: string; // e.g. "SolidWorks 2024", "Autodesk Fusion 360"
  material?: string; // e.g. "6061-T6 Aluminum", "Carbon Fiber"
  manufacturing?: string; // e.g. "5-Axis CNC Milling", "FDM 3D Printing"
  tolerances?: string; // e.g. "±0.05 mm"
  mass?: string; // e.g. "340 g"
  dimensions?: string; // e.g. "Ø 98 mm × 220 mm"
  downloadUrl?: string; // Optional STEP, STL, or CAD file download link
  printablesUrl?: string; // Direct link to Printables.com listing (e.g. https://www.printables.com/model/...)
  upAxis?: 'y' | 'z'; // Orientation: 'z' for Fusion 360 Z-Up, 'y' for standard Three.js Y-Up
  featured?: boolean;
  hidden?: boolean;
  order?: number;
}

export interface CADSettings {
  title: string;
  subtitle: string;
  enableDownloads?: boolean;
  wireframeDefault?: boolean;
  printablesProfileUrl?: string; // Maker profile URL on Printables (e.g. https://www.printables.com/@shreyaan)
}

export interface WebsiteData {
  profile: Profile;
  socials: Social[];
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  photos?: PhotoItem[];
  videos?: VideoItem[];
  models?: CADModelItem[];
  cadSettings?: CADSettings;
  photographySettings?: PhotographySettings;
  settings: SiteSettings;
}
