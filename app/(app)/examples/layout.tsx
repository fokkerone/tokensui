import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Templates & Examples - toui',
  description:
    'Explore premium and free templates built with React, Next.js, Tailwind CSS. Complete projects ready to use in your applications.',
  openGraph: {
    title: 'Templates & Examples - toui',
    description:
      'Explore premium and free templates built with React, Next.js, Tailwind CSS. Complete projects ready to use in your applications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Templates & Examples - toui',
    description:
      'Explore premium and free templates built with React, Next.js, Tailwind CSS. Complete projects ready to use in your applications.',
  },
};

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
