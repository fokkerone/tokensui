'use client';

import React from 'react';
import AntigravityScene from '@/components/antigravity-scene';
import SiteHero from '@/components/site-hero';

export default function Page() {
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
