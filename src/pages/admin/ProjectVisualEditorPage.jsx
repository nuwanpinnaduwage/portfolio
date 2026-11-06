import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import AdvancedProjectVisualEditor from '../../components/admin/AdvancedProjectVisualEditor';

/**
 * Dedicated Fullscreen Visual Studio Workspace Page.
 * Completely isolated from the AdminSuite dashboard layout shell.
 * Guarantees zero overlapping headers, zero visible sidebar bleed-through,
 * and pure 100dvh workspace isolation.
 */
export default function ProjectVisualEditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { portfolio, saveProject, uploadAsset } = usePortfolio();

  const projects = portfolio?.projects?.items || [];

  const initialProject = useMemo(() => {
    if (!projectId || projectId === 'new') {
      const timestamp = Date.now();
      return {
        id: `proj-${timestamp}`,
        title: 'Untitled Project',
        slug: `untitled-project-${timestamp}`,
        tagline: 'Technical engineering deep-dive and system implementation.',
        description: 'Comprehensive overview and validated benchmarks.',
        category: 'Cybersecurity',
        subcategory: '',
        status: 'In Progress',
        is_published: false,
        featured: false,
        sections: [
          {
            id: 'section-1',
            title: 'Project Overview',
            layout: 'single',
            columns: [
              {
                blocks: [
                  {
                    id: `b-${timestamp}-1`,
                    type: 'heading',
                    content: 'Project Overview',
                    fontFamily: 'Manrope',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#FFFFFF'
                  },
                  {
                    id: `b-${timestamp}-2`,
                    type: 'text',
                    content: 'Detail the problem statement, core engineering challenges, and system objectives...',
                    fontFamily: 'Roboto',
                    fontSize: '15px',
                    color: '#CBD5E1'
                  }
                ]
              }
            ]
          }
        ],
        attachments: [],
        gallery: [],
        customStyling: {
          smartScrollEnabled: true,
          smartScrollThreshold: 0.4
        }
      };
    }

    const found = projects.find(p => p.id === projectId || p.slug === projectId);
    if (found) return found;

    // Fallback if not found yet (e.g. reload before portfolio items resolve)
    return {
      id: projectId,
      title: 'Loading Project...',
      slug: projectId,
      sections: [],
      customStyling: {
        smartScrollEnabled: true,
        smartScrollThreshold: 0.4
      }
    };
  }, [projectId, projects]);

  return (
    <AdvancedProjectVisualEditor
      key={initialProject.id || projectId}
      initialProject={initialProject}
      onSave={async (payload) => {
        const res = await saveProject(payload);
        return res;
      }}
      onClose={() => navigate('/admin/projects')}
      uploadAsset={uploadAsset}
    />
  );
}
