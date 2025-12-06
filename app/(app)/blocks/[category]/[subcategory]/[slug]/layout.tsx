'use client';

import { PageScrollTop } from '@/components/page-scrolltop';

export default function SingleBlockLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Full-width layout without sidebar */}
      <main className="w-full">
        <div className="container-fluid py-5">{children}</div>
      </main>
      <PageScrollTop />
    </div>
  );
}
