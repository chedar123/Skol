"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ForumLayout from '@/components/forum/ForumLayout';
import { Plus, Trash2, AlertTriangle, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  _count?: {
    threads: number;
  };
}

export default function AdminForumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);

  // Kontrollera behörigheter
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'MODERATOR')) {
      router.push('/forum');
      toast.error('Du har inte behörighet att visa denna sida');
    }
  }, [session, status, router]);
  
  // Hämta kategorier
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/forum/categories');
        
        if (!response.ok) {
          throw new Error('Kunde inte hämta forum-kategorier');
        }
        
        const data = await response.json();
        setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Ett fel uppstod vid hämtning av kategorier');
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.user) {
      fetchCategories();
    }
  }, [session]);
  
  // Hantera ändringar i formuläret för ny kategori
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generera slug från namnet om slug-fältet är tomt
    if (name === 'name' && !newCategory.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[åä]/g, 'a')
        .replace(/[ö]/g, 'o')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      setNewCategory({
        ...newCategory,
        name: value,
        slug,
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value,
      });
    }
  };
  
  // Skapa ny kategori
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name || !newCategory.slug) {
      toast.error('Namn och slug måste anges');
      return;
    }
    
    try {
      const response = await fetch('/api/forum/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          slug: newCategory.slug,
          order: categories.length,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Kunde inte skapa kategorin');
      }
      
      const data = await response.json();
      
      // Uppdatera listan med kategorier
      setCategories([...categories, data.category]);
      
      // Återställ formuläret
      setNewCategory({
        name: '',
        description: '',
        slug: '',
      });
      
      toast.success('Kategorin har skapats');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod');
    }
  };
  
  // Ta bort kategori
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/forum/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Kunde inte ta bort kategorin');
      }
      
      // Uppdatera listan med kategorier
      setCategories(categories.filter(category => category.id !== categoryId));
      setShowDeleteConfirmation(null);
      
      toast.success('Kategorin har tagits bort');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(err instanceof Error ? err.message : 'Ett fel uppstod');
    }
  };
  
  // Flytta kategori uppåt
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    try {
      const newCategories = [...categories];
      const currentCategory = newCategories[index];
      const previousCategory = newCategories[index - 1];
      
      // Byt plats på kategorier
      newCategories[index - 1] = currentCategory;
      newCategories[index] = previousCategory;
      
      // Uppdatera order
      const updates = [
        fetch(`/api/forum/categories/${currentCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: index - 1 }),
        }),
        fetch(`/api/forum/categories/${previousCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: index }),
        }),
      ];
      
      await Promise.all(updates);
      setCategories(newCategories);
    } catch (err) {
      console.error('Error moving category:', err);
      toast.error('Kunde inte flytta kategorin');
    }
  };
  
  // Flytta kategori nedåt
  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1) return;
    
    try {
      const newCategories = [...categories];
      const currentCategory = newCategories[index];
      const nextCategory = newCategories[index + 1];
      
      // Byt plats på kategorier
      newCategories[index + 1] = currentCategory;
      newCategories[index] = nextCategory;
      
      // Uppdatera order
      const updates = [
        fetch(`/api/forum/categories/${currentCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: index + 1 }),
        }),
        fetch(`/api/forum/categories/${nextCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: index }),
        }),
      ];
      
      await Promise.all(updates);
      setCategories(newCategories);
    } catch (err) {
      console.error('Error moving category:', err);
      toast.error('Kunde inte flytta kategorin');
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <ForumLayout>
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Laddar...</p>
        </div>
      </ForumLayout>
    );
  }
  
  if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'MODERATOR')) {
    return null; // Kommer att omdirigeras av useEffect
  }
  
  return (
    <ForumLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hantera forum-kategorier</h1>
        </div>
        
        {/* Befintliga kategorier */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Befintliga kategorier</h2>
          
          {categories.length === 0 ? (
            <p className="text-gray-500 italic">Inga kategorier har skapats än.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.description || 'Ingen beskrivning'}</p>
                      <p className="text-gray-500 text-xs mt-1">Slug: {category.slug}</p>
                      <p className="text-gray-500 text-xs">Trådar: {category._count?.threads || 0}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={`p-2 rounded ${
                          index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Flytta upp"
                      >
                        <ArrowUp size={20} />
                      </button>
                      
                      <button 
                        onClick={() => handleMoveDown(index)}
                        disabled={index === categories.length - 1}
                        className={`p-2 rounded ${
                          index === categories.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Flytta ner"
                      >
                        <ArrowDown size={20} />
                      </button>
                      
                      <button 
                        onClick={() => setShowDeleteConfirmation(category.id)}
                        className="p-2 rounded text-red-600 hover:bg-red-50"
                        title="Ta bort"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Bekräfta borttagning */}
                  {showDeleteConfirmation === category.id && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 font-medium">Är du säker på att du vill ta bort denna kategori?</p>
                          <p className="text-red-700 text-sm mt-1">Alla trådar och inlägg i denna kategori kommer att tas bort permanent.</p>
                          
                          <div className="mt-3 flex space-x-3">
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Ja, ta bort
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirmation(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                              Avbryt
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Skapa ny kategori */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Skapa ny kategori</h2>
          
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Namn *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivning
              </label>
              <textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={newCategory.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">
                URL-vänligt namn, t.ex. "spelautomater" för URL:en /forum/spelautomater
              </p>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Skapa kategori
              </button>
            </div>
          </form>
        </div>
      </div>
    </ForumLayout>
  );
} 