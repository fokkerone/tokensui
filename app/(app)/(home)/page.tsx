'use client';

import React from 'react';
import { InfiniteBoxCarousel } from '@/registry/default/components/animated/sidescroller';
import { Container } from '@/registry/default/components/container/container';
import { TypingText } from '@/registry/default/ui/typing-text';
import AntigravityScene from '@/components/antigravity-scene';
import SiteHero from '@/components/site-hero';

export default function Page() {
  return (
    <>
      {/* Hero + AntigravityScene Block - 100vh scrollable */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        <AntigravityScene />
        <div className="relative z-10 h-[80vh] flex items-center">
          <SiteHero />
        </div>
      </div>

      <Container>
        <div className="flex w-1/2 h-60">
          <TypingText
            text="Google Antigravity Blinking CursorGoogle Antigravity is our agentic development platform, evolving the IDE into the agent-first era."
            className="text-4xl font-stretch-110%"
            speed={40}
            showCursor={true}
            cursorClassName="_"
          />
        </div>
      </Container>

      <section className="relativepy-16 mt-14">
        <div className="">
          <InfiniteBoxCarousel />
        </div>
      </section>
    </>
  );
}
