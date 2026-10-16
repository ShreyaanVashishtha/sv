import { getContent } from '@/lib/content';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { EducationSection } from '@/components/EducationSection';
import { TerminalCard } from '@/components/TerminalCard';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { AnimateIn } from '@/components/AnimateIn';

// Revalidate on demand or per request
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getContent();
  const visibility = data.settings?.sectionVisibility || {
    heroMetrics: true,
    projects: true,
    skills: true,
    experience: true,
    education: true,
    certifications: true,
    terminalCard: false,
    contact: true,
  };

  const headings = data.settings?.headings || {
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
    certificationsEyebrow: 'Standardized Credentials',
    certificationsTitle: 'Standardized Exams & Certifications',
    contactEyebrow: 'Initiate Contact',
    contactTitle: "Let's Build Something Meaningful",
    contactSubtitle: 'Open for select consulting, high-impact systems architecture, and engineering advisory.',
  };

  const defaultOrder = ['projects', 'skills', 'experience', 'education', 'terminalCard', 'contact'];
  const sectionOrder = (data.settings?.sectionOrder && data.settings.sectionOrder.length > 0)
    ? data.settings.sectionOrder
    : defaultOrder;

  // Render individual section dynamically based on key
  const renderSection = (key: string) => {
    switch (key) {
      case 'projects':
        return visibility.projects ? (
          <AnimateIn key="projects">
            <ProjectsSection
              projects={data.projects}
              eyebrow={headings.projectsEyebrow}
              title={headings.projectsTitle}
              subtitle={headings.projectsSubtitle}
            />
          </AnimateIn>
        ) : null;
      case 'skills':
        return visibility.skills ? (
          <AnimateIn key="skills">
            <SkillsSection
              skills={data.skills}
              eyebrow={headings.skillsEyebrow}
              title={headings.skillsTitle}
              subtitle={headings.skillsSubtitle}
            />
          </AnimateIn>
        ) : null;
      case 'experience':
        return visibility.experience ? (
          <AnimateIn key="experience">
            <ExperienceSection
              experience={data.experience}
              eyebrow={headings.experienceEyebrow}
              title={headings.experienceTitle}
              subtitle={headings.experienceSubtitle}
            />
          </AnimateIn>
        ) : null;
      case 'education':
        return visibility.education ? (
          <AnimateIn key="education">
            <EducationSection
              education={data.education || []}
              certifications={visibility.certifications ? data.certifications || [] : []}
              eyebrow={headings.educationEyebrow}
              title={headings.educationTitle}
              subtitle={headings.educationSubtitle}
              certificationsEyebrow={headings.certificationsEyebrow}
              certificationsTitle={headings.certificationsTitle}
            />
          </AnimateIn>
        ) : null;
      case 'terminalCard':
        return visibility.terminalCard ? (
          <AnimateIn key="terminalCard">
            <TerminalCard
              handle={data.profile.handle}
              terminalSettings={data.settings?.terminal}
            />
          </AnimateIn>
        ) : null;
      case 'contact':
        return visibility.contact ? (
          <AnimateIn key="contact">
            <ContactSection
              profile={data.profile}
              socials={data.socials}
              contactMessage={data.settings.contactMessage}
              eyebrow={headings.contactEyebrow}
              title={headings.contactTitle}
              subtitle={headings.contactSubtitle}
              contactSettings={data.settings?.contact}
            />
          </AnimateIn>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar
        status={data.profile.status}
        siteName={data.settings.siteName}
        cvUrl={data.settings.cvUrl}
        headerSettings={data.settings?.header}
      />

      <Hero
        profile={data.profile}
        socials={data.socials}
        showMetrics={visibility.heroMetrics}
        cvUrl={data.settings.cvUrl}
        heroSettings={data.settings?.hero}
        contactSettings={data.settings?.contact}
      />

      {/* Render sections in custom dynamic order */}
      {sectionOrder.map((sectionKey) => renderSection(sectionKey))}

      <Footer
        footerNote={data.settings.footerNote}
        siteName={data.settings.siteName}
        footerSettings={data.settings?.footer}
      />
    </main>
  );
}
