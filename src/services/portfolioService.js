import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { portfolioData as initialStaticData } from '../data/portfolioData.js';

/**
 * Service layer for interacting with Supabase tables and storage buckets.
 * Production-ready: ensures all database mutations are persisted to Supabase
 * so public visitors immediately see published content.
 */

const isUuid = (id) =>
  typeof id === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

function getStagedData() {
  try {
    const raw = typeof window !== 'undefined'
      ? (localStorage.getItem('portfolio_staged_data') || sessionStorage.getItem('portfolio_staged_data'))
      : null;
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Error reading cached portfolio data:", e);
  }
  return null;
}

function persistStagedChange(updaterFn) {
  try {
    const current = getStagedData() || initialStaticData;
    const next = updaterFn(current);
    if (typeof window !== 'undefined') {
      const serialized = JSON.stringify(next);
      localStorage.setItem('portfolio_staged_data', serialized);
      sessionStorage.setItem('portfolio_staged_data', serialized);
    }
    return next;
  } catch (e) {
    console.error("Local cache persistence error:", e);
    return null;
  }
}

export const portfolioService = {
  // Fetch full portfolio content
  async fetchPortfolio(isAdmin = false) {
    // If Supabase is not configured or offline, fallback to cached staged data or initialStaticData
    if (!isSupabaseConfigured || !supabase) {
      const staged = getStagedData();
      const base = staged || initialStaticData;
      const filtered = {
        ...base,
        skills: {
          ...base.skills,
          categories: (base.skills?.categories || initialStaticData.skills.categories).map(cat => ({
            ...cat,
            skills: (cat.skills || []).filter(item => isAdmin ? true : (item.is_published !== false)),
          })),
          items: (base.skills?.items || initialStaticData.skills.items || []).filter(item => isAdmin ? true : (item.is_published !== false)),
        },
        projects: {
          ...base.projects,
          items: (base.projects?.items || initialStaticData.projects.items).filter(item => isAdmin ? true : (item.is_published !== false)),
        },
        research: {
          ...base.research,
          items: (base.research?.items || initialStaticData.research.items).filter(item => isAdmin ? true : (item.is_published !== false)),
        },
      };
      return { data: filtered, error: null };
    }

    try {
      // 1. Fetch Profile
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      // 2. Fetch Projects (filtered by is_published for public visitors)
      let projectQuery = supabase.from('projects').select('*').order('order_index', { ascending: true });
      if (!isAdmin) {
        projectQuery = projectQuery.eq('is_published', true);
      }
      const { data: projectRows } = await projectQuery;

      // 3. Fetch Skills
      let skillQuery = supabase.from('skills').select('*').order('order_index', { ascending: true });
      if (!isAdmin) {
        skillQuery = skillQuery.eq('is_published', true);
      }
      const { data: skillRows } = await skillQuery;

      // 4. Fetch Education
      let eduQuery = supabase.from('education').select('*').order('order_index', { ascending: true });
      if (!isAdmin) {
        eduQuery = eduQuery.eq('is_published', true);
      }
      const { data: eduRows } = await eduQuery;

      // 5. Fetch Experience
      let expQuery = supabase.from('experience').select('*').order('order_index', { ascending: true });
      if (!isAdmin) {
        expQuery = expQuery.eq('is_published', true);
      }
      const { data: expRows } = await expQuery;

      // 6. Fetch Achievements
      let achQuery = supabase.from('achievements').select('*').order('order_index', { ascending: true });
      if (!isAdmin) {
        achQuery = achQuery.eq('is_published', true);
      }
      const { data: achRows } = await achQuery;

      // 7. Fetch Dedicated Certificates
      let certRows = null;
      try {
        let certQuery = supabase.from('certificates').select('*').order('order_index', { ascending: true });
        if (!isAdmin) {
          certQuery = certQuery.eq('is_published', true);
        }
        const { data: cData, error: cErr } = await certQuery;
        if (!cErr && cData) {
          certRows = cData;
        }
      } catch (e) {
        // Fallback to profileRow.about_certificates
      }

      // 8. Fetch Research items
      let researchRows = null;
      try {
        let resQuery = supabase.from('research').select('*').order('order_index', { ascending: true });
        if (!isAdmin) {
          resQuery = resQuery.eq('is_published', true);
        }
        const { data: rData, error: rErr } = await resQuery;
        if (!rErr && rData) {
          researchRows = rData;
        }
      } catch (e) {
        // Fallback handled below
      }

      // 9. Fetch Site Settings
      const { data: settingRow } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      const sectionContent = settingRow?.section_content || {};

      // Build Personal Data
      const personal = profileRow ? {
        id: profileRow.id,
        name: profileRow.name || initialStaticData.personal.name,
        preferredName: profileRow.preferred_name || initialStaticData.personal.preferredName,
        role: profileRow.role || initialStaticData.personal.role,
        degree: profileRow.degree || initialStaticData.personal.degree || "Bachelor of Science in Computer Science",
        specialization: profileRow.specialization || initialStaticData.personal.specialization,
        university: profileRow.university || initialStaticData.personal.university,
        expectedGraduation: profileRow.expected_graduation || initialStaticData.personal.expectedGraduation,
        statusBadge: {
          available: profileRow.status_available ?? initialStaticData.personal.statusBadge.available,
          text: (profileRow.status_text === 'Open to Summer 2026 SWE Internships & Co-ops' || !profileRow.status_text)
            ? initialStaticData.personal.statusBadge.text
            : profileRow.status_text,
        },
        location: profileRow.location || initialStaticData.personal.location,
        email: profileRow.email || initialStaticData.personal.email,
        phone: profileRow.phone || initialStaticData.personal.phone || initialStaticData.contact?.phone || '+1 (555) 019-2834',
        bioShort: profileRow.bio_short || initialStaticData.personal.bioShort,
        avatarUrl: profileRow.avatar_url || initialStaticData.personal.avatarUrl,
        cvUrl: profileRow.cv_url || initialStaticData.personal.cvUrl,
        resumeFileName: profileRow.cv_filename || initialStaticData.personal.resumeFileName,
        quickStats: profileRow.quick_stats && profileRow.quick_stats.length > 0 ? profileRow.quick_stats : initialStaticData.personal.quickStats,
        socialLinks: profileRow.social_links && profileRow.social_links.length > 0 ? profileRow.social_links : initialStaticData.personal.socialLinks,
        heroBackgrounds: profileRow.hero_backgrounds || initialStaticData.personal?.heroBackgrounds || {
          light: "/hero-light.png",
          dark: "/hero-dark.png",
        },
      } : initialStaticData.personal;

      // Build About Data
      const about = {
        title: "About Me",
        subtitle: "Defending networks, engineering resilient infrastructure, and deploying machine intelligence.",
        whoIAmHeading: profileRow?.who_i_am_heading || sectionContent.about_who_i_am || "Who I Am",
        paragraphs: (profileRow?.bio_paragraphs && profileRow.bio_paragraphs.length > 0)
          ? profileRow.bio_paragraphs
          : initialStaticData.about.paragraphs,
        professionalSummary: profileRow?.professional_summary || '',
        highlights: (profileRow?.about_highlights && profileRow.about_highlights.length > 0)
          ? profileRow.about_highlights
          : initialStaticData.about.highlights,
        terminalFacts: (profileRow?.terminal_facts && profileRow.terminal_facts.length > 0)
          ? profileRow.terminal_facts
          : initialStaticData.about.terminalFacts,
        profilePhotoUrl: profileRow?.avatar_url || initialStaticData.personal.avatarUrl,
        techStack: (profileRow?.about_tech_stack && profileRow.about_tech_stack.length > 0)
          ? profileRow.about_tech_stack
          : null,
        certificates: (certRows && certRows.length > 0)
          ? certRows
          : ((profileRow?.about_certificates && profileRow.about_certificates.length > 0)
            ? profileRow.about_certificates
            : null),
      };

      // Build Skills Data
      const rawSkills = (skillRows && skillRows.length > 0) ? skillRows : initialStaticData.skills.items;
      const skillsCategories = (sectionContent.skills_catalogs && sectionContent.skills_catalogs.length > 0)
        ? buildCategoriesFromCatalogs(sectionContent.skills_catalogs, rawSkills)
        : groupSkillsByCategory(rawSkills);

      const skills = {
        title: sectionContent.skills_title || initialStaticData.skills.title || "Skills & Technical Competencies",
        subtitle: sectionContent.skills_subtitle || initialStaticData.skills.subtitle,
        categories: skillsCategories.map(cat => ({
          ...cat,
          skills: (cat.skills || []).filter(item => isAdmin ? true : (item.is_published !== false)),
        })),
        items: rawSkills.filter(item => isAdmin ? true : (item.is_published !== false)),
        rawItems: rawSkills,
      };

      // Build Projects Data
      const rawProjects = (projectRows && projectRows.length > 0) ? projectRows.map(p => ({
        id: p.id,
        slug: p.slug || p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: p.title,
        type: p.type || "Security Tool",
        category: p.category || "Cybersecurity",
        subcategory: p.subcategory || "",
        status: p.status || "Completed",
        completionYear: p.completion_year || p.completionYear || "2024",
        completionDate: p.completion_date || p.completionDate || "2024-01",
        startDate: p.start_date || p.startDate || "",
        tagline: p.tagline || "",
        description: p.description || "",
        fullOverview: p.full_overview || p.fullOverview || p.description || "",
        problemStatement: p.problem_statement || p.problemStatement || "",
        objectives: p.objectives || "",
        proposedSolution: p.proposed_solution || p.proposedSolution || "",
        methodology: p.methodology || "",
        technicalImplementation: p.technical_implementation || p.technicalImplementation || p.full_overview || p.description || "",
        keyFeatures: p.highlights || p.key_features || p.keyFeatures || [],
        highlights: p.highlights || p.key_features || p.keyFeatures || [],
        results: p.results || p.resultsAndOutcomes || "",
        challenges: p.challenges || p.challengesAndSolutions || "",
        futureImprovements: p.future_improvements || p.futureImprovements || "",
        architectureDiagram: p.architecture_diagram || p.architectureDiagram || "",
        topologyDiagram: p.topology_diagram || p.topologyDiagram || "",
        documentationUrl: p.documentation_url || p.documentationUrl || "",
        paperUrl: p.paper_url || p.paperUrl || "",
        technologies: p.technologies || [],
        tags: p.tags || p.technologies || [],
        metrics: p.metrics || [],
        github: p.github || '',
        demo: p.demo || '',
        image: p.image || '',
        gallery: p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
        featured: Boolean(p.featured),
        is_published: p.is_published !== undefined ? Boolean(p.is_published) : true,
        order_index: p.order_index ?? 0,
        defaultView: p.default_view || p.defaultView || 'overview',
        sections: Array.isArray(p.sections) ? p.sections : [],
        attachments: Array.isArray(p.attachments) ? p.attachments : [],
        customStyling: (typeof p.custom_styling === 'object' && p.custom_styling) ? p.custom_styling : {},
      })) : initialStaticData.projects.items;

      const projects = {
        title: sectionContent.projects_title || initialStaticData.projects.title || "Technical Projects Showcase",
        subtitle: sectionContent.projects_subtitle || initialStaticData.projects.subtitle,
        categories: sectionContent.projects_categories || initialStaticData.projects.categories,
        subcategories: sectionContent.projects_subcategories || initialStaticData.projects.subcategories,
        types: sectionContent.projects_types || initialStaticData.projects.types,
        statuses: sectionContent.projects_statuses || initialStaticData.projects.statuses,
        tags: sectionContent.projects_tags || initialStaticData.projects.tags,
        categorizedTags: sectionContent.projects_categorized_tags || initialStaticData.projects.categorizedTags,
        filterConfig: sectionContent.projects_filter_config || initialStaticData.projects.filterConfig,
        items: rawProjects.filter(item => isAdmin ? true : (item.is_published !== false)),
      };

      // Build Research Data
      const rawResearch = (researchRows && researchRows.length > 0) ? researchRows.map(r => ({
        id: r.id,
        slug: r.slug || r.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: r.title,
        type: r.type || "Conference Paper",
        category: r.category || "Network Security",
        status: r.status || "Published",
        publicationDate: r.publication_date || `${r.publication_year || '2025'}-01`,
        publicationYear: r.publication_year || (r.publication_date ? r.publication_date.split('-')[0] : '2025'),
        venue: r.venue || '',
        authors: r.authors || ["Nuwan Pinnaduwage"],
        doi: r.doi || '',
        abstract: r.abstract || '',
        fullOverview: r.full_overview || r.abstract || '',
        methodology: r.methodology || '',
        paperUrl: r.paper_url || '',
        externalUrl: r.external_url || '',
        tags: r.tags || [],
        image: r.image || '',
        featured: Boolean(r.featured),
        is_published: r.is_published !== undefined ? Boolean(r.is_published) : true,
        highlights: r.highlights || [],
        metrics: r.metrics || [],
        order_index: r.order_index ?? 0,
      })) : (sectionContent.research_data?.items || initialStaticData.research.items);

      const research = {
        title: sectionContent.research_title || initialStaticData.research.title || "Research & Publications",
        subtitle: sectionContent.research_subtitle || initialStaticData.research.subtitle,
        types: sectionContent.research_types || initialStaticData.research.types,
        categories: sectionContent.research_categories || initialStaticData.research.categories,
        statuses: sectionContent.research_statuses || initialStaticData.research.statuses,
        tags: sectionContent.research_tags || initialStaticData.research.tags,
        filterConfig: sectionContent.research_filter_config || initialStaticData.research.filterConfig,
        items: rawResearch.filter(item => isAdmin ? true : (item.is_published !== false)),
      };

      // Build Education, Experience, Achievements
      const education = {
        title: "Education",
        subtitle: "Rigorous academic curriculum emphasizing theoretical foundations and practical software design.",
        degrees: (eduRows && eduRows.length > 0) ? eduRows : initialStaticData.education.degrees,
      };

      const experience = {
        title: "Experience & Leadership",
        subtitle: "Hands-on internships, teaching assistant roles, and technical project leadership.",
        roles: (expRows && expRows.length > 0) ? expRows : initialStaticData.experience.roles,
      };

      const achievements = {
        title: "Honors & Achievements",
        subtitle: "Recognition from competitive programming, collegiate hackathons, and academic institutions.",
        items: (achRows && achRows.length > 0) ? achRows : initialStaticData.achievements.items,
      };

      // Build Contact
      const contactSettings = sectionContent.contact || {};
      const contact = {
        ...initialStaticData.contact,
        ...contactSettings,
        directEmail: profileRow?.email || contactSettings.directEmail || initialStaticData.contact.directEmail,
        location: profileRow?.location || contactSettings.location || initialStaticData.contact.location,
        phone: profileRow?.phone || contactSettings.phone || initialStaticData.contact.phone,
        socialLinks: (profileRow?.social_links && profileRow.social_links.length > 0)
          ? profileRow.social_links
          : (contactSettings.socialLinks || initialStaticData.contact.socialLinks),
        formFields: {
          ...initialStaticData.contact.formFields,
          ...(contactSettings.formFields || {})
        },
        displaySettings: {
          ...initialStaticData.contact.displaySettings,
          ...(contactSettings.displaySettings || {})
        }
      };

      // Build Footer
      const footerSettings = sectionContent.footer || {};
      const footer = {
        ...initialStaticData.footer,
        ...footerSettings,
        tagline: settingRow?.footer_tagline || footerSettings.tagline || initialStaticData.footer.tagline,
        copyrightNotice: settingRow?.footer_copyright || footerSettings.copyrightNotice || initialStaticData.footer.copyrightNotice,
      };

      // Build Settings
      const appearanceObj = sectionContent.appearance || {};
      const settings = {
        id: settingRow?.id,
        defaultTheme: settingRow?.default_theme || 'dark',
        accentColor: appearanceObj.accentColor || settingRow?.accent_color || 'neon-emerald',
        customAccentColor: appearanceObj.customAccentColor !== undefined ? appearanceObj.customAccentColor : (settingRow?.custom_accent_color || '#2D3748'),
        fontFamily: appearanceObj.fontFamily || settingRow?.font_family || 'roboto',
        fontSize: appearanceObj.fontSize || settingRow?.font_size || 'md',
        lineHeight: appearanceObj.lineHeight || settingRow?.line_height || 'normal',
        sectionAppearance: appearanceObj.sections || sectionContent.sectionAppearance || initialStaticData.settings?.sectionAppearance || {},
        showStats: settingRow?.show_stats ?? true,
        showTerminal: settingRow?.show_terminal ?? true,
        showLeetcode: settingRow?.show_leetcode ?? false,
        sectionVisibility: {
          about: true,
          skills: true,
          projects: true,
          experience: true,
          education: true,
          contact: true,
          ...(settingRow?.section_visibility || {}),
        },
        navVisibility: {
          about: true,
          skills: true,
          projects: true,
          experience: true,
          education: true,
          contact: true,
          ...(sectionContent.nav_visibility || {}),
        },
        sectionNames: {
          about: 'About',
          skills: 'Skills',
          projects: 'Projects',
          experience: 'Experience',
          education: 'Education',
          contact: 'Contact',
          ...(sectionContent.sectionNames || {}),
        },
        sectionContent: sectionContent,
        footerTagline: settingRow?.footer_tagline || footer.tagline,
        footerCopyright: settingRow?.footer_copyright || footer.copyrightNotice,
        heroBgLight: settingRow?.hero_bg_light || initialStaticData.settings?.heroBgLight || '/hero-light.png',
        heroBgDark: settingRow?.hero_bg_dark || initialStaticData.settings?.heroBgDark || '/hero-dark.png',
      };

      const formatted = {
        personal,
        about,
        skills,
        education,
        projects,
        research,
        experience,
        achievements,
        cvDetails: initialStaticData.cvDetails,
        contact,
        footer,
        settings,
      };

      // Mirror fresh database data to local cache for instant offline hydration
      if (typeof window !== 'undefined') {
        try {
          const serialized = JSON.stringify(formatted);
          localStorage.setItem('portfolio_staged_data', serialized);
          sessionStorage.setItem('portfolio_staged_data', serialized);
        } catch (e) {}
      }

      return { data: formatted, error: null };
    } catch (err) {
      console.warn("Supabase fetch failed or network offline, falling back to cache:", err);
      const staged = getStagedData();
      return { data: staged || initialStaticData, error: null };
    }
  },

  // Fetch a single project by its URL slug or ID
  async fetchProjectBySlug(slug, isAdmin = false) {
    if (!slug) return { data: null, error: 'Slug is required' };

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('projects').select('*');
        if (isUuid(slug)) {
          query = query.eq('id', slug);
        } else {
          query = query.eq('slug', slug);
        }

        if (!isAdmin) {
          query = query.eq('is_published', true);
        }

        const { data: p } = await query.maybeSingle();

        if (p) {
          const mappedProject = {
            id: p.id,
            slug: p.slug || p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: p.title,
            type: p.type || "Security Tool",
            category: p.category || "Cybersecurity",
            subcategory: p.subcategory || "",
            status: p.status || "Completed",
            completionYear: p.completion_year || p.completionYear || "2024",
            completionDate: p.completion_date || p.completionDate || "2024-01",
            startDate: p.start_date || p.startDate || "",
            tagline: p.tagline || "",
            description: p.description || "",
            fullOverview: p.full_overview || p.fullOverview || p.description || "",
            problemStatement: p.problem_statement || p.problemStatement || "",
            objectives: p.objectives || "",
            proposedSolution: p.proposed_solution || p.proposedSolution || "",
            methodology: p.methodology || "",
            technicalImplementation: p.technical_implementation || p.technicalImplementation || p.full_overview || p.description || "",
            keyFeatures: p.highlights || p.key_features || p.keyFeatures || [],
            highlights: p.highlights || p.key_features || p.keyFeatures || [],
            results: p.results || p.resultsAndOutcomes || "",
            challenges: p.challenges || p.challengesAndSolutions || "",
            futureImprovements: p.future_improvements || p.futureImprovements || "",
            architectureDiagram: p.architecture_diagram || p.architectureDiagram || "",
            topologyDiagram: p.topology_diagram || p.topologyDiagram || "",
            documentationUrl: p.documentation_url || p.documentationUrl || "",
            paperUrl: p.paper_url || p.paperUrl || "",
            technologies: p.technologies || [],
            tags: p.tags || p.technologies || [],
            metrics: p.metrics || [],
            github: p.github || '',
            demo: p.demo || '',
            image: p.image || '',
            gallery: p.gallery && p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []),
            featured: Boolean(p.featured),
            is_published: p.is_published !== undefined ? Boolean(p.is_published) : true,
            order_index: p.order_index ?? 0,
            defaultView: p.default_view || p.defaultView || 'overview',
            sections: Array.isArray(p.sections) ? p.sections : [],
            attachments: Array.isArray(p.attachments) ? p.attachments : [],
            customStyling: (typeof p.custom_styling === 'object' && p.custom_styling) ? p.custom_styling : {},
          };
          return { data: mappedProject, error: null };
        }
      } catch (err) {
        console.warn('Error fetching project by slug from Supabase:', err);
      }
    }

    const staged = getStagedData();
    const items = staged?.projects?.items || initialStaticData.projects.items || [];
    const found = items.find(
      (item) => item.slug === slug || item.id === slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );

    if (found) {
      if (!isAdmin && found.is_published === false) {
        return { data: null, error: 'Project is not published' };
      }
      return { data: found, error: null };
    }

    return { data: null, error: 'Project not found' };
  },

  // Save / Update Profile (supports partial updates, flat objects, and nested objects without data loss)
  async updateProfile(profileData) {
    if (!profileData || typeof profileData !== 'object') {
      return { success: false, error: 'Invalid profile payload' };
    }

    persistStagedChange((prev) => {
      const personalUpdates = {
        ...(profileData.personal || {}),
        ...(profileData.name !== undefined ? { name: profileData.name } : {}),
        ...(profileData.preferred_name !== undefined ? { preferredName: profileData.preferred_name } : {}),
        ...(profileData.role !== undefined ? { role: profileData.role } : {}),
        ...(profileData.degree !== undefined ? { degree: profileData.degree } : {}),
        ...(profileData.specialization !== undefined ? { specialization: profileData.specialization } : {}),
        ...(profileData.university !== undefined ? { university: profileData.university } : {}),
        ...(profileData.expected_graduation !== undefined ? { expectedGraduation: profileData.expected_graduation } : {}),
        ...(profileData.location !== undefined ? { location: profileData.location } : {}),
        ...(profileData.email !== undefined ? { email: profileData.email } : {}),
        ...(profileData.phone !== undefined ? { phone: profileData.phone } : {}),
        ...(profileData.bio_short !== undefined ? { bioShort: profileData.bio_short } : {}),
        ...(profileData.avatar_url !== undefined ? { avatarUrl: profileData.avatar_url } : {}),
        ...(profileData.cv_url !== undefined ? { cvUrl: profileData.cv_url } : {}),
        ...(profileData.cv_filename !== undefined ? { resumeFileName: profileData.cv_filename } : {}),
        ...(profileData.social_links !== undefined ? { socialLinks: profileData.social_links } : {}),
        ...(profileData.status_available !== undefined || profileData.status_text !== undefined ? {
          statusBadge: {
            available: profileData.status_available !== undefined ? Boolean(profileData.status_available) : (prev.personal?.statusBadge?.available ?? true),
            text: profileData.status_text || prev.personal?.statusBadge?.text || 'AVAILABLE FOR OPPORTUNITIES.'
          }
        } : {})
      };

      const aboutUpdates = {
        ...(profileData.about || {}),
        ...(profileData.bio_paragraphs !== undefined ? { paragraphs: profileData.bio_paragraphs } : {}),
        ...(profileData.who_i_am_heading !== undefined ? { whoIAmHeading: profileData.who_i_am_heading } : {}),
        ...(profileData.professional_summary !== undefined ? { professionalSummary: profileData.professional_summary } : {}),
        ...(profileData.about_highlights !== undefined ? { highlights: profileData.about_highlights } : {}),
        ...(profileData.terminal_facts !== undefined ? { terminalFacts: profileData.terminal_facts } : {})
      };

      return {
        ...prev,
        personal: { ...prev.personal, ...personalUpdates },
        about: { ...prev.about, ...aboutUpdates }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      // Build safe partial payload for Supabase - ONLY including keys that were explicitly supplied
      const payload = {
        updated_at: new Date().toISOString()
      };

      // Extract values from either top-level or nested objects
      const pName = profileData.name ?? profileData.personal?.name;
      if (pName !== undefined) payload.name = pName;

      const pPreferred = profileData.preferred_name ?? profileData.personal?.preferredName;
      if (pPreferred !== undefined) payload.preferred_name = pPreferred;

      const pRole = profileData.role ?? profileData.personal?.role;
      if (pRole !== undefined) payload.role = pRole;

      const pDegree = profileData.degree ?? profileData.personal?.degree;
      if (pDegree !== undefined) payload.degree = pDegree;

      const pSpec = profileData.specialization ?? profileData.personal?.specialization;
      if (pSpec !== undefined) payload.specialization = pSpec;

      const pUni = profileData.university ?? profileData.personal?.university;
      if (pUni !== undefined) payload.university = pUni;

      const pGrad = profileData.expected_graduation ?? profileData.personal?.expectedGraduation;
      if (pGrad !== undefined) payload.expected_graduation = pGrad;

      const pStatusAvail = profileData.status_available ?? profileData.personal?.statusBadge?.available;
      if (pStatusAvail !== undefined) payload.status_available = Boolean(pStatusAvail);

      const pStatusText = profileData.status_text ?? profileData.personal?.statusBadge?.text;
      if (pStatusText !== undefined) payload.status_text = pStatusText;

      const pLoc = profileData.location ?? profileData.personal?.location;
      if (pLoc !== undefined) payload.location = pLoc;

      const pEmail = profileData.email ?? profileData.personal?.email;
      if (pEmail !== undefined) payload.email = pEmail;

      const pPhone = profileData.phone ?? profileData.personal?.phone;
      if (pPhone !== undefined) payload.phone = pPhone;

      const pBioShort = profileData.bio_short ?? profileData.personal?.bioShort;
      if (pBioShort !== undefined) payload.bio_short = pBioShort;

      const pBioPara = profileData.bio_paragraphs ?? profileData.about?.paragraphs;
      if (pBioPara !== undefined) payload.bio_paragraphs = pBioPara;

      const pHeading = profileData.who_i_am_heading ?? profileData.about?.whoIAmHeading;
      if (pHeading !== undefined) payload.who_i_am_heading = pHeading;

      const pSummary = profileData.professional_summary ?? profileData.about?.professionalSummary;
      if (pSummary !== undefined) payload.professional_summary = pSummary;

      const pAvatar = profileData.avatar_url ?? profileData.personal?.avatarUrl;
      if (pAvatar !== undefined) payload.avatar_url = pAvatar;

      const pCvUrl = profileData.cv_url ?? profileData.personal?.cvUrl;
      if (pCvUrl !== undefined) payload.cv_url = pCvUrl;

      const pCvName = profileData.cv_filename ?? profileData.personal?.resumeFileName;
      if (pCvName !== undefined) payload.cv_filename = pCvName;

      const pQuick = profileData.quick_stats ?? profileData.personal?.quickStats;
      if (pQuick !== undefined) payload.quick_stats = pQuick;

      const pSocial = profileData.social_links ?? profileData.personal?.socialLinks;
      if (pSocial !== undefined) payload.social_links = pSocial;

      const pFacts = profileData.terminal_facts ?? profileData.about?.terminalFacts;
      if (pFacts !== undefined) payload.terminal_facts = pFacts;

      const pHighlights = profileData.about_highlights ?? profileData.about?.highlights;
      if (pHighlights !== undefined) payload.about_highlights = pHighlights;

      const pHeroBgs = profileData.hero_backgrounds ?? profileData.personal?.heroBackgrounds;
      if (pHeroBgs !== undefined) payload.hero_backgrounds = pHeroBgs;

      const { data: existing } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      if (existing?.id) {
        const { error } = await supabase.from('profiles').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        // When inserting for the first time, provide sensible defaults for missing fields
        const fullInsert = {
          name: 'Nuwan Pinnaduwage',
          preferred_name: 'Nuwan',
          role: 'Full-Stack Software Engineer & Cyber Security Specialist',
          degree: 'Bachelor of Science in Computer Science',
          status_available: true,
          status_text: 'AVAILABLE FOR OPPORTUNITIES.',
          cv_filename: 'Nuwan_Pinnaduwage_Technical_Resume.pdf',
          ...payload
        };
        const { error } = await supabase.from('profiles').insert([fullInsert]);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to update profile in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save (Create or Update) Project
  async saveProject(project) {
    if (!project.title || !project.title.trim()) {
      return { success: false, error: 'Project title is required' };
    }

    const techArray = Array.isArray(project.technologies) 
      ? project.technologies 
      : (typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);
    
    const tagsArray = Array.isArray(project.tags)
      ? project.tags
      : (typeof project.tags === 'string' ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : techArray);

    const keyFeaturesArray = Array.isArray(project.keyFeatures)
      ? project.keyFeatures
      : (typeof project.keyFeatures === 'string' ? project.keyFeatures.split('\n').map(s => s.trim()).filter(Boolean) : (project.highlights || []));

    const metricsArray = Array.isArray(project.metrics)
      ? project.metrics
      : (typeof project.metrics === 'string' ? project.metrics.split('\n').map(s => s.trim()).filter(Boolean) : []);

    const galleryArray = Array.isArray(project.gallery)
      ? project.gallery
      : (typeof project.gallery === 'string' ? project.gallery.split('\n').map(s => s.trim()).filter(Boolean) : (project.image ? [project.image] : []));

    // Update local cache optimistically
    persistStagedChange((prev) => {
      const existingItems = prev.projects?.items || initialStaticData.projects.items;
      const existingIdx = existingItems.findIndex(p => p.id === project.id || (p.slug && p.slug === project.slug));
      let updatedItems = [...existingItems];

      const newItem = {
        ...project,
        id: project.id || `proj-${Date.now()}`,
        slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: project.type || 'Security Tool',
        category: project.category || 'Cybersecurity',
        subcategory: project.subcategory || '',
        status: project.status || 'Completed',
        completionYear: project.completionYear || (project.completionDate ? project.completionDate.split('-')[0] : '2024'),
        completionDate: project.completionDate || `${project.completionYear || '2024'}-01`,
        startDate: project.startDate || '',
        tagline: project.tagline || '',
        description: project.description || '',
        fullOverview: project.fullOverview || project.description || '',
        problemStatement: project.problemStatement || '',
        objectives: project.objectives || '',
        proposedSolution: project.proposedSolution || '',
        methodology: project.methodology || '',
        technicalImplementation: project.technicalImplementation || project.fullOverview || project.description || '',
        keyFeatures: keyFeaturesArray,
        highlights: keyFeaturesArray,
        results: project.results || '',
        challenges: project.challenges || '',
        futureImprovements: project.futureImprovements || '',
        architectureDiagram: project.architectureDiagram || '',
        topologyDiagram: project.topologyDiagram || '',
        documentationUrl: project.documentationUrl || '',
        paperUrl: project.paperUrl || '',
        technologies: techArray,
        tags: tagsArray.length > 0 ? tagsArray : techArray,
        metrics: metricsArray,
        gallery: galleryArray,
        github: project.github || '',
        demo: project.demo || '',
        image: project.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
        featured: Boolean(project.featured),
        is_published: project.is_published !== undefined ? Boolean(project.is_published) : true,
        defaultView: project.defaultView || 'overview',
        sections: Array.isArray(project.sections) ? project.sections : [],
        attachments: Array.isArray(project.attachments) ? project.attachments : [],
        customStyling: project.customStyling || project.custom_styling || {},
      };

      if (existingIdx >= 0) {
        updatedItems[existingIdx] = newItem;
      } else {
        updatedItems.unshift(newItem);
      }

      return {
        ...prev,
        projects: {
          ...(prev.projects || initialStaticData.projects),
          items: updatedItems
        }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const generatedSlug = project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        title: project.title.trim(),
        slug: generatedSlug,
        category: project.category || 'Cybersecurity',
        subcategory: project.subcategory || '',
        type: project.type || 'Security Tool',
        status: project.status || 'Completed',
        completion_year: project.completionYear || (project.completionDate ? project.completionDate.split('-')[0] : '2024'),
        completion_date: project.completionDate || `${project.completionYear || '2024'}-01`,
        start_date: project.startDate || '',
        tagline: project.tagline || '',
        description: project.description || '',
        full_overview: project.fullOverview || project.description || '',
        problem_statement: project.problemStatement || '',
        objectives: project.objectives || '',
        proposed_solution: project.proposedSolution || '',
        methodology: project.methodology || '',
        technical_implementation: project.technicalImplementation || project.fullOverview || project.description || '',
        results: project.results || '',
        challenges: project.challenges || '',
        future_improvements: project.futureImprovements || '',
        architecture_diagram: project.architectureDiagram || '',
        topology_diagram: project.topologyDiagram || '',
        documentation_url: project.documentationUrl || '',
        paper_url: project.paperUrl || '',
        technologies: techArray,
        tags: tagsArray.length > 0 ? tagsArray : techArray,
        metrics: metricsArray,
        highlights: keyFeaturesArray,
        github: project.github || '',
        demo: project.demo || '',
        image: project.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
        gallery: galleryArray,
        featured: Boolean(project.featured),
        is_published: project.is_published !== undefined ? Boolean(project.is_published) : true,
        default_view: project.defaultView || 'overview',
        sections: Array.isArray(project.sections) ? project.sections : [],
        attachments: Array.isArray(project.attachments) ? project.attachments : [],
        custom_styling: project.customStyling || project.custom_styling || {},
        updated_at: new Date().toISOString()
      };

      // Determine existing row by UUID, slug, or title
      let targetRowId = null;
      if (isUuid(project.id)) {
        targetRowId = project.id;
      } else if (generatedSlug) {
        const { data: bySlug } = await supabase.from('projects').select('id').eq('slug', generatedSlug).maybeSingle();
        if (bySlug?.id) targetRowId = bySlug.id;
      }
      if (!targetRowId && project.title) {
        const { data: byTitle } = await supabase.from('projects').select('id').eq('title', project.title.trim()).maybeSingle();
        if (byTitle?.id) targetRowId = byTitle.id;
      }

      if (targetRowId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', targetRowId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to persist project to Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Duplicate an existing project
  async duplicateProject(id) {
    const staged = getStagedData() || initialStaticData;
    const existingItems = staged.projects?.items || initialStaticData.projects.items;
    const target = existingItems.find(p => p.id === id);
    if (!target) return { success: false, error: 'Project not found' };

    const duplicated = {
      ...target,
      id: undefined, // Let Supabase generate a fresh UUID
      title: `${target.title} (Copy)`,
      slug: `${target.slug || target.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-copy-${Date.now().toString().slice(-4)}`,
      is_published: false,
      featured: false,
    };

    return this.saveProject(duplicated);
  },

  // Toggle Project Featured
  async toggleProjectFeatured(id) {
    let nextFeatured = true;
    persistStagedChange((prev) => {
      const items = (prev.projects?.items || initialStaticData.projects.items).map(item => {
        if (item.id === id) {
          nextFeatured = !item.featured;
          return { ...item, featured: nextFeatured };
        }
        return item;
      });
      return {
        ...prev,
        projects: { ...(prev.projects || initialStaticData.projects), items }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        let rowId = id;
        if (!isUuid(id)) {
          const { data: found } = await supabase.from('projects').select('id, featured').or(`slug.eq.${id},title.eq.${id}`).maybeSingle();
          if (found?.id) {
            rowId = found.id;
            nextFeatured = !found.featured;
          }
        }
        if (rowId && isUuid(rowId)) {
          const { error } = await supabase.from('projects').update({ featured: nextFeatured, updated_at: new Date().toISOString() }).eq('id', rowId);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Failed to toggle project featured in Supabase:", err);
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  // Toggle Project Visibility (Show / Hide)
  async toggleProjectVisibility(id) {
    let nextPublished = true;
    persistStagedChange((prev) => {
      const items = (prev.projects?.items || initialStaticData.projects.items).map(item => {
        if (item.id === id) {
          nextPublished = item.is_published === false ? true : false;
          return { ...item, is_published: nextPublished };
        }
        return item;
      });
      return {
        ...prev,
        projects: { ...(prev.projects || initialStaticData.projects), items }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        let rowId = id;
        if (!isUuid(id)) {
          const { data: found } = await supabase.from('projects').select('id, is_published').or(`slug.eq.${id},title.eq.${id}`).maybeSingle();
          if (found?.id) {
            rowId = found.id;
            nextPublished = found.is_published === false ? true : false;
          }
        }
        if (rowId && isUuid(rowId)) {
          const { error } = await supabase.from('projects').update({ is_published: nextPublished, updated_at: new Date().toISOString() }).eq('id', rowId);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Failed to toggle project visibility in Supabase:", err);
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  // Reorder Projects
  async reorderProjects(orderedIds) {
    persistStagedChange((prev) => {
      const existingItems = prev.projects?.items || initialStaticData.projects.items;
      const itemMap = new Map(existingItems.map(item => [item.id, item]));
      const reordered = [];
      orderedIds.forEach(id => {
        if (itemMap.has(id)) {
          reordered.push(itemMap.get(id));
          itemMap.delete(id);
        }
      });
      itemMap.forEach(item => reordered.push(item));
      return {
        ...prev,
        projects: { ...(prev.projects || initialStaticData.projects), items: reordered }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          const id = orderedIds[i];
          if (isUuid(id)) {
            await supabase.from('projects').update({ order_index: i }).eq('id', id);
          }
        }
      } catch (err) {
        console.error("Failed to reorder projects in Supabase:", err);
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  // Delete Project
  async deleteProject(id) {
    persistStagedChange((prev) => ({
      ...prev,
      projects: {
        ...(prev.projects || initialStaticData.projects),
        items: (prev.projects?.items || initialStaticData.projects.items).filter(p => p.id !== id)
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      let rowId = id;
      if (!isUuid(id)) {
        const { data: found } = await supabase.from('projects').select('id').or(`slug.eq.${id},title.eq.${id}`).maybeSingle();
        if (found?.id) rowId = found.id;
      }
      if (rowId && isUuid(rowId)) {
        const { error } = await supabase.from('projects').delete().eq('id', rowId);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete project in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Subcategory management
  async saveSubcategory(categoryName, subcategoryName) {
    persistStagedChange((prev) => {
      const subcategories = { ...(prev.projects?.subcategories || initialStaticData.projects.subcategories || {}) };
      const currentList = subcategories[categoryName] || [];
      if (!currentList.includes(subcategoryName)) {
        subcategories[categoryName] = [...currentList, subcategoryName];
      }
      return {
        ...prev,
        projects: { ...(prev.projects || initialStaticData.projects), subcategories }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          const subcategories = { ...(sc.projects_subcategories || initialStaticData.projects.subcategories || {}) };
          const list = subcategories[categoryName] || [];
          if (!list.includes(subcategoryName)) {
            subcategories[categoryName] = [...list, subcategoryName];
          }
          await supabase.from('site_settings').update({
            section_content: { ...sc, projects_subcategories: subcategories },
            updated_at: new Date().toISOString()
          }).eq('id', setting.id);
        }
      } catch (err) {
        console.warn("Subcategory save note:", err);
      }
    }

    return { success: true, error: null };
  },

  async deleteSubcategory(categoryName, subcategoryName) {
    persistStagedChange((prev) => {
      const subcategories = { ...(prev.projects?.subcategories || initialStaticData.projects.subcategories || {}) };
      const currentList = subcategories[categoryName] || [];
      subcategories[categoryName] = currentList.filter(s => s !== subcategoryName);
      return {
        ...prev,
        projects: { ...(prev.projects || initialStaticData.projects), subcategories }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          const subcategories = { ...(sc.projects_subcategories || initialStaticData.projects.subcategories || {}) };
          const list = subcategories[categoryName] || [];
          subcategories[categoryName] = list.filter(s => s !== subcategoryName);
          await supabase.from('site_settings').update({
            section_content: { ...sc, projects_subcategories: subcategories },
            updated_at: new Date().toISOString()
          }).eq('id', setting.id);
        }
      } catch (err) {
        console.warn("Subcategory delete note:", err);
      }
    }

    return { success: true, error: null };
  },

  // Save (Create or Update) Research Item
  async saveResearch(item) {
    if (!item.title || !item.title.trim()) {
      return { success: false, error: 'Research title is required' };
    }

    const tagsArray = Array.isArray(item.tags)
      ? item.tags
      : (typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const authorsArray = Array.isArray(item.authors)
      ? item.authors
      : (typeof item.authors === 'string' ? item.authors.split(',').map(a => a.trim()).filter(Boolean) : ["Nuwan Pinnaduwage"]);

    const highlightsArray = Array.isArray(item.highlights)
      ? item.highlights
      : (typeof item.highlights === 'string' ? item.highlights.split('\n').map(h => h.trim()).filter(Boolean) : []);

    const metricsArray = Array.isArray(item.metrics)
      ? item.metrics
      : (typeof item.metrics === 'string' ? item.metrics.split('\n').map(m => m.trim()).filter(Boolean) : []);

    // Update local cache optimistically
    persistStagedChange((prev) => {
      const existingItems = prev.research?.items || initialStaticData.research.items;
      const existingIdx = existingItems.findIndex(r => r.id === item.id || (r.slug && r.slug === item.slug));
      let updatedItems = [...existingItems];

      const newItem = {
        ...item,
        id: item.id || `res-${Date.now()}`,
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: item.type || 'Conference Paper',
        category: item.category || 'Network Security',
        status: item.status || 'Published',
        publicationYear: item.publicationYear || (item.publicationDate ? item.publicationDate.split('-')[0] : '2025'),
        publicationDate: item.publicationDate || `${item.publicationYear || '2025'}-01`,
        authors: authorsArray,
        tags: tagsArray,
        highlights: highlightsArray,
        metrics: metricsArray,
        image: item.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
        featured: Boolean(item.featured),
        is_published: item.is_published !== undefined ? Boolean(item.is_published) : true,
      };

      if (existingIdx >= 0) {
        updatedItems[existingIdx] = newItem;
      } else {
        updatedItems.unshift(newItem);
      }

      return {
        ...prev,
        research: { ...(prev.research || initialStaticData.research), items: updatedItems }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        title: item.title.trim(),
        slug: generatedSlug,
        type: item.type || 'Conference Paper',
        category: item.category || 'Network Security',
        status: item.status || 'Published',
        publication_date: item.publicationDate || `${item.publicationYear || '2025'}-01`,
        publication_year: item.publicationYear || (item.publicationDate ? item.publicationDate.split('-')[0] : '2025'),
        venue: item.venue || '',
        authors: authorsArray,
        doi: item.doi || '',
        abstract: item.abstract || '',
        full_overview: item.fullOverview || item.abstract || '',
        methodology: item.methodology || '',
        paper_url: item.paperUrl || '',
        external_url: item.externalUrl || '',
        tags: tagsArray,
        image: item.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=900',
        featured: Boolean(item.featured),
        is_published: item.is_published !== undefined ? Boolean(item.is_published) : true,
        highlights: highlightsArray,
        metrics: metricsArray,
        updated_at: new Date().toISOString()
      };

      // 1. Save to research table
      let targetRowId = null;
      if (isUuid(item.id)) {
        targetRowId = item.id;
      } else if (generatedSlug) {
        const { data: bySlug } = await supabase.from('research').select('id').eq('slug', generatedSlug).maybeSingle();
        if (bySlug?.id) targetRowId = bySlug.id;
      }
      if (!targetRowId && item.title) {
        const { data: byTitle } = await supabase.from('research').select('id').eq('title', item.title.trim()).maybeSingle();
        if (byTitle?.id) targetRowId = byTitle.id;
      }

      if (targetRowId) {
        const { error } = await supabase.from('research').update(payload).eq('id', targetRowId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('research').insert([payload]);
        if (error) throw error;
      }

      // 2. Dual-path redundancy: Also sync to site_settings.section_content.research_data
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          const rd = sc.research_data || { items: [] };
          const items = [...(rd.items || [])];
          const idx = items.findIndex(r => r.id === item.id || r.slug === generatedSlug);
          if (idx >= 0) items[idx] = { ...items[idx], ...item, ...payload };
          else items.unshift({ ...item, ...payload });
          await supabase.from('site_settings').update({
            section_content: { ...sc, research_data: { ...rd, items } },
            updated_at: new Date().toISOString()
          }).eq('id', setting.id);
        }
      } catch (e) {}

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save research in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete Research Item
  async deleteResearch(id) {
    persistStagedChange((prev) => ({
      ...prev,
      research: {
        ...(prev.research || initialStaticData.research),
        items: (prev.research?.items || initialStaticData.research.items).filter(r => r.id !== id)
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      let rowId = id;
      if (!isUuid(id)) {
        const { data: found } = await supabase.from('research').select('id').or(`slug.eq.${id},title.eq.${id}`).maybeSingle();
        if (found?.id) rowId = found.id;
      }
      if (rowId && isUuid(rowId)) {
        const { error } = await supabase.from('research').delete().eq('id', rowId);
        if (error) throw error;
      }

      // Sync deletion in site_settings.section_content.research_data
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          const rd = sc.research_data || { items: [] };
          const items = (rd.items || []).filter(r => r.id !== id && r.slug !== id);
          await supabase.from('site_settings').update({
            section_content: { ...sc, research_data: { ...rd, items } }
          }).eq('id', setting.id);
        }
      } catch (e) {}

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete research in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Toggle Research Visibility (Show / Hide)
  async toggleResearchVisibility(id) {
    let nextPublished = true;
    persistStagedChange((prev) => {
      const items = (prev.research?.items || initialStaticData.research.items).map(item => {
        if (item.id === id) {
          nextPublished = item.is_published === false ? true : false;
          return { ...item, is_published: nextPublished };
        }
        return item;
      });
      return {
        ...prev,
        research: { ...(prev.research || initialStaticData.research), items }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        let rowId = id;
        if (!isUuid(id)) {
          const { data: found } = await supabase.from('research').select('id, is_published').or(`slug.eq.${id},title.eq.${id}`).maybeSingle();
          if (found?.id) {
            rowId = found.id;
            nextPublished = found.is_published === false ? true : false;
          }
        }
        if (rowId && isUuid(rowId)) {
          const { error } = await supabase.from('research').update({ is_published: nextPublished, updated_at: new Date().toISOString() }).eq('id', rowId);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Failed to toggle research visibility in Supabase:", err);
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  // Tags Management: Add Tag
  async addTag(tagName, context = 'both') {
    if (!tagName || !tagName.trim()) return { success: false, error: 'Tag cannot be empty' };
    const cleanTag = tagName.trim();

    persistStagedChange((prev) => {
      const nextState = { ...prev };
      if (context === 'projects' || context === 'both') {
        const pTags = new Set(prev.projects?.tags || initialStaticData.projects.tags || []);
        pTags.add(cleanTag);
        nextState.projects = { ...(prev.projects || initialStaticData.projects), tags: Array.from(pTags) };
      }
      if (context === 'research' || context === 'both') {
        const rTags = new Set(prev.research?.tags || initialStaticData.research.tags || []);
        rTags.add(cleanTag);
        nextState.research = { ...(prev.research || initialStaticData.research), tags: Array.from(rTags) };
      }
      return nextState;
    });

    return { success: true, error: null };
  },

  // Tags Management: Rename Tag
  async renameTag(oldTag, newTag, context = 'both') {
    if (!oldTag || !newTag || !newTag.trim()) return { success: false, error: 'Invalid tag names' };
    const cleanNew = newTag.trim();

    persistStagedChange((prev) => {
      const nextState = { ...prev };
      if (context === 'projects' || context === 'both') {
        const pTags = (prev.projects?.tags || initialStaticData.projects.tags || []).map(t => t === oldTag ? cleanNew : t);
        const pItems = (prev.projects?.items || initialStaticData.projects.items).map(item => {
          const updatedTags = (item.tags || []).map(t => t === oldTag ? cleanNew : t);
          const updatedTech = (item.technologies || []).map(t => t === oldTag ? cleanNew : t);
          return { ...item, tags: updatedTags, technologies: updatedTech };
        });
        nextState.projects = {
          ...(prev.projects || initialStaticData.projects),
          tags: Array.from(new Set(pTags)),
          items: pItems
        };
      }
      if (context === 'research' || context === 'both') {
        const rTags = (prev.research?.tags || initialStaticData.research.tags || []).map(t => t === oldTag ? cleanNew : t);
        const rItems = (prev.research?.items || initialStaticData.research.items).map(item => {
          const updatedTags = (item.tags || []).map(t => t === oldTag ? cleanNew : t);
          return { ...item, tags: updatedTags };
        });
        nextState.research = {
          ...(prev.research || initialStaticData.research),
          tags: Array.from(new Set(rTags)),
          items: rItems
        };
      }
      return nextState;
    });

    return { success: true, error: null };
  },

  // Tags Management: Delete Tag
  async deleteTag(tagName, context = 'both') {
    persistStagedChange((prev) => {
      const nextState = { ...prev };
      if (context === 'projects' || context === 'both') {
        const pTags = (prev.projects?.tags || initialStaticData.projects.tags || []).filter(t => t !== tagName);
        const pItems = (prev.projects?.items || initialStaticData.projects.items).map(item => ({
          ...item,
          tags: (item.tags || []).filter(t => t !== tagName),
          technologies: (item.technologies || []).filter(t => t !== tagName),
        }));
        nextState.projects = {
          ...(prev.projects || initialStaticData.projects),
          tags: pTags,
          items: pItems
        };
      }
      if (context === 'research' || context === 'both') {
        const rTags = (prev.research?.tags || initialStaticData.research.tags || []).filter(t => t !== tagName);
        const rItems = (prev.research?.items || initialStaticData.research.items).map(item => ({
          ...item,
          tags: (item.tags || []).filter(t => t !== tagName),
        }));
        nextState.research = {
          ...(prev.research || initialStaticData.research),
          tags: rTags,
          items: rItems
        };
      }
      return nextState;
    });

    return { success: true, error: null };
  },

  // Types Management: Save
  async saveType({ oldName, newName }, context = 'projects') {
    if (!newName || !newName.trim()) return { success: false, error: 'Type name required' };
    const cleanNew = newName.trim();

    persistStagedChange((prev) => {
      const targetObj = prev[context] || initialStaticData[context];
      let types = [...(targetObj.types || [])];
      if (oldName) {
        types = types.map(t => t === oldName ? cleanNew : t);
        const items = (targetObj.items || []).map(item => {
          if (item.type === oldName) return { ...item, type: cleanNew };
          return item;
        });
        return {
          ...prev,
          [context]: { ...targetObj, types: Array.from(new Set(types)), items }
        };
      } else {
        if (!types.includes(cleanNew)) types.push(cleanNew);
        return {
          ...prev,
          [context]: { ...targetObj, types }
        };
      }
    });

    return { success: true, error: null };
  },

  // Types Management: Delete Type
  async deleteType(typeName, context = 'projects') {
    if (typeName === 'All') return { success: false, error: 'Cannot delete default "All" type' };
    persistStagedChange((prev) => {
      const targetObj = prev[context] || initialStaticData[context];
      return {
        ...prev,
        [context]: {
          ...targetObj,
          types: (targetObj.types || []).filter(t => t !== typeName)
        }
      };
    });
    return { success: true, error: null };
  },

  // Categories Management: Save
  async saveCategory({ oldName, newName }, context = 'projects') {
    if (!newName || !newName.trim()) return { success: false, error: 'Category name required' };
    const cleanNew = newName.trim();

    persistStagedChange((prev) => {
      const targetObj = prev[context] || initialStaticData[context];
      let categories = [...(targetObj.categories || [])];
      if (oldName) {
        categories = categories.map(c => c === oldName ? cleanNew : c);
        const items = (targetObj.items || []).map(item => {
          if (item.category === oldName) return { ...item, category: cleanNew };
          return item;
        });
        return {
          ...prev,
          [context]: { ...targetObj, categories: Array.from(new Set(categories)), items }
        };
      } else {
        if (!categories.includes(cleanNew)) categories.push(cleanNew);
        return {
          ...prev,
          [context]: { ...targetObj, categories }
        };
      }
    });

    return { success: true, error: null };
  },

  // Categories Management: Delete Category
  async deleteCategory(categoryName, context = 'projects') {
    if (categoryName === 'All') return { success: false, error: 'Cannot delete default "All" category' };
    persistStagedChange((prev) => {
      const targetObj = prev[context] || initialStaticData[context];
      return {
        ...prev,
        [context]: {
          ...targetObj,
          categories: (targetObj.categories || []).filter(c => c !== categoryName)
        }
      };
    });
    return { success: true, error: null };
  },

  // Update Filter Configuration for Projects or Research
  async updateFilterConfig(context = 'projects', newConfig) {
    persistStagedChange((prev) => {
      const targetObj = prev[context] || initialStaticData[context];
      return {
        ...prev,
        [context]: {
          ...targetObj,
          filterConfig: { ...(targetObj.filterConfig || {}), ...newConfig }
        }
      };
    });
    return { success: true, error: null };
  },

  // Reorder items in Projects or Research
  async reorderItems(context = 'projects', orderedIds) {
    persistStagedChange((prev) => {
      const targetObj = prev[context] || initialStaticData[context];
      const itemsMap = new Map((targetObj.items || []).map(item => [item.id, item]));
      const newItems = [];
      orderedIds.forEach(id => {
        if (itemsMap.has(id)) {
          newItems.push(itemsMap.get(id));
          itemsMap.delete(id);
        }
      });
      itemsMap.forEach(item => newItems.push(item));
      return {
        ...prev,
        [context]: { ...targetObj, items: newItems }
      };
    });

    if (isSupabaseConfigured && supabase) {
      const table = context === 'research' ? 'research' : 'projects';
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          const id = orderedIds[i];
          if (isUuid(id)) {
            await supabase.from(table).update({ order_index: i }).eq('id', id);
          }
        }
      } catch (err) {
        console.error(`Failed to reorder ${table} in Supabase:`, err);
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  // Save Skill (Full CRUD support with catalog assignment, proficiency 0-100, ordering)
  async saveSkill(skill) {
    if (!skill.name || !skill.name.trim()) {
      return { success: false, error: 'Skill name is required.' };
    }

    const catId = skill.catalog_id || skill.category_id || 'network';
    const trimmedName = skill.name.trim();
    const categoryName = skill.catalog_name || skill.category_name || skill.category || getCategoryDisplayName(catId);
    const levelNum = Math.min(100, Math.max(0, Number(skill.level) || 0));

    const fullSkill = {
      id: skill.id || `skill-${catId}-${Date.now()}`,
      name: trimmedName,
      catalog_id: catId,
      category_id: catId,
      catalog_name: categoryName,
      category_name: categoryName,
      level: levelNum,
      description: skill.description ? skill.description.trim() : '',
      duration: skill.duration || '',
      is_published: skill.is_published !== undefined ? Boolean(skill.is_published) : true,
      order_index: Number(skill.order_index) || 0,
      icon: skill.icon || (catId === 'network' ? 'Network' : (catId === 'cyber_security' ? 'Shield' : 'FileCode'))
    };

    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      const categories = [...(skillsData.categories || initialStaticData.skills.categories)];
      const items = [...(skillsData.items || initialStaticData.skills.items || [])];

      const itemIdx = items.findIndex(s => s.id === fullSkill.id || (s.name.toLowerCase() === fullSkill.name.toLowerCase() && (s.catalog_id === catId || s.category_id === catId)));
      if (itemIdx >= 0) {
        items[itemIdx] = { ...items[itemIdx], ...fullSkill };
      } else {
        items.push(fullSkill);
      }

      const updatedCats = categories.map(cat => {
        const filteredSkills = (cat.skills || []).filter(s => s.id !== fullSkill.id && s.name.toLowerCase() !== fullSkill.name.toLowerCase());
        if (cat.id === catId) {
          const nextSkills = [...filteredSkills, fullSkill];
          return {
            ...cat,
            skills: nextSkills.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
          };
        }
        return { ...cat, skills: filteredSkills };
      });

      return {
        ...prev,
        skills: {
          ...skillsData,
          categories: updatedCats,
          items
        }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          name: fullSkill.name,
          category_id: fullSkill.category_id,
          category_name: fullSkill.category_name,
          catalog_id: fullSkill.catalog_id,
          catalog_name: fullSkill.catalog_name,
          level: fullSkill.level,
          icon: fullSkill.icon,
          tag: `${fullSkill.level}%`,
          description: fullSkill.description,
          duration: fullSkill.duration,
          is_published: fullSkill.is_published,
          order_index: fullSkill.order_index,
        };

        let targetRowId = null;
        if (isUuid(skill.id)) {
          targetRowId = skill.id;
        } else {
          const { data: found } = await supabase
            .from('skills')
            .select('id')
            .eq('name', fullSkill.name)
            .eq('catalog_id', fullSkill.catalog_id)
            .maybeSingle();
          if (found?.id) targetRowId = found.id;
        }

        if (targetRowId) {
          const { error } = await supabase.from('skills').update(payload).eq('id', targetRowId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('skills').insert([payload]);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Failed to save skill to Supabase:", err);
        return { success: false, error: err.message };
      }
    }

    return { success: true, data: fullSkill, error: null };
  },

  // Delete Skill
  async deleteSkill(id, skillName) {
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      const categories = [...(skillsData.categories || initialStaticData.skills.categories)];
      const items = (skillsData.items || initialStaticData.skills.items || []).filter(
        s => s.id !== id && s.name !== skillName
      );

      const updatedCats = categories.map(cat => ({
        ...cat,
        skills: (cat.skills || []).filter(s => s.id !== id && s.name !== skillName)
      }));

      return {
        ...prev,
        skills: { ...skillsData, categories: updatedCats, items }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        let rowId = id;
        if (!isUuid(id)) {
          const { data: found } = await supabase.from('skills').select('id').eq('name', skillName || id).maybeSingle();
          if (found?.id) rowId = found.id;
        }
        if (rowId && isUuid(rowId)) {
          const { error } = await supabase.from('skills').delete().eq('id', rowId);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Failed to delete skill in Supabase:", err);
        return { success: false, error: err.message };
      }
    }

    return { success: true, error: null };
  },

  // Move Skill to a different Catalog
  async moveSkillToCatalog(skillId, targetCatalogId) {
    const staged = getStagedData() || initialStaticData;
    const allSkills = staged.skills?.items || initialStaticData.skills.items;
    const skill = allSkills.find(s => s.id === skillId);
    if (!skill) return { success: false, error: 'Skill not found' };

    const targetCat = (staged.skills?.categories || initialStaticData.skills.categories).find(c => c.id === targetCatalogId);
    const targetName = targetCat?.name || getCategoryDisplayName(targetCatalogId);

    return this.saveSkill({
      ...skill,
      catalog_id: targetCatalogId,
      category_id: targetCatalogId,
      catalog_name: targetName,
      category_name: targetName
    });
  },

  // Duplicate Skill
  async duplicateSkill(id) {
    const staged = getStagedData() || initialStaticData;
    const allSkills = staged.skills?.items || initialStaticData.skills.items;
    const original = allSkills.find(s => s.id === id);
    if (!original) return { success: false, error: 'Skill not found' };

    const duplicated = {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      is_published: false
    };

    return this.saveSkill(duplicated);
  },

  // Toggle Skill Visibility
  async toggleSkillVisibility(id) {
    const staged = getStagedData() || initialStaticData;
    const allSkills = staged.skills?.items || initialStaticData.skills.items;
    const skill = allSkills.find(s => s.id === id);
    if (!skill) return { success: false, error: 'Skill not found' };

    return this.saveSkill({
      ...skill,
      is_published: !skill.is_published
    });
  },

  // Toggle Skill Featured
  async toggleSkillFeatured(id) {
    const staged = getStagedData() || initialStaticData;
    const allSkills = staged.skills?.items || initialStaticData.skills.items;
    const skill = allSkills.find(s => s.id === id);
    if (!skill) return { success: false, error: 'Skill not found' };

    return this.saveSkill({
      ...skill,
      featured: !skill.featured
    });
  },

  // Reorder Skills inside a catalog
  async reorderSkills(categoryId, orderedSkillIds) {
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      const categories = [...(skillsData.categories || initialStaticData.skills.categories)];

      const catIdx = categories.findIndex(c => c.id === categoryId);
      if (catIdx >= 0) {
        const catSkills = [...(categories[catIdx].skills || [])];
        const reordered = [];
        orderedSkillIds.forEach((id, index) => {
          const item = catSkills.find(s => s.id === id);
          if (item) {
            item.order_index = index + 1;
            reordered.push(item);
          }
        });
        catSkills.forEach(s => {
          if (!orderedSkillIds.includes(s.id)) reordered.push(s);
        });
        categories[catIdx] = { ...categories[catIdx], skills: reordered };
      }

      return {
        ...prev,
        skills: { ...skillsData, categories }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        for (let i = 0; i < orderedSkillIds.length; i++) {
          const id = orderedSkillIds[i];
          if (isUuid(id)) {
            await supabase.from('skills').update({ order_index: i + 1 }).eq('id', id);
          }
        }
      } catch (err) {
        console.error("Failed to reorder skills in Supabase:", err);
        return { success: false, error: err.message };
      }
    }

    return { success: true };
  },

  // Save Skill Catalog (Add or Edit)
  async saveSkillCatalog(cat) {
    if (!cat.name || !cat.name.trim()) {
      return { success: false, error: 'Catalog name is required.' };
    }

    const trimmedName = cat.name.trim();
    const catId = cat.id || `cat-${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    let updatedCats = [];
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      const currentCats = [...(skillsData.categories || initialStaticData.skills.categories)];
      const idx = currentCats.findIndex(c => c.id === catId);

      if (idx >= 0) {
        currentCats[idx] = {
          ...currentCats[idx],
          name: trimmedName,
          description: cat.description !== undefined ? cat.description.trim() : currentCats[idx].description,
          order_index: cat.order_index !== undefined ? Number(cat.order_index) : currentCats[idx].order_index,
          is_published: cat.is_published !== undefined ? Boolean(cat.is_published) : currentCats[idx].is_published,
        };
      } else {
        currentCats.push({
          id: catId,
          name: trimmedName,
          description: cat.description ? cat.description.trim() : '',
          order_index: cat.order_index ? Number(cat.order_index) : (currentCats.length + 1),
          is_published: cat.is_published !== undefined ? Boolean(cat.is_published) : true,
          skills: []
        });
      }

      updatedCats = currentCats.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      return {
        ...prev,
        skills: { ...skillsData, categories: updatedCats }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          await supabase.from('site_settings').update({
            section_content: { ...sc, skills_catalogs: updatedCats },
            updated_at: new Date().toISOString()
          }).eq('id', setting.id);
        }
      } catch (err) {
        console.error("Failed to persist skill catalog to Supabase:", err);
      }
    }

    return { success: true, data: { id: catId, name: trimmedName }, error: null };
  },

  async saveSkillCategory(cat) {
    return this.saveSkillCatalog(cat);
  },

  // Delete Skill Catalog
  async deleteSkillCatalog(catId) {
    let remainingCats = [];
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      remainingCats = (skillsData.categories || []).filter(c => c.id !== catId);
      const items = (skillsData.items || []).filter(s => s.catalog_id !== catId && s.category_id !== catId);

      return {
        ...prev,
        skills: { ...skillsData, categories: remainingCats, items }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          await supabase.from('site_settings').update({
            section_content: { ...sc, skills_catalogs: remainingCats },
            updated_at: new Date().toISOString()
          }).eq('id', setting.id);
        }
        // Also delete skills belonging to this catalog
        await supabase.from('skills').delete().or(`catalog_id.eq.${catId},category_id.eq.${catId}`);
      } catch (err) {
        console.error("Failed to delete skill catalog in Supabase:", err);
      }
    }

    return { success: true, error: null };
  },

  async deleteSkillCategory(catId) {
    return this.deleteSkillCatalog(catId);
  },

  // Toggle Catalog Visibility
  async toggleSkillCatalogVisibility(catId, explicitState) {
    let updatedCatalog = null;
    let allCats = [];
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      allCats = (skillsData.categories || []).map(c => {
        if (c.id === catId) {
          const nextPublished = explicitState !== undefined ? Boolean(explicitState) : !c.is_published;
          updatedCatalog = { ...c, is_published: nextPublished };
          return updatedCatalog;
        }
        return c;
      });

      return {
        ...prev,
        skills: { ...skillsData, categories: allCats }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          await supabase.from('site_settings').update({
            section_content: { ...sc, skills_catalogs: allCats },
            updated_at: new Date().toISOString()
          }).eq('id', setting.id);
        }
      } catch (err) {
        console.error("Failed to toggle catalog visibility in Supabase:", err);
      }
    }

    return { success: true, data: updatedCatalog, error: null };
  },

  // Reorder Skill Catalogs
  async reorderSkillCatalogs(orderedCatalogIds) {
    let reordered = [];
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      const categories = [...(skillsData.categories || [])];

      orderedCatalogIds.forEach((id, index) => {
        const item = categories.find(c => c.id === id);
        if (item) {
          item.order_index = index + 1;
          reordered.push(item);
        }
      });
      categories.forEach(c => {
        if (!orderedCatalogIds.includes(c.id)) reordered.push(c);
      });

      return {
        ...prev,
        skills: { ...skillsData, categories: reordered }
      };
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
        if (setting?.id) {
          const sc = setting.section_content || {};
          await supabase.from('site_settings').update({
            section_content: { ...sc, skills_catalogs: reordered },
            updated_at: new Date().toISOString()
          }).eq('id', setting.id);
        }
      } catch (err) {
        console.error("Failed to reorder skill catalogs in Supabase:", err);
      }
    }

    return { success: true };
  },

  // Save Subcategory
  async saveSkillSubcategory(catId, subcategoryName) {
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      const categories = (skillsData.categories || []).map(cat => {
        if (cat.id === catId) {
          const subs = cat.subcategories || [];
          if (!subs.includes(subcategoryName.trim())) {
            return { ...cat, subcategories: [...subs, subcategoryName.trim()] };
          }
        }
        return cat;
      });
      return {
        ...prev,
        skills: { ...skillsData, categories }
      };
    });
    return { success: true };
  },

  // Delete Subcategory
  async deleteSkillSubcategory(catId, subcategoryName) {
    persistStagedChange((prev) => {
      const skillsData = prev.skills || initialStaticData.skills;
      const categories = (skillsData.categories || []).map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            subcategories: (cat.subcategories || []).filter(s => s !== subcategoryName)
          };
        }
        return cat;
      });
      return {
        ...prev,
        skills: { ...skillsData, categories }
      };
    });
    return { success: true };
  },

  // Centralized Technology Tag Management
  async saveTechnologyTag(oldTag, newTag) {
    persistStagedChange((prev) => {
      const updatedProjects = (prev.projects?.items || []).map(p => {
        const tags = (p.tags || []).map(t => t === oldTag ? newTag : t);
        return { ...p, tags };
      });
      const updatedSkills = (prev.skills?.items || []).map(s => {
        const tools = (s.relatedTools || []).map(t => t === oldTag ? newTag : t);
        return { ...s, relatedTools: tools };
      });
      const updatedCats = (prev.skills?.categories || []).map(cat => ({
        ...cat,
        skills: (cat.skills || []).map(s => {
          const tools = (s.relatedTools || []).map(t => t === oldTag ? newTag : t);
          return { ...s, relatedTools: tools };
        })
      }));

      return {
        ...prev,
        projects: { ...prev.projects, items: updatedProjects },
        skills: { ...prev.skills, items: updatedSkills, categories: updatedCats }
      };
    });
    return { success: true };
  },

  async deleteTechnologyTag(tagToDelete) {
    persistStagedChange((prev) => {
      const updatedProjects = (prev.projects?.items || []).map(p => ({
        ...p,
        tags: (p.tags || []).filter(t => t !== tagToDelete)
      }));
      const updatedSkills = (prev.skills?.items || []).map(s => ({
        ...s,
        relatedTools: (s.relatedTools || []).filter(t => t !== tagToDelete)
      }));
      const updatedCats = (prev.skills?.categories || []).map(cat => ({
        ...cat,
        skills: (cat.skills || []).map(s => ({
          ...s,
          relatedTools: (s.relatedTools || []).filter(t => t !== tagToDelete)
        }))
      }));

      return {
        ...prev,
        projects: { ...prev.projects, items: updatedProjects },
        skills: { ...prev.skills, items: updatedSkills, categories: updatedCats }
      };
    });
    return { success: true };
  },

  // Save Education
  async saveEducation(edu) {
    persistStagedChange((prev) => {
      const existing = prev.education?.degrees || [];
      const idx = existing.findIndex(d => (d.id && d.id === edu.id));
      let updated;
      if (idx >= 0) {
        updated = [...existing];
        updated[idx] = { ...existing[idx], ...edu };
      } else {
        updated = [...existing, { ...edu, id: edu.id || `edu-${Date.now()}`, order_index: existing.length }];
      }
      return {
        ...prev,
        education: { ...prev.education, degrees: updated }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const payload = {
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location || '',
        period: edu.period,
        gpa: edu.gpa || '',
        honors: Array.isArray(edu.honors) ? edu.honors : [],
        description: edu.description || '',
        coursework: Array.isArray(edu.coursework) ? edu.coursework : [],
        extracurriculars: Array.isArray(edu.extracurriculars) ? edu.extracurriculars : [],
        order_index: edu.order_index ?? 0,
        is_published: true,
      };

      if (isUuid(edu.id)) {
        const { error } = await supabase.from('education').update(payload).eq('id', edu.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('education').insert([payload]);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save education in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete Education
  async deleteEducation(id) {
    persistStagedChange((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        degrees: (prev.education?.degrees || []).filter(d => d.id !== id)
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      if (isUuid(id)) {
        const { error } = await supabase.from('education').delete().eq('id', id);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete education in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Reorder Education Entries
  async reorderEducation(orderedDegrees) {
    const updated = orderedDegrees.map((item, idx) => ({ ...item, order_index: idx }));
    persistStagedChange((prev) => ({
      ...prev,
      education: { ...prev.education, degrees: updated }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      for (let i = 0; i < updated.length; i++) {
        const item = updated[i];
        if (isUuid(item.id)) {
          await supabase.from('education').update({ order_index: i }).eq('id', item.id);
        }
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to reorder education in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save Experience
  async saveExperience(exp) {
    persistStagedChange((prev) => {
      const existingIdx = prev.experience.roles.findIndex(r => r.id === exp.id);
      let updated = [...prev.experience.roles];
      if (existingIdx >= 0) updated[existingIdx] = { ...exp };
      else updated.push({ ...exp, id: exp.id || `exp-${Date.now()}` });
      return {
        ...prev,
        experience: { ...prev.experience, roles: updated }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const payload = {
        role: exp.role,
        organization: exp.organization,
        location: exp.location || '',
        period: exp.period || '',
        type: exp.type || 'Internship',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
        technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
        is_published: exp.is_published !== undefined ? Boolean(exp.is_published) : true,
      };

      if (isUuid(exp.id)) {
        const { error } = await supabase.from('experience').update(payload).eq('id', exp.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('experience').insert([payload]);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save experience in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete Experience
  async deleteExperience(id) {
    persistStagedChange((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        roles: prev.experience.roles.filter(r => r.id !== id)
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      if (isUuid(id)) {
        const { error } = await supabase.from('experience').delete().eq('id', id);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete experience in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save Achievement
  async saveAchievement(ach) {
    persistStagedChange((prev) => {
      const existingIdx = prev.achievements.items.findIndex(a => a.id === ach.id);
      let updated = [...prev.achievements.items];
      if (existingIdx >= 0) updated[existingIdx] = { ...ach };
      else updated.push({ ...ach, id: ach.id || `ach-${Date.now()}` });
      return {
        ...prev,
        achievements: { ...prev.achievements, items: updated }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const payload = {
        title: ach.title,
        issuer: ach.issuer,
        date: ach.date,
        description: ach.description || '',
        badge: ach.badge || '',
        is_published: ach.is_published !== undefined ? Boolean(ach.is_published) : true,
      };

      if (isUuid(ach.id)) {
        const { error } = await supabase.from('achievements').update(payload).eq('id', ach.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('achievements').insert([payload]);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save achievement in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete Achievement
  async deleteAchievement(id) {
    persistStagedChange((prev) => ({
      ...prev,
      achievements: {
        ...prev.achievements,
        items: prev.achievements.items.filter(a => a.id !== id)
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      if (isUuid(id)) {
        const { error } = await supabase.from('achievements').delete().eq('id', id);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete achievement in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save Site Settings
  async saveSiteSettings(settings) {
    persistStagedChange((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
      footer: {
        ...prev.footer,
        tagline: settings.footerTagline || prev.footer.tagline,
        copyrightNotice: settings.footerCopyright || prev.footer.copyrightNotice
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const sectionContentWithAppearance = {
        ...(settings.sectionContent || {}),
        sectionNames: settings.sectionNames || {},
        nav_visibility: settings.navVisibility || (settings.sectionContent && settings.sectionContent.nav_visibility) || {},
        appearance: {
          fontFamily: settings.fontFamily || 'roboto',
          fontSize: settings.fontSize || 'md',
          lineHeight: settings.lineHeight || 'normal',
          accentColor: settings.accentColor || 'neon-emerald',
          customAccentColor: settings.customAccentColor || '#2D3748',
          sections: settings.sectionAppearance || {},
        },
        sectionAppearance: settings.sectionAppearance || {},
      };

      const payload = {
        default_theme: settings.defaultTheme || 'dark',
        accent_color: settings.accentColor || 'neon-emerald',
        show_stats: settings.showStats ?? true,
        show_terminal: settings.showTerminal ?? true,
        show_leetcode: settings.showLeetcode ?? false,
        section_visibility: settings.sectionVisibility || { about: true, skills: true, education: true, projects: true, experience: true, contact: true },
        section_content: sectionContentWithAppearance,
        footer_tagline: settings.footerTagline,
        footer_copyright: settings.footerCopyright,
        updated_at: new Date().toISOString()
      };

      const { data: existing } = await supabase.from('site_settings').select('id').limit(1).maybeSingle();
      if (existing?.id) {
        const { error } = await supabase.from('site_settings').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([payload]);
        if (error) throw error;
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to persist site settings to Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Upload Asset (Image or CV) to Supabase Storage Bucket 'portfolio-assets'
  async uploadAsset(file, folder = 'avatars') {
    if (!isSupabaseConfigured || !supabase) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            publicUrl: reader.result,
            fileName: file.name,
            error: null
          });
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      return { publicUrl, fileName: file.name, error: null };
    } catch (error) {
      console.warn("Supabase storage upload note, using data URL fallback:", error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            publicUrl: reader.result,
            fileName: file.name,
            error: null
          });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // Update About Introduction (Subsection A)
  async updateAboutIntroduction({ whoIAmHeading, paragraphs, professionalSummary }) {
    persistStagedChange((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        whoIAmHeading: whoIAmHeading || prev.about?.whoIAmHeading || "Who I Am",
        paragraphs: paragraphs || prev.about?.paragraphs || [],
        professionalSummary: professionalSummary !== undefined ? professionalSummary : prev.about?.professionalSummary || '',
      },
      personal: {
        ...prev.personal,
        bioShort: professionalSummary || prev.personal?.bioShort || '',
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const payload = {
        who_i_am_heading: whoIAmHeading || 'Who I Am',
        bio_paragraphs: paragraphs || [],
        professional_summary: professionalSummary || '',
        updated_at: new Date().toISOString()
      };

      const { data: profile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      if (profile?.id) {
        await supabase.from('profiles').update(payload).eq('id', profile.id);
      } else {
        await supabase.from('profiles').insert([{ name: 'Nuwan Pinnaduwage', ...payload }]);
      }

      // Also update site_settings.section_content.about_who_i_am for redundancy
      const { data: setting } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
      if (setting?.id) {
        const sectionContent = {
          ...(setting.section_content || {}),
          about_who_i_am: whoIAmHeading || 'Who I Am',
        };
        await supabase.from('site_settings').update({ section_content: sectionContent }).eq('id', setting.id);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to update about introduction in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Update Profile Photograph (Subsection B)
  async updateProfilePhoto(avatarUrl) {
    persistStagedChange((prev) => ({
      ...prev,
      personal: { ...prev.personal, avatarUrl },
      about: { ...prev.about, profilePhotoUrl: avatarUrl }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const { data: profile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      if (profile?.id) {
        await supabase.from('profiles').update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() }).eq('id', profile.id);
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to update profile photo in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save Tech Stack Item (Subsection D)
  async saveTechStackItem(item) {
    persistStagedChange((prev) => {
      const currentList = prev.about?.techStack || [];
      const idx = currentList.findIndex(t => (t.id && t.id === item.id) || t.name === item.name);
      let updated;
      if (idx >= 0) {
        updated = [...currentList];
        updated[idx] = { ...currentList[idx], ...item };
      } else {
        updated = [...currentList, { ...item, id: item.id || `tech-${Date.now()}`, order_index: currentList.length }];
      }
      return {
        ...prev,
        about: { ...prev.about, techStack: updated }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const { data: profile } = await supabase.from('profiles').select('id, about_tech_stack').limit(1).maybeSingle();
      if (profile?.id) {
        const list = profile.about_tech_stack || [];
        const idx = list.findIndex(t => (t.id && t.id === item.id) || t.name === item.name);
        let updatedList;
        if (idx >= 0) {
          updatedList = [...list];
          updatedList[idx] = { ...list[idx], ...item };
        } else {
          updatedList = [...list, { ...item, id: item.id || `tech-${Date.now()}`, order_index: list.length }];
        }
        await supabase.from('profiles').update({ about_tech_stack: updatedList }).eq('id', profile.id);
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save tech stack item in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete Tech Stack Item (Subsection D)
  async deleteTechStackItem(idOrName) {
    persistStagedChange((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        techStack: (prev.about?.techStack || []).filter(t => t.id !== idOrName && t.name !== idOrName)
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const { data: profile } = await supabase.from('profiles').select('id, about_tech_stack').limit(1).maybeSingle();
      if (profile?.id && profile.about_tech_stack) {
        const updated = profile.about_tech_stack.filter(t => t.id !== idOrName && t.name !== idOrName);
        await supabase.from('profiles').update({ about_tech_stack: updated }).eq('id', profile.id);
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete tech stack item in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Reorder Tech Stack (Subsection D)
  async reorderTechStack(orderedItems) {
    const updated = orderedItems.map((item, idx) => ({ ...item, order_index: idx }));
    persistStagedChange((prev) => ({
      ...prev,
      about: { ...prev.about, techStack: updated }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const { data: profile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      if (profile?.id) {
        await supabase.from('profiles').update({ about_tech_stack: updated }).eq('id', profile.id);
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to reorder tech stack in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save Certificate (Subsection E)
  async saveCertificate(cert) {
    const certTitle = (cert.title || cert.name || '').trim();
    if (!certTitle) {
      return { success: false, error: 'Certificate title is required' };
    }

    const certIssuer = (cert.issuer || cert.issuing_organization || '').trim();
    const certYear = (cert.year || cert.date || cert.issue_date || '').trim();
    const certImage = (cert.image || cert.badge_url || cert.image_url || '').trim();
    const certUrl = (cert.credential_url || cert.credentialUrl || cert.verification_url || cert.url || '').trim();
    const certCredId = (cert.credential_id || cert.credentialId || '').trim();
    const certDesc = (cert.description || '').trim();
    
    const tagsArray = Array.isArray(cert.tags)
      ? cert.tags
      : (typeof cert.tags === 'string'
        ? cert.tags.split(',').map(t => t.trim()).filter(Boolean)
        : (Array.isArray(cert.skills)
          ? cert.skills
          : (typeof cert.skills === 'string' ? cert.skills.split(',').map(t => t.trim()).filter(Boolean) : [])));

    const normalizedCert = {
      id: cert.id || `cert-${Date.now()}`,
      title: certTitle,
      name: certTitle,
      issuer: certIssuer,
      issuing_organization: certIssuer,
      year: certYear,
      date: certYear,
      issue_date: certYear,
      tags: tagsArray,
      skills: tagsArray,
      image: certImage,
      badge_url: certImage,
      image_url: certImage,
      credential_url: certUrl,
      credentialUrl: certUrl,
      verification_url: certUrl,
      credential_id: certCredId,
      description: certDesc,
      order_index: cert.order_index ?? 0,
      is_published: cert.is_published !== undefined ? Boolean(cert.is_published) : true,
    };

    persistStagedChange((prev) => {
      const currentList = prev.about?.certificates || [];
      const idx = currentList.findIndex(c => (c.id && c.id === normalizedCert.id));
      let updated;
      if (idx >= 0) {
        updated = [...currentList];
        updated[idx] = { ...currentList[idx], ...normalizedCert };
      } else {
        updated = [...currentList, { ...normalizedCert, order_index: currentList.length }];
      }
      return {
        ...prev,
        about: { ...prev.about, certificates: updated }
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const payload = {
        title: certTitle,
        issuer: certIssuer,
        year: certYear,
        tags: tagsArray,
        image: certImage,
        credential_url: certUrl,
        order_index: cert.order_index ?? 0,
        is_published: cert.is_published !== undefined ? Boolean(cert.is_published) : true,
        updated_at: new Date().toISOString()
      };

      // 1. Try to upsert into dedicated certificates table
      try {
        if (isUuid(cert.id)) {
          await supabase.from('certificates').update(payload).eq('id', cert.id);
        } else {
          await supabase.from('certificates').insert([payload]);
        }
      } catch (e) {
        console.warn("Certificates table upsert:", e);
      }

      // 2. Also keep profiles.about_certificates in sync
      const { data: profile } = await supabase.from('profiles').select('id, about_certificates').limit(1).maybeSingle();
      if (profile?.id) {
        const certs = profile.about_certificates || [];
        const idx = certs.findIndex(c => c.id === normalizedCert.id);
        let updatedCerts;
        if (idx >= 0) {
          updatedCerts = [...certs];
          updatedCerts[idx] = { ...certs[idx], ...normalizedCert };
        } else {
          updatedCerts = [...certs, normalizedCert];
        }
        await supabase.from('profiles').update({ about_certificates: updatedCerts }).eq('id', profile.id);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save certificate in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete Certificate (Subsection E)
  async deleteCertificate(id) {
    persistStagedChange((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        certificates: (prev.about?.certificates || []).filter(c => c.id !== id)
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      if (isUuid(id)) {
        try {
          await supabase.from('certificates').delete().eq('id', id);
        } catch (e) {}
      }

      const { data: profile } = await supabase.from('profiles').select('id, about_certificates').limit(1).maybeSingle();
      if (profile?.id && profile.about_certificates) {
        const updated = profile.about_certificates.filter(c => c.id !== id);
        await supabase.from('profiles').update({ about_certificates: updated }).eq('id', profile.id);
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to delete certificate in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Reorder Certificates (Subsection E)
  async reorderCertificates(orderedCerts) {
    const updated = orderedCerts.map((cert, idx) => ({ ...cert, order_index: idx }));
    persistStagedChange((prev) => ({
      ...prev,
      about: { ...prev.about, certificates: updated }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      for (let i = 0; i < updated.length; i++) {
        const item = updated[i];
        if (isUuid(item.id)) {
          try {
            await supabase.from('certificates').update({ order_index: i }).eq('id', item.id);
          } catch (e) {}
        }
      }

      const { data: profile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      if (profile?.id) {
        await supabase.from('profiles').update({ about_certificates: updated }).eq('id', profile.id);
      }
      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to reorder certificates in Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save Contact Information, Form Settings, Display Settings & Social Links
  async saveContact(contactData) {
    persistStagedChange((prev) => {
      const mergedContact = {
        ...(prev.contact || initialStaticData.contact),
        ...contactData,
        formFields: {
          ...(prev.contact?.formFields || initialStaticData.contact.formFields),
          ...(contactData.formFields || {})
        },
        displaySettings: {
          ...(prev.contact?.displaySettings || initialStaticData.contact.displaySettings),
          ...(contactData.displaySettings || {})
        }
      };

      const updatedPersonal = { ...(prev.personal || initialStaticData.personal) };
      if (contactData.directEmail !== undefined) {
        updatedPersonal.email = contactData.directEmail;
      }
      if (contactData.location !== undefined) {
        updatedPersonal.location = contactData.location;
      }
      if (contactData.phone !== undefined) {
        updatedPersonal.phone = contactData.phone;
      }
      if (contactData.socialLinks !== undefined) {
        updatedPersonal.socialLinks = contactData.socialLinks;
      }

      return {
        ...prev,
        contact: mergedContact,
        personal: updatedPersonal
      };
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      // 1. Persist to Supabase site_settings
      const { data: existingSettings } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
      const currentSectionContent = existingSettings?.section_content || {};
      const updatedSectionContent = {
        ...currentSectionContent,
        contact: contactData
      };

      if (existingSettings?.id) {
        const { error } = await supabase.from('site_settings').update({
          section_content: updatedSectionContent,
          updated_at: new Date().toISOString()
        }).eq('id', existingSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([{
          section_content: updatedSectionContent,
          default_theme: 'dark',
          accent_color: 'emerald',
          updated_at: new Date().toISOString()
        }]);
        if (error) throw error;
      }

      // 2. Sync to Supabase profiles table
      const { data: existingProfile } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
      const profileUpdates = { updated_at: new Date().toISOString() };
      if (contactData.directEmail) profileUpdates.email = contactData.directEmail;
      if (contactData.location) profileUpdates.location = contactData.location;
      if (contactData.phone) profileUpdates.phone = contactData.phone;
      if (contactData.socialLinks) profileUpdates.social_links = contactData.socialLinks;

      if (existingProfile?.id) {
        await supabase.from('profiles').update(profileUpdates).eq('id', existingProfile.id);
      } else {
        await supabase.from('profiles').insert([{
          name: 'Nuwan Pinnaduwage',
          ...profileUpdates
        }]);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save contact to Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Save Footer Customization Settings
  async saveFooter(footerData) {
    persistStagedChange((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || initialStaticData.footer),
        ...footerData
      }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const { data: existingSettings } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
      const currentSectionContent = existingSettings?.section_content || {};
      const updatedSectionContent = {
        ...currentSectionContent,
        footer: footerData
      };

      const payload = {
        section_content: updatedSectionContent,
        footer_tagline: footerData.tagline || 'Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.',
        footer_copyright: footerData.copyrightNotice || '© 2026 Nuwan Pinnaduwage. All rights reserved.',
        updated_at: new Date().toISOString()
      };

      if (existingSettings?.id) {
        const { error } = await supabase.from('site_settings').update(payload).eq('id', existingSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([payload]);
        if (error) throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to save footer to Supabase:", error);
      return { success: false, error: error.message };
    }
  },

  // Reset Footer Customization Settings to Pristine Minimal Default
  async resetFooterToDefault() {
    persistStagedChange((prev) => ({
      ...prev,
      footer: { ...initialStaticData.footer }
    }));

    if (!isSupabaseConfigured || !supabase) {
      return { success: true, error: null };
    }

    try {
      const { data: existingSettings } = await supabase.from('site_settings').select('id, section_content').limit(1).maybeSingle();
      const currentSectionContent = existingSettings?.section_content || {};
      const updatedSectionContent = {
        ...currentSectionContent,
        footer: initialStaticData.footer
      };

      const payload = {
        section_content: updatedSectionContent,
        footer_tagline: initialStaticData.footer.tagline,
        footer_copyright: initialStaticData.footer.copyrightNotice,
        updated_at: new Date().toISOString()
      };

      if (existingSettings?.id) {
        const { error } = await supabase.from('site_settings').update(payload).eq('id', existingSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([payload]);
        if (error) throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Failed to reset footer in Supabase:", error);
      return { success: false, error: error.message };
    }
  }
};

// Helper: build skill categories using custom catalogs if defined
function buildCategoriesFromCatalogs(catalogs, rawSkills) {
  return catalogs.map(cat => ({
    ...cat,
    skills: rawSkills.filter(s => (s.catalog_id === cat.id || s.category_id === cat.id))
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  }));
}

// Helper: group flat skill rows into categories expected by the public skills component
function groupSkillsByCategory(skillRows) {
  if (!skillRows || skillRows.length === 0) {
    return initialStaticData.skills.categories;
  }

  // Normalize alternative aliases to canonical category keys without collapsing distinct domains
  const canonicalMap = {
    networking: 'network',
    cybersecurity: 'cyber_security',
    ml: 'machine_learning',
    artificial_intelligence: 'ai',
    mathematics: 'math_stats_research',
    programming: 'programming_languages',
    languages: 'programming_languages',
    tools_frameworks: 'tools',
    development_tools: 'tools'
  };

  const categoryMap = {
    network: {
      id: 'network',
      name: 'Networking',
      description: 'Computer networking architecture, protocol models, routing & switching, subnetting, and network administration.',
      order_index: 1,
      is_published: true,
      skills: []
    },
    cyber_security: {
      id: 'cyber_security',
      name: 'Cybersecurity',
      description: 'Offensive and defensive security practices, vulnerability identification, system hardening, and access control.',
      order_index: 2,
      is_published: true,
      skills: []
    },
    cs_fundamentals: {
      id: 'cs_fundamentals',
      name: 'Computer Science Fundamentals',
      description: 'Core software engineering, algorithms, data structures, systems programming, and foundational computing.',
      order_index: 3,
      is_published: true,
      skills: []
    }
  };

  skillRows.forEach(row => {
    let catId = row.catalog_id || row.category_id || 'network';
    if (canonicalMap[catId]) catId = canonicalMap[catId];
    if (!categoryMap[catId]) {
      categoryMap[catId] = {
        id: catId,
        name: row.catalog_name || row.category_name || getCategoryDisplayName(catId),
        description: 'Technical skills and competencies',
        order_index: Object.keys(categoryMap).length + 1,
        is_published: true,
        skills: []
      };
    }
    categoryMap[catId].skills.push({
      id: row.id,
      name: row.name,
      level: Math.min(100, Math.max(0, Number(row.level) || 0)),
      catalog_id: catId,
      category_id: catId,
      catalog_name: categoryMap[catId].name,
      category_name: categoryMap[catId].name,
      description: row.description || '',
      duration: row.duration || '',
      order_index: row.order_index || (categoryMap[catId].skills.length + 1),
      is_published: row.is_published !== undefined ? Boolean(row.is_published) : true,
      icon: row.icon || (catId === 'network' ? 'Network' : (catId === 'cyber_security' ? 'Shield' : 'FileCode'))
    });
  });

  return Object.values(categoryMap).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
}

function getCategoryDisplayName(catId) {
  switch (catId) {
    case 'network':
    case 'networking':
      return 'Networking';
    case 'cyber_security':
    case 'cybersecurity':
      return 'Cybersecurity';
    case 'cs_fundamentals':
    case 'fundamentals':
      return 'Computer Science Fundamentals';
    case 'ai':
    case 'artificial_intelligence':
      return 'Artificial Intelligence';
    case 'ml':
    case 'machine_learning':
      return 'Machine Learning';
    case 'math_stats_research':
    case 'mathematics':
      return 'Mathematical and Statistical Research';
    case 'programming_languages':
    case 'languages':
    case 'programming':
      return 'Programming Languages';
    case 'tools':
    case 'tools_frameworks':
    case 'development_tools':
      return 'Development Tools and Frameworks';
    default:
      return catId.charAt(0).toUpperCase() + catId.slice(1).replace(/_/g, ' ');
  }
}
