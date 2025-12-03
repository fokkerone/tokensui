import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UI Components - toui',
  description:
    'Browse our comprehensive collection of beautifully designed UI components. Built with React, Typescript, Tailwind CSS, and Motion.',
  openGraph: {
    title: 'UI Components - toui',
    description:
      'Browse our comprehensive collection of beautifully designed UI components. Built with React, Typescript, Tailwind CSS, and Motion.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UI Components - toui',
    description:
      'Browse our comprehensive collection of beautifully designed UI components. Built with React, Typescript, Tailwind CSS, and Motion.',
  },
};

export default function UILayout({ children }: { children: React.ReactNode }) {
  return children;
}
