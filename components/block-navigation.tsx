'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/registry/default/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/default/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlockItem } from '@/config/types';

interface NavigationItem {
  title: string;
  slug: string;
  sub?: {
    title: string;
    slug: string;
    blocks?: BlockItem[];
  }[];
}

interface BlockNavigationProps {
  category: string;
  subcategory?: string;
  currentBlockSlug?: string;
  prevBlock?: BlockItem | null;
  nextBlock?: BlockItem | null;
  allCategories: NavigationItem[];
  level: 'category' | 'subcategory' | 'block';
}

export function BlockNavigation({
  category,
  subcategory,
  currentBlockSlug,
  prevBlock,
  nextBlock,
  allCategories,
  level,
}: BlockNavigationProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory || '');
  const [selectedBlock, setSelectedBlock] = useState(currentBlockSlug || '');

  // Get current category object
  const currentCategory = allCategories.find((cat) => cat.slug === selectedCategory);
  const subcategories = currentCategory?.sub || [];

  // Get current subcategory object
  const currentSubcategory = subcategories.find((sub) => sub.slug === selectedSubcategory);
  const blocks = currentSubcategory?.blocks || [];

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    router.push(`/blocks/${newCategory}`);
  };

  const handleSubcategoryChange = (newSubcategory: string) => {
    setSelectedSubcategory(newSubcategory);
    router.push(`/blocks/${selectedCategory}/${newSubcategory}`);
  };

  const handleBlockChange = (newBlock: string) => {
    setSelectedBlock(newBlock);
    router.push(`/blocks/${selectedCategory}/${selectedSubcategory}/${newBlock}`);
  };

  return (
    <div className="flex flex-col gap-4 border-t border-b border-border py-4 my-6">
      {/* Navigation Dropdowns */}
      <div
        className={`grid grid-cols-1 gap-3 ${
          level === 'category'
            ? 'md:grid-cols-1'
            : level === 'subcategory'
              ? 'md:grid-cols-2'
              : 'md:grid-cols-3'
        }`}
      >
        {/* Category Select */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory Select - only show if we're at subcategory or block level */}
        {(level === 'subcategory' || level === 'block') && selectedSubcategory && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Subcategory</label>
            <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcat) => (
                  <SelectItem key={subcat.slug} value={subcat.slug}>
                    {subcat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Block Select - only show if we're at block level */}
        {level === 'block' && selectedBlock && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Block</label>
            <Select value={selectedBlock} onValueChange={handleBlockChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {blocks.map((block) => (
                  <SelectItem key={block.slug} value={block.slug}>
                    {block.name || block.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Previous/Next Navigation - only show at block level */}
      {level === 'block' && (prevBlock || nextBlock) && (
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex-1">
            {prevBlock ? (
              <Button variant="outline" asChild className="w-full justify-start">
                <Link href={`/blocks/${category}/${subcategory}/${prevBlock.slug}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <span className="truncate">{prevBlock.name || prevBlock.slug}</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="w-full justify-start">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <span>No previous</span>
              </Button>
            )}
          </div>

          <div className="flex-1">
            {nextBlock ? (
              <Button variant="outline" asChild className="w-full justify-end">
                <Link href={`/blocks/${category}/${subcategory}/${nextBlock.slug}`}>
                  <span className="truncate">{nextBlock.name || nextBlock.slug}</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled className="w-full justify-end">
                <span>No next</span>
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
