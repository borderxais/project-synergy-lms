import { useState, useMemo } from 'react';
import { ResourceItem } from '../types';
import { SAMPLE_RESOURCES } from '../data/resources';

export function useResources() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const resources = useMemo(() => {
    let filtered = SAMPLE_RESOURCES;

    if (selectedCategory) {
      filtered = filtered.filter(
        (resource) => resource.category === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return {
    resources,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
  };
}