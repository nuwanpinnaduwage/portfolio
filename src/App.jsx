import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Public Pages
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminHeroPage from './pages/admin/AdminHeroPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminResearchPage from './pages/admin/AdminResearchPage';
import AdminSkillsPage from './pages/admin/AdminSkillsPage';
import AdminCertificatesPage from './pages/admin/AdminCertificatesPage';
import AdminEducationPage from './pages/admin/AdminEducationPage';
import AdminExperiencePage from './pages/admin/AdminExperiencePage';
import AdminOrganizationPage from './pages/admin/AdminOrganizationPage';
import AdminMediaLibraryPage from './pages/admin/AdminMediaLibraryPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminSectionVisibilityPage from './pages/admin/AdminSectionVisibilityPage';
import AdminContactPage from './pages/admin/AdminContactPage';
import AdminFooterPage from './pages/admin/AdminFooterPage';
import ProjectVisualEditorPage from './pages/admin/ProjectVisualEditorPage';
import HeroStudioPage from './pages/admin/HeroStudioPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<PublicPortfolioPage />} />

            {/* Public Individual Project Detail Route */}
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />

            {/* Private Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Dedicated Fullscreen Hero Visual Studio (Zero Dashboard Shell) */}
            <Route
              path="/admin/hero/studio"
              element={
                <AdminRoute>
                  <HeroStudioPage />
                </AdminRoute>
              }
            />

            {/* Dedicated Fullscreen Project Visual Studio (Zero Dashboard Shell) */}
            <Route
              path="/admin/projects/editor/:projectId"
              element={
                <AdminRoute>
                  <ProjectVisualEditorPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/projects/editor/new"
              element={
                <AdminRoute>
                  <ProjectVisualEditorPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/projects/editor"
              element={
                <AdminRoute>
                  <ProjectVisualEditorPage />
                </AdminRoute>
              }
            />

            {/* Protected Private Administrator Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              
              {/* 1. Dashboard */}
              <Route path="dashboard" element={<AdminDashboardPage />} />
              
              {/* 2. Content Management */}
              <Route path="hero" element={<AdminHeroPage />} />
              <Route path="about" element={<AdminAboutPage />} />
              <Route path="profile" element={<Navigate to="/admin/about" replace />} />
              <Route path="social-links" element={<Navigate to="/admin/about" replace />} />
              
              <Route path="skills" element={<AdminSkillsPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="research" element={<AdminResearchPage />} />
              <Route path="certificates" element={<AdminCertificatesPage />} />
              <Route path="experience" element={<AdminExperiencePage />} />
              <Route path="education" element={<AdminEducationPage />} />
              <Route path="contact" element={<AdminContactPage />} />
              
              {/* 3. Organization */}
              <Route path="organization" element={<AdminOrganizationPage />} />
              
              {/* 4. Media Library */}
              <Route path="media" element={<AdminMediaLibraryPage />} />
              
              {/* 5. Website Settings */}
              <Route path="section-visibility" element={<AdminSectionVisibilityPage />} />
              <Route path="footer" element={<AdminFooterPage />} />
              <Route path="appearance" element={<Navigate to="/admin/section-visibility" replace />} />
              <Route path="site-content" element={<Navigate to="/admin/section-visibility" replace />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Catch-all redirect to public portfolio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
