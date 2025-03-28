import { Header } from '../components/Header';
import { ResourceCategories } from '../components/resources/ResourceCategories';
import { ResourceList } from '../components/resources/ResourceList';
import { ResourceSearch } from '../components/resources/ResourceSearch';
import { useResources } from '../hooks/useResources';

export function ResourcesPage() {
  const {
    resources,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
  } = useResources();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-gray-600">
            Access study materials, guides, and preparation tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ResourceCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className="lg:col-span-3">
            <ResourceSearch value={searchQuery} onChange={setSearchQuery} />
            <ResourceList resources={resources} />
          </div>
        </div>
      </main>
    </div>
  );
}