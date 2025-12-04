'use client';

import React from 'react';
import { InfiniteBoxCarousel } from '@/registry/default/components/animated/sidescroller';
import AntigravityScene from '@/components/antigravity-scene';
import SiteHero from '@/components/site-hero';

export default function Page() {
  return (
    <>
      {/* Hero + AntigravityScene Block - 100vh scrollable */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <AntigravityScene />
        <div className="relative z-10 h-[80vh]flex items-center">
          <SiteHero />
        </div>
      </div>

      <section className="relativepy-16 -mt-14">
        <div className="">
          <InfiniteBoxCarousel />
        </div>
      </section>
    </>
  );
}
