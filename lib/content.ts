import fs from 'fs';
import path from 'path';
import { WebsiteData, SiteSettings, PhotoItem, VideoItem, PhotographySettings, CADModelItem, CADSettings } from '@/types/content';
import { redis } from '@/lib/redis';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');
const TMP_FILE_PATH = path.join('/tmp', 'sv7_content.json');
const REDIS_CONTENT_KEY = 'sv7_website_content';

declare global {
  var __sv7_content_cache: WebsiteData | undefined;
}

export const DEFAULT_PASSKEY = 'sv7-passkey-2026';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'sv7.dev',
  metaTitle: 'Shreyaan Vashishtha — Mechanical & Aerospace Engineering | sv7.dev',
  metaDescription: 'Official portfolio of Shreyaan Vashishtha. Mechanical & Aerospace Engineering at HKUST, Astrix Rocketry, mechanism design, and scientific computing.',
  keywords: [
    'Shreyaan Vashishtha',
    'Mechanical Engineering',
    'Aerospace Engineering',
    'HKUST',
    'Astrix Rocketry',
    'Aerodynamics and Descent Control',
    'SolidWorks CAD',
    'Autodesk Fusion 360',
    'IB Physics Tutor',
    'IB Mathematics AA HL',
    'Numerical Python',
    'Hong Kong Engineer',
  ],
  ogImageUrl: '',
  faviconUrl: '',
  twitterHandle: '@shreyaanv',
  canonicalUrl: 'https://sv7.dev',
  adminPasskey: DEFAULT_PASSKEY,
  adminPassword: DEFAULT_PASSKEY,
  biometricCredentialIds: [],
  accentColor: '#ffffff',
  cvUrl: '',
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
    badgeSubtitle: '',
    logoStyle: 'tc1-balanced',
    navLinks: [
      { name: 'Work', href: '#projects', enabled: true },
      { name: 'Experience', href: '#experience', enabled: true },
      { name: '3D CAD', href: '/cad', enabled: true },
      { name: 'Photography', href: '/photography', enabled: true },
    ],
    ctaText: 'Get in Touch',
    ctaHref: '#contact',
    resumeButtonText: 'LinkedIn',
    showResumeButton: false,
  },
  hero: {
    showStatusBadge: false,
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
    showLegalLinks: true,
  },
  theme: {
    accentColor: 'white',
    glowIntensity: 'subtle',
  },
};

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'A350-1000 Low-Pass Flare & Touchdown',
    description: 'Cathay Pacific Airbus A350-1000 on ILS 25R final approach at HKG during golden hour crosswind conditions. 10-bit S-Log3 grading.',
    category: 'Aerospace & Aviation',
    videoUrl: 'https://images.pexels.com/videos/3045163/free-video-3045163.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1200&auto=format&fit=crop&q=80',
    instagramUrl: 'https://www.instagram.com/sv.snap/',
    duration: '0:35',
    aspectRatio: '9:16',
    resolution: '4K 60fps',
    camera: 'Sony Alpha 7 IV',
    lens: 'FE 200-600mm F5.6-6.3 G OSS',
    fps: '60fps',
    location: 'Hong Kong International Airport (HKG)',
    date: 'Oct 2024',
    featured: true,
  },
  {
    id: 'vid-2',
    title: 'Nocturne Runway Operations & Thrust Reversal',
    description: 'Long-exposure motion study of night departures and apron ground handling dynamics with moisture condensation trails.',
    category: 'Urban & Nocturne',
    videoUrl: 'https://images.pexels.com/videos/4774391/pexels-photo-4774391.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=1200&auto=format&fit=crop&q=80',
    instagramUrl: 'https://www.instagram.com/sv.snap/',
    duration: '0:48',
    aspectRatio: '16:9',
    resolution: '4K 24fps Cinema',
    camera: 'Sony Alpha 7 IV',
    lens: 'FE 24-70mm f/2.8 GM',
    fps: '24fps',
    location: 'HKG South Runway Observation Point',
    date: 'Sep 2024',
    featured: false,
  },
];

export const DEFAULT_PHOTOGRAPHY_SETTINGS: PhotographySettings = {
  title: 'Visual Archive & Cinematography',
  subtitle: 'Aerospace perspectives, mechanical forms, and terrestrial observations through stills & motion.',
  bio: 'A curated visual and motion log captured on 35mm & 4K digital sensors — featuring aviation reels on @sv.snap, structural geometry, and nocturne atmospheres.',
  pexelsProfileUrl: 'https://www.pexels.com/collections/portfolio-je8myyb/',
  pexelsUsername: 'shreyaan',
  pexelsCollectionId: 'portfolio-je8myyb',
  instagramHandle: 'sv.snap',
  instagramProfileUrl: 'https://www.instagram.com/sv.snap/',
  instagramBio: 'Aviation reels, vertical cinema, and high-speed motion studies.',
  enableVideos: true,
  beholdFeedUrl: 'https://feeds.behold.so/1lkLZszNd2q0wm55agTN',
  beholdFeedId: '1lkLZszNd2q0wm55agTN',
  categories: ['All', 'Aerospace & Aviation', 'Architecture', 'Urban & Nocturne', 'Nature & Textures'],
  enableExif: true,
  photosPerPage: 24,
};

export const DEFAULT_CAD_SETTINGS: CADSettings = {
  title: 'CAD Lab & Mechanical Assemblies',
  subtitle: 'Interactive 3D models, rocketry dual-deploy recovery modules, and precision aerospace hardware.',
  enableDownloads: true,
  wireframeDefault: false,
  printablesProfileUrl: 'https://www.printables.com',
};

export const DEFAULT_MODELS: CADModelItem[] = [
  {
    id: 'cad-1',
    title: 'Astrix Dual-Deploy Recovery Avionics Module',
    description: 'Precision dual-deployment parachute ejection bay engineered for the Astrix Rocketry vehicle. Features dual-redundant barometric altimeter sleds, dual carbon-composite bulkheads, and high-tolerance shear-pin retention rings.',
    category: 'Aerospace & Rocketry',
    modelUrl: 'procedural:avionics-bay',
    format: 'glb',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=80',
    cadSoftware: 'SolidWorks 2024',
    material: 'Carbon Fiber / 6061-T6 Al Standoffs',
    manufacturing: 'CNC Turning & Waterjet Bulkheads',
    tolerances: '±0.05 mm',
    mass: '340 g',
    dimensions: 'Ø 98 mm × 220 mm',
    downloadUrl: '',
    printablesUrl: '',
    upAxis: 'y',
    featured: true,
    hidden: false,
    order: 1,
  },
  {
    id: 'cad-2',
    title: 'Supersonic Aerodynamic Fin Can Assembly',
    description: 'Structural fin can assembly with slotted 4-fin retention sleeves, motor casing retaining ring, and 6061-T6 leading-edge supersonic bevels designed to withstand transonic flutter loads.',
    category: 'Aerospace & Rocketry',
    modelUrl: 'procedural:fin-can',
    format: 'glb',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517976487502-5f657a8bf606?w=800&auto=format&fit=crop&q=80',
    cadSoftware: 'SolidWorks & ANSYS Fluent',
    material: '6061-T6 Billet Aluminum & G10 Fins',
    manufacturing: '4-Axis CNC Milling',
    tolerances: '±0.02 mm',
    mass: '580 g',
    dimensions: 'Ø 102 mm × 310 mm',
    downloadUrl: '',
    printablesUrl: '',
    upAxis: 'y',
    featured: false,
    hidden: false,
    order: 2,
  },
  {
    id: 'cad-3',
    title: 'Two-Axis Precision Sensor Gimbal',
    description: 'Ultra-compact, low-backlash dual-axis gimbal mechanism engineered for high-g flight telemetry vibration isolation, housing IMU and optical guidance sensors.',
    category: 'Robotics & Mechanisms',
    modelUrl: 'procedural:sensor-gimbal',
    format: 'stl',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    cadSoftware: 'Autodesk Fusion 360',
    material: 'Anodized 7075-T6 Al & Titanium Fasteners',
    manufacturing: '5-Axis CNC & Wire EDM',
    tolerances: '±0.015 mm',
    mass: '165 g',
    dimensions: '85 × 72 × 55 mm',
    downloadUrl: '',
    printablesUrl: 'https://www.printables.com',
    upAxis: 'z',
    featured: false,
    hidden: false,
    order: 3,
  },
];

const DEFAULT_CONTENT: WebsiteData = {
  profile: {
    name: 'Shreyaan Vashishtha',
    handle: 'shreyaanv',
    title: 'Mechanical & Aerospace Engineering @ HKUST',
    tagline: 'Junior Engineer in the Astrix Rocketry Team specializing in Aerodynamics & Descent Control, mechanism design, and computational engineering.',
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
    { name: 'GitHub', url: 'https://github.com/ShreyaanVashishtha', icon: 'github' },
  ],
  projects: [],
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  photos: [],
  videos: DEFAULT_VIDEOS,
  models: [],
  cadSettings: DEFAULT_CAD_SETTINGS,
  photographySettings: DEFAULT_PHOTOGRAPHY_SETTINGS,
  settings: DEFAULT_SETTINGS,
};

function mergeWithDefaults(parsed: any): WebsiteData {
  return {
    ...DEFAULT_CONTENT,
    ...(parsed || {}),
    profile: {
      ...DEFAULT_CONTENT.profile,
      ...(parsed?.profile || {}),
      status: {
        ...DEFAULT_CONTENT.profile.status,
        ...(parsed?.profile?.status || {}),
      },
    },
    settings: {
      ...DEFAULT_SETTINGS,
      ...(parsed?.settings || {}),
      adminPasskey: (() => {
        const raw =
          process.env.ADMIN_PASSKEY ||
          process.env.ADMIN_PASSWORD ||
          parsed?.settings?.adminPasskey ||
          parsed?.settings?.adminPassword;
        return raw && raw.toString().trim().toLowerCase() !== 'admin'
          ? raw.toString().trim()
          : DEFAULT_PASSKEY;
      })(),
      adminPassword: (() => {
        const raw =
          process.env.ADMIN_PASSKEY ||
          process.env.ADMIN_PASSWORD ||
          parsed?.settings?.adminPasskey ||
          parsed?.settings?.adminPassword;
        return raw && raw.toString().trim().toLowerCase() !== 'admin'
          ? raw.toString().trim()
          : DEFAULT_PASSKEY;
      })(),
      biometricCredentialIds: Array.isArray(parsed?.settings?.biometricCredentialIds)
        ? parsed.settings.biometricCredentialIds
        : [],
      keywords: Array.isArray(parsed?.settings?.keywords)
        ? parsed.settings.keywords
        : DEFAULT_SETTINGS.keywords,
      ogImageUrl: parsed?.settings?.ogImageUrl ?? DEFAULT_SETTINGS.ogImageUrl,
      faviconUrl: parsed?.settings?.faviconUrl ?? DEFAULT_SETTINGS.faviconUrl,
      twitterHandle: parsed?.settings?.twitterHandle ?? DEFAULT_SETTINGS.twitterHandle,
      canonicalUrl: parsed?.settings?.canonicalUrl ?? DEFAULT_SETTINGS.canonicalUrl,
      sectionVisibility: {
        ...DEFAULT_SETTINGS.sectionVisibility,
        ...(parsed?.settings?.sectionVisibility || {}),
      },
      header: {
        ...DEFAULT_SETTINGS.header,
        ...(parsed?.settings?.header || {}),
      },
      hero: {
        ...DEFAULT_SETTINGS.hero,
        ...(parsed?.settings?.hero || {}),
      },
      headings: {
        ...DEFAULT_SETTINGS.headings,
        ...(parsed?.settings?.headings || {}),
      },
      terminal: {
        ...DEFAULT_SETTINGS.terminal,
        ...(parsed?.settings?.terminal || {}),
      },
      contact: {
        ...DEFAULT_SETTINGS.contact,
        ...(parsed?.settings?.contact || {}),
      },
      footer: {
        ...DEFAULT_SETTINGS.footer,
        ...(parsed?.settings?.footer || {}),
      },
      theme: {
        ...DEFAULT_SETTINGS.theme,
        ...(parsed?.settings?.theme || {}),
      },
    },
    photos: Array.isArray(parsed?.photos) ? parsed.photos : [],
    videos: Array.isArray(parsed?.videos) ? parsed.videos : DEFAULT_VIDEOS,
    models: Array.isArray(parsed?.models) ? parsed.models : [],
    cadSettings: {
      ...DEFAULT_CAD_SETTINGS,
      ...(parsed?.cadSettings || {}),
    },
    photographySettings: {
      ...DEFAULT_PHOTOGRAPHY_SETTINGS,
      ...(parsed?.photographySettings || {}),
    },
  };
}

export async function getContent(): Promise<WebsiteData> {
  try {
    // 1. Check in-memory cache first (super fast response)
    if (globalThis.__sv7_content_cache) {
      const cached = globalThis.__sv7_content_cache;
      const envKey = process.env.ADMIN_PASSKEY || process.env.ADMIN_PASSWORD;
      if (envKey && envKey.trim().toLowerCase() !== 'admin') {
        cached.settings.adminPasskey = envKey.trim();
        cached.settings.adminPassword = envKey.trim();
      }
      return cached;
    }

    // 2. Check Cloud Database (Vercel KV / Upstash Redis) if available
    if (redis) {
      try {
        const remote = await redis.get<WebsiteData>(REDIS_CONTENT_KEY);
        if (remote && remote.profile) {
          const merged = mergeWithDefaults(remote);
          globalThis.__sv7_content_cache = merged;
          return merged;
        }
      } catch (redisErr) {
        console.warn('Redis read failed, falling back to disk:', redisErr);
      }
    }

    let fileContents = '';

    // 3. Check /tmp (active serverless runtime writes)
    if (fs.existsSync(TMP_FILE_PATH)) {
      try {
        fileContents = fs.readFileSync(TMP_FILE_PATH, 'utf-8');
      } catch (e) {}
    }

    // 4. Check primary repository location (process.cwd())
    if (!fileContents && fs.existsSync(DATA_FILE_PATH)) {
      fileContents = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    }

    const parsed = fileContents.trim() ? JSON.parse(fileContents) : DEFAULT_CONTENT;
    const result = mergeWithDefaults(parsed);

    // If Redis is active but empty, auto-seed it with the initial website data
    if (redis) {
      try {
        await redis.set(REDIS_CONTENT_KEY, result);
      } catch (seedErr) {
        console.warn('Auto-seeding Redis failed:', seedErr);
      }
    }

    globalThis.__sv7_content_cache = result;
    return result;
  } catch (error) {
    console.error('Error reading content, using fallback:', error);
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(data: WebsiteData): Promise<boolean> {
  try {
    // Sanitize passkey: ensure 'admin' is never stored
    if (
      data.settings.adminPasskey &&
      data.settings.adminPasskey.trim().toLowerCase() === 'admin'
    ) {
      data.settings.adminPasskey = DEFAULT_PASSKEY;
    }
    if (!data.settings.adminPasskey) {
      data.settings.adminPasskey = DEFAULT_PASSKEY;
    }
    data.settings.adminPassword = data.settings.adminPasskey;

    // 1. Update in-memory cache immediately
    globalThis.__sv7_content_cache = data;

    // 2. If Redis is configured, save directly to cloud database!
    if (redis) {
      try {
        await redis.set(REDIS_CONTENT_KEY, data);
      } catch (redisErr) {
        console.error('Failed to write to Redis:', redisErr);
      }
    }

    // 3. Try primary repo disk write (works in local dev & persistent containers)
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tempFile = `${DATA_FILE_PATH}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DATA_FILE_PATH);
    } catch (diskErr) {
      // In serverless (Vercel), process.cwd() is read-only (EROFS)
    }

    // 4. Write to /tmp as local serverless container fallback
    try {
      fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (tmpErr) {}

    return true;
  } catch (error) {
    console.error('Error in saveContent:', error);
    return false;
  }
}
