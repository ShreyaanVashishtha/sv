import fs from 'fs';
import path from 'path';
import { WebsiteData, SiteSettings } from '@/types/content';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'sv7.dev',
  metaTitle: 'Shreyaan Vashishtha — Mechanical & Aerospace Engineering | sv7.dev',
  metaDescription: 'Official portfolio of Shreyaan Vashishtha. Mechanical & Aerospace Engineering at HKUST, Astrix Rocketry, mechanism design, and scientific computing.',
  adminPassword: 'admin',
  accentColor: '#ffffff',
  cvUrl: '/CV-Shreyaan-Vashishtha.pdf',
  contactMessage: 'Interested in aerospace engineering, Astrix rocketry, IB tutoring, or technical collaboration? Reach out directly.',
  footerNote: 'Crafted with precision for sv7.dev. Mechanical & Aerospace Engineering @ HKUST.',
  sectionVisibility: {
    heroMetrics: true,
    projects: true,
    skills: true,
    experience: true,
    education: true,
    certifications: true,
    terminalCard: false,
    contact: true,
  },
  sectionOrder: ['projects', 'skills', 'experience', 'education', 'terminalCard', 'contact'],
  header: {
    logoBadge: 'sv7',
    brandTitle: 'sv7.dev',
    badgeSubtitle: 'HKUST Astrix',
    navLinks: [
      { name: 'Projects', href: '#projects', enabled: true },
      { name: 'Capabilities', href: '#skills', enabled: true },
      { name: 'Experience', href: '#experience', enabled: true },
      { name: 'Education', href: '#education', enabled: true },
      { name: 'Contact', href: '#contact', enabled: true },
    ],
    ctaText: 'Get in Touch',
    ctaHref: '#contact',
    resumeButtonText: 'Resume / CV',
    showResumeButton: true,
  },
  hero: {
    statusBadgePrefix: 'Status',
    exploreButtonText: 'Explore Work',
    exploreButtonHref: '#projects',
    copyEmailText: 'Copy email',
    showAvatar: false,
    avatarUrl: '',
  },
  headings: {
    projectsEyebrow: 'Selected Works',
    projectsTitle: 'Featured Projects & Systems',
    projectsSubtitle: 'Aerospace recovery mechanisms, scientific numerical simulators, and parametric CAD designs.',
    skillsEyebrow: 'Core Capabilities',
    skillsTitle: 'Engineering Stack & Disciplines',
    skillsSubtitle: 'Selected technologies, protocols, and architectural patterns deployed in production environments.',
    experienceEyebrow: 'Track Record',
    experienceTitle: 'Experience & Milestones',
    experienceSubtitle: 'Engineering teams, pedagogical mentorship, and organizational leadership.',
    educationEyebrow: 'Academic Background',
    educationTitle: 'Education & Honors',
    educationSubtitle: 'Undergraduate aerospace studies, International Baccalaureate diploma, and certified proficiencies.',
    certificationsEyebrow: 'Standardized Exams & Credentials',
    certificationsTitle: 'Standardized Exams & Certifications',
    contactEyebrow: 'Initiate Contact',
    contactTitle: "Let's Build Something Meaningful",
    contactSubtitle: 'Open for select consulting, high-impact systems architecture, and engineering advisory.',
  },
  terminal: {
    windowTitle: 'bash — sv7.dev',
    commandPrompt: 'curl -s https://sv7.dev/api/content | jq .profile',
    customOutput: JSON.stringify(
      {
        handle: 'shreyaanv',
        status: 'active',
        university: 'HKUST',
        focus: ['Aerospace Systems', 'Descent Recovery', 'Numerical Python', 'Parametric CAD'],
        availability: 'Open for high-impact projects & engineering research',
      },
      null,
      2
    ),
    copyButtonText: 'Copy',
    copiedText: 'Copied',
    expandText: 'View payload preview',
    collapseText: 'Hide response preview',
  },
  contact: {
    formTitle: 'Send a Direct Dispatch',
    subjectLabel: 'Subject / Topic',
    subjectPlaceholder: 'Aerospace inquiry / Collaboration / Tutoring...',
    messageLabel: 'Brief Overview',
    messagePlaceholder: 'Tell me about what you are building, requirements, or timeline...',
    submitButtonText: 'Compose in Email Client',
    directTitle: 'Direct Inquiries',
    responseDisclaimer: 'Responses typically sent within 24 business hours.',
    copyAddressText: 'Copy Address',
  },
  footer: {
    copyrightName: 'Shreyaan Vashishtha',
    footerNote: 'Crafted with precision for sv7.dev. Mechanical & Aerospace Engineering @ HKUST.',
    customLinks: [],
  },
  theme: {
    accentColor: 'white',
    glowIntensity: 'subtle',
  },
};

const DEFAULT_CONTENT: WebsiteData = {
  profile: {
    name: 'Shreyaan Vashishtha',
    handle: 'shreyaanv',
    title: 'Mechanical & Aerospace Engineering @ HKUST | Astrix Rocketry Team',
    tagline: 'Mechanical and Aerospace Engineering undergraduate at HKUST. Junior Engineer in the Astrix Rocketry Team specializing in Aerodynamics & Descent Control, mechanism design, and computational engineering.',
    avatar: 'https://images.unsplash.com/photo-1517976487502-5f657a8bf606?w=600&auto=format&fit=crop&q=80',
    status: {
      available: true,
      text: 'B.Eng Student at HKUST & Engineering with Astrix Rocketry',
    },
    location: 'Hong Kong',
    email: 'shreyaan2007@gmail.com',
    bio: [
      'I am an undergraduate student in the Department of Mechanical and Aerospace Engineering at The Hong Kong University of Science and Technology (HKUST).',
      'Currently, I contribute as a Junior Engineer in the Astrix Rocketry Team (Aerodynamic & Descent Control), involved in mechanism design, flight recovery systems, and aerodynamic testing.',
      'Beyond rocketry, I have an extensive background in STEM mentorship (1-on-1 tutoring for IB Physics, Economics, and Mathematics AA HL), numerical simulation using Python, and precision 3D CAD modeling with SolidWorks and Fusion 360.',
    ],
    metrics: [
      { label: 'IELTS Academic', value: '8.5 / 9' },
      { label: 'IB Diploma', value: '38 Pts' },
      { label: 'Astrix Flight Team', value: 'Aero & Descent' },
      { label: 'Undergraduate', value: 'HKUST B.Eng' },
    ],
  },
  socials: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shreyaanv/', icon: 'linkedin' },
    { name: 'Email', url: 'mailto:shreyaan2007@gmail.com', icon: 'mail' },
    { name: 'GitHub', url: 'https://github.com', icon: 'github' },
  ],
  projects: [],
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  settings: DEFAULT_SETTINGS,
};

export function getContent(): WebsiteData {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return DEFAULT_CONTENT;
    }
    const fileContents = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    if (!fileContents.trim()) {
      return DEFAULT_CONTENT;
    }
    const parsed = JSON.parse(fileContents);
    return {
      ...DEFAULT_CONTENT,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
        sectionVisibility: {
          ...DEFAULT_SETTINGS.sectionVisibility,
          ...(parsed.settings?.sectionVisibility || {}),
        },
        header: {
          ...DEFAULT_SETTINGS.header,
          ...(parsed.settings?.header || {}),
        },
        hero: {
          ...DEFAULT_SETTINGS.hero,
          ...(parsed.settings?.hero || {}),
        },
        headings: {
          ...DEFAULT_SETTINGS.headings,
          ...(parsed.settings?.headings || {}),
        },
        terminal: {
          ...DEFAULT_SETTINGS.terminal,
          ...(parsed.settings?.terminal || {}),
        },
        contact: {
          ...DEFAULT_SETTINGS.contact,
          ...(parsed.settings?.contact || {}),
        },
        footer: {
          ...DEFAULT_SETTINGS.footer,
          ...(parsed.settings?.footer || {}),
        },
        theme: {
          ...DEFAULT_SETTINGS.theme,
          ...(parsed.settings?.theme || {}),
        },
      },
    };
  } catch (error) {
    console.error('Error reading content.json, using fallback:', error);
    return DEFAULT_CONTENT;
  }
}

export function saveContent(data: WebsiteData): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempFile = `${DATA_FILE_PATH}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE_PATH);
    return true;
  } catch (error) {
    console.error('Error saving content.json:', error);
    return false;
  }
}
