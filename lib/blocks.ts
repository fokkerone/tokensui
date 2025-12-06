import { blocksConfig } from '@/config/blocks';
import { BlockItem, BlockPrimaryCategory, BlockSecondaryCategory } from '@/config/types';

// Get the active category from the current path
export function getPrimaryCategory(path: string): BlockPrimaryCategory | null {
  const pathSegments = path.split('/');

  if (pathSegments[1] === 'blocks') {
    // If there's a specific category in the URL, use it
    if (pathSegments[2]) {
      return blocksConfig.find((cat) => cat.slug === pathSegments[2]) || null;
    }
    // Default to the category marked as default when on /blocks
    return blocksConfig.find((cat) => cat.default === true) || null;
  }
  return null;
}

export function getSecondaryCategory(
  primaryCategory: BlockPrimaryCategory | null,
  path: string,
): BlockSecondaryCategory | null {
  if (!primaryCategory) return null;

  const pathSegments = path.split('/');

  if (pathSegments[1] === 'blocks') {
    // If there's a specific secondary category in the URL, use it
    if (pathSegments[3]) {
      return primaryCategory.sub?.find((cat) => cat.slug === pathSegments[3]) || null;
    }
    // Default to the first secondary category
    return primaryCategory.sub?.[0] || null;
  }
  return null;
}

/**
 * Get a single block by category and slug
 * Searches through all secondary categories of the primary category to find the block
 */
export async function getBlockBySlug(categorySlug: string, blockSlug: string): Promise<BlockItem | null> {
  // Find the primary category
  const primaryCategory = blocksConfig.find((cat) => cat.slug === categorySlug);

  if (!primaryCategory || !primaryCategory.sub) return null;

  // Search through all published secondary categories for the block
  for (const secondaryCategory of primaryCategory.sub) {
    if (!secondaryCategory.published) continue;

    const blocks = await getBlocks(primaryCategory, secondaryCategory);
    const block = blocks.find((b) => b.slug === blockSlug);

    if (block) {
      return block;
    }
  }

  return null;
}

/**
 * Get previous and next blocks in the same subcategory
 */
export async function getAdjacentBlocks(
  categorySlug: string,
  subcategorySlug: string,
  currentBlockSlug: string,
): Promise<{ prev: BlockItem | null; next: BlockItem | null }> {
  const primaryCategory = blocksConfig.find((cat) => cat.slug === categorySlug);
  const secondaryCategory = primaryCategory?.sub?.find((sub) => sub.slug === subcategorySlug);

  if (!primaryCategory || !secondaryCategory) {
    return { prev: null, next: null };
  }

  const blocks = await getBlocks(primaryCategory, secondaryCategory);
  const currentIndex = blocks.findIndex((b) => b.slug === currentBlockSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? blocks[currentIndex - 1] : null,
    next: currentIndex < blocks.length - 1 ? blocks[currentIndex + 1] : null,
  };
}

/**
 * Get all published categories, subcategories, and blocks for navigation
 */
export function getAllNavigationItems() {
  return blocksConfig
    .filter((cat) => cat.published)
    .map((primaryCategory) => ({
      ...primaryCategory,
      sub: primaryCategory.sub
        ?.filter((sub) => sub.published)
        .map((secondaryCategory) => ({
          ...secondaryCategory,
          blocks: secondaryCategory.blocks?.filter((block) => block.published) || [],
        })),
    }));
}

// Get blocks from cache - loads cached blocks JSON and returns as object
export async function getBlocks(
  primaryCategory: BlockPrimaryCategory | null,
  secondaryCategory: BlockSecondaryCategory | null,
): Promise<BlockItem[]> {
  if (!primaryCategory || !secondaryCategory) return [];

  // Build cache key from category slugs
  const cacheKey = `${primaryCategory.slug}.${secondaryCategory.slug}`;

  try {
    // Load and resolve cached blocks JSON to object
    const cachedBlocks = await import(`@/registry/.cache/default/blocks/${cacheKey}.json`, {
      assert: { type: 'json' },
    });

    const plainData = JSON.parse(JSON.stringify(cachedBlocks.default || cachedBlocks));

    // Return the blocks array from cache
    return plainData.blocks || [];
  } catch (error) {
    console.warn(`Failed to load blocks cache for ${cacheKey}:`, error);
    return [];
  }
}
