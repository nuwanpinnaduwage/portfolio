import React from 'react';
import HeroStudioPro from '../../components/admin/HeroStudioPro';

/**
 * Dedicated Fullscreen Hero Visual Studio Pro Workspace Page.
 * Completely isolated from the AdminSuite dashboard layout shell.
 * Guarantees zero overlapping headers, zero visible sidebar bleed-through,
 * and pure 100dvh workspace isolation matching Project Visual Studio.
 */
export default function HeroStudioPage() {
  return <HeroStudioPro />;
}
