'use client';

import React from 'react';
import AntigravityScene from '@/components/antigravity-scene';
import SiteHero from '@/components/site-hero';

export default function Page() {
  // const components = componentsConfig.sidebarNav[1];

  // const highlightedComponents =
  //   components.items
  //     ?.filter((component) => component.highlight !== undefined)
  //     .sort((a, b) => {
  //       const aHighlight = a.highlight!;
  //       const bHighlight = b.highlight!;
  //       const aHasOrder = aHighlight.order !== undefined;
  //       const bHasOrder = bHighlight.order !== undefined;

  //       if (aHasOrder && bHasOrder) {
  //         return aHighlight.order! - bHighlight.order!;
  //       }
  //       if (aHasOrder) return -1;
  //       if (bHasOrder) return 1;
  //       return 0;
  //     })
  //     .filter((component) => component.highlight!.examples?.length > 0) || [];

  // State to track the currently open collapsible (null if none)
  // const [openComponent, setOpenComponent] = React.useState<string | null>(null);

  // Handler to toggle a specific collapsible
  // const handleOpenChange = (title: string) => (isOpen: boolean) => {
  //   setOpenComponent(isOpen ? title : null);
  // };

  return (
    <>
      <AntigravityScene />
      <div className="container relative z-10">
        <SiteHero />
        Homepage
      </div>
    </>
  );
}
