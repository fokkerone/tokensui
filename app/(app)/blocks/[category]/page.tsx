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
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

/**
 * Generate static paths for all categories
 */
export async function generateStaticParams(): Promise<{ category: string }[]> {
  const { blocksConfig } = await import('@/config/blocks');
  const params: { category: string }[] = [];

  for (const primaryCategory of blocksConfig) {
    if (!primaryCategory.published) continue;

    params.push({
      category: primaryCategory.slug,
    });
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category } = resolvedParams;

  const primaryCategory = getPrimaryCategory(`/blocks/${category}`);

  const title = primaryCategory ? `${primaryCategory.title} - Token UI Blocks` : 'Token UI Blocks';
  const description = primaryCategory?.description || 'Explore our collection of pre-built blocks.';

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

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { category } = resolvedParams;

  const primaryCategory = getPrimaryCategory(`/blocks/${category}`);

  if (!primaryCategory || !primaryCategory.sub) {
    notFound();
  }

  // Get all published subcategories with their blocks
  const subcategoriesWithBlocks = await Promise.all(
    primaryCategory.sub
      .filter((sub) => sub.published)
      .map(async (secondaryCategory) => {
        const blocks = await getBlocks(primaryCategory, secondaryCategory);
        return {
          category: secondaryCategory,
          blocks,
        };
      }),
  );

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
              <span className="font-medium text-foreground">{primaryCategory.title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-col gap-2.5 mb-8.5">
        <h1 className="text-2xl font-bold m-0">{primaryCategory.title}</h1>
        {primaryCategory.description && (
          <p className="text-base text-muted-foreground max-w-2xl">{primaryCategory.description}</p>
        )}
      </div>

      {/* Category Navigation */}
      <BlockNavigation category={category} allCategories={allCategories} level="category" />

      {/* Display each subcategory with its blocks */}
      {subcategoriesWithBlocks.map(({ category: secondaryCategory, blocks }) => (
        <div key={secondaryCategory.slug} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{secondaryCategory.title}</h2>
              {secondaryCategory.description && (
                <p className="text-sm text-muted-foreground mt-1">{secondaryCategory.description}</p>
              )}
            </div>
            <Link
              href={`/blocks/${primaryCategory.slug}/${secondaryCategory.slug}`}
              className="text-sm text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-8 lg:space-y-16">
            {blocks && blocks.length > 0 ? (
              blocks.map((block, index) => (
                <div key={block.slug || index} className="space-y-4">
                  <Link
                    href={`/blocks/${primaryCategory.slug}/${secondaryCategory.slug}/${block.slug}`}
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
      ))}
    </div>
  );
}
