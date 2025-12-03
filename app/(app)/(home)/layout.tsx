import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'toui - UI Components & Animated Effects',
  description:
    'Open-source collection of UI components and animated effects built with React, Typescript, Tailwind CSS, and Motion. Pairs beautifully with shadcn/ui.',
  openGraph: {
    title: 'toui - UI Components & Animated Effects',
    description:
      'Open-source collection of UI components and animated effects built with React, Typescript, Tailwind CSS, and Motion.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'toui - UI Components & Animated Effects',
    description:
      'Open-source collection of UI components and animated effects built with React, Typescript, Tailwind CSS, and Motion.',
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
