import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/registry/default/ui/breadcrumb';
import { getBlockBySlug, getPrimaryCategory, getAdjacentBlocks, getAllNavigationItems } from '@/lib/blocks';
import { BlockPreview } from '@/components/block-preview';
import { BlocksNavMobileToggle } from '@/components/blocks-nav-mobile-toggle';
import { BlocksNavToggle } from '@/components/blocks-nav-toggle';
import { BlockNavigation } from '@/components/block-navigation';

interface PageProps {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}

export const dynamicParams = false;

/**
 * Generate static paths for all blocks at build time
 */
export async function generateStaticParams(): Promise<{ category: string; subcategory: string; slug: string }[]> {
  const { blocksConfig } = await import('@/config/blocks');
  const params: { category: string; subcategory: string; slug: string }[] = [];

  // Iterate through all primary categories
  for (const primaryCategory of blocksConfig) {
    if (!primaryCategory.published || !primaryCategory.sub) continue;

    // Iterate through all secondary categories
    for (const secondaryCategory of primaryCategory.sub) {
      if (!secondaryCategory.published || !secondaryCategory.blocks) continue;

      // Iterate through all blocks
      for (const block of secondaryCategory.blocks) {
        if (!block.published) continue;

        params.push({
          category: primaryCategory.slug,
          subcategory: secondaryCategory.slug,
          slug: block.slug,
        });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, subcategory, slug } = resolvedParams;

  const primaryCategory = getPrimaryCategory(`/blocks/${category}`);
  const block = await getBlockBySlug(category, slug);

  if (!block || !primaryCategory) {
    return {
      title: 'Block Not Found',
      description: 'The requested block could not be found.',
    };
  }

  const title = `${block.name || slug} - ${primaryCategory.title} - Token UI Blocks`;
  const description = `View and copy the ${block.name || slug} block from the ${primaryCategory.title} category.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function SingleBlockPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { category, subcategory, slug } = resolvedParams;

  const primaryCategory = getPrimaryCategory(`/blocks/${category}`);
  const secondaryCategory = primaryCategory?.sub?.find((sub) => sub.slug === subcategory);
  const block = await getBlockBySlug(category, slug);

  if (!block || !primaryCategory || !secondaryCategory) {
    notFound();
  }

  // Get adjacent blocks for navigation
  const { prev, next } = await getAdjacentBlocks(category, subcategory, slug);

  // Get all navigation items for dropdowns
  const allCategories = getAllNavigationItems();

  return (
    <div className="container-fixed space-y-6 px-0 lg:px-6 transition-all duration-300">
      <div className="flex items-center gap-1.5 min-h-8 mb-2.5">
        <BlocksNavMobileToggle />
        <BlocksNavToggle />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/blocks">Blocks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/blocks/${primaryCategory.slug}`}>{primaryCategory.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/blocks/${primaryCategory.slug}/${secondaryCategory.slug}`}>
                  {secondaryCategory.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium text-foreground">{block.name || slug}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-2.5 mb-8.5">
        <h1 className="text-2xl font-bold m-0">{block.name || slug}</h1>
        <p className="text-base text-muted-foreground max-w-2xl">
          Single block view - Copy and use this block in your project
        </p>
      </div>

      {/* Block Navigation */}
      <BlockNavigation
        category={category}
        subcategory={subcategory}
        currentBlockSlug={slug}
        prevBlock={prev}
        nextBlock={next}
        allCategories={allCategories}
        level="block"
      />

      <div>
        <BlockPreview block={block} />
      </div>
    </div>
  );
}
