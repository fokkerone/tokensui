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
import { getBlocks, getPrimaryCategory, getAllNavigationItems } from '@/lib/blocks';
import { BlockPreview } from '@/components/block-preview';
import { BlocksNavMobileToggle } from '@/components/blocks-nav-mobile-toggle';
import { BlocksNavToggle } from '@/components/blocks-nav-toggle';
import { BlockNavigation } from '@/components/block-navigation';

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

export const dynamicParams = false;

/**
 * Generate static paths for all subcategories
 */
export async function generateStaticParams(): Promise<{ category: string; subcategory: string }[]> {
  const { blocksConfig } = await import('@/config/blocks');
  const params: { category: string; subcategory: string }[] = [];

  for (const primaryCategory of blocksConfig) {
    if (!primaryCategory.published || !primaryCategory.sub) continue;

    for (const secondaryCategory of primaryCategory.sub) {
      if (!secondaryCategory.published) continue;

      params.push({
        category: primaryCategory.slug,
        subcategory: secondaryCategory.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, subcategory } = resolvedParams;

  const primaryCategory = getPrimaryCategory(`/blocks/${category}`);
  const secondaryCategory = primaryCategory?.sub?.find((sub) => sub.slug === subcategory);

  const title = secondaryCategory
    ? `${secondaryCategory.title} - ${primaryCategory?.title} - Token UI Blocks`
    : 'Token UI Blocks';

  const description = secondaryCategory?.description || 'Explore our collection of pre-built blocks.';

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

export default async function SubcategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { category, subcategory } = resolvedParams;

  const primaryCategory = getPrimaryCategory(`/blocks/${category}`);
  const secondaryCategory = primaryCategory?.sub?.find((sub) => sub.slug === subcategory);

  if (!primaryCategory || !secondaryCategory) {
    notFound();
  }

  const blocks = await getBlocks(primaryCategory, secondaryCategory);

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
              <span className="font-medium text-foreground">{secondaryCategory.title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-2.5 mb-8.5">
        <h1 className="text-2xl font-bold m-0">{secondaryCategory.title}</h1>
        <p className="text-base text-muted-foreground max-w-2xl">{secondaryCategory.description}</p>
      </div>

      {/* Subcategory Navigation */}
      <BlockNavigation
        category={category}
        subcategory={subcategory}
        allCategories={allCategories}
        level="subcategory"
      />

      <div className="space-y-8 lg:space-y-16">
        {blocks && blocks.length > 0 ? (
          blocks.map((block, index) => (
            <div key={block.slug || index} className="space-y-4">
              <Link
                href={`/blocks/${category}/${subcategory}/${block.slug}`}
                className="inline-flex items-center gap-2 text-lg font-semibold hover:underline"
              >
                {block.name || block.slug}
              </Link>
              <BlockPreview block={block} />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No blocks found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
