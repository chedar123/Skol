import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ForumLayout from '@/components/forum/ForumLayout';
import ThreadList from '@/components/forum/ThreadList';
import ThreadView from '@/components/forum/ThreadView';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface CategoryAndThreadPageProps {
  params: Promise<{
    categoryAndThread: string[];
  }>;
}

export async function generateMetadata({ params }: CategoryAndThreadPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const categoryAndThread = resolvedParams.categoryAndThread || [];
    
    if (categoryAndThread.length === 1) {
      // Kategorivy
      const slug = categoryAndThread[0];
      
      const category = await prisma.forumCategory.findUnique({
        where: { slug }
      });
      
      if (!category) {
        return {
          title: 'Kategori hittades inte | Forum | Slotskolan',
        };
      }
      
      return {
        title: `${category.name} | Forum | Slotskolan`,
        description: category.description || `Diskussioner om ${category.name} på Slotskolan.`,
      };
    } else if (categoryAndThread.length >= 3 && categoryAndThread[0] === 'thread') {
      // Trådvy
      const id = categoryAndThread[1];
      
      const thread = await prisma.thread.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              name: true
            }
          }
        }
      });
      
      if (!thread) {
        return {
          title: 'Tråd hittades inte | Slotskolan',
        };
      }
      
      return {
        title: `${thread.title} | ${thread.category.name} | Forum | Slotskolan`,
        description: `Diskussion om ${thread.title} i forumet på Slotskolan.`,
      };
    }
    
    return {
      title: 'Forum | Slotskolan',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Forum | Slotskolan',
    };
  }
}

export default async function CategoryAndThreadPage({ params }: CategoryAndThreadPageProps) {
  try {
    const resolvedParams = await params;
    const categoryAndThread = resolvedParams.categoryAndThread || [];
    
    console.log('Category and thread params:', categoryAndThread);
    
    // Hantera olika route-mönster
    if (categoryAndThread.length === 1) {
      // Visa kategori
      const slug = categoryAndThread[0];
      
      console.log(`Söker efter kategori med slug: "${slug}"`);
      
      const category = await prisma.forumCategory.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              threads: true
            }
          }
        }
      });
      
      if (!category) {
        console.error(`Kategori med slug "${slug}" hittades inte`);
        console.error('Tillgängliga kategorier:');
        const allCategories = await prisma.forumCategory.findMany();
        console.error(allCategories.map(c => `${c.name} (${c.slug})`).join(', '));
        notFound();
      }
      
      console.log('Visar kategori:', category.name);
      
      return (
        <ForumLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{category.name}</h1>
                {category.description && (
                  <p className="text-gray-600 mt-1">{category.description}</p>
                )}
              </div>
              
              <Link 
                href={`/forum/new?categoryId=${category.id}`}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ny tråd i denna kategori
              </Link>
            </div>
            
            {/* Skicka true för hideHeader för att dölja den duplicerade informationen */}
            <ThreadList categoryId={category.id} categorySlug={slug} hideHeader={true} />
          </div>
        </ForumLayout>
      );
    } else if (categoryAndThread.length === 2 && categoryAndThread[1] === 'new') {
      // Skapa ny tråd i en kategori
      const slug = categoryAndThread[0];
      
      const category = await prisma.forumCategory.findUnique({
        where: { slug },
      });
      
      if (!category) {
        console.error(`Kategori med slug "${slug}" hittades inte`);
        notFound();
      }
      
      console.log('Visar nytt tråd-formulär för kategori:', category.name);
      
      // Omdirigera till den allmänna nya tråd-sidan med categoryId som parameter
      redirect(`/forum/new?categoryId=${category.id}`);
    } else if (categoryAndThread.length === 2) {
      // Visa tråd baserat på kategori-slug och tråd-slug
      const categorySlug = categoryAndThread[0];
      const threadSlug = categoryAndThread[1];
      
      console.log(`Visar tråd med categorySlug: "${categorySlug}", threadSlug: "${threadSlug}"`);
      
      // Hämta kategorin först
      const category = await prisma.forumCategory.findUnique({
        where: { slug: categorySlug },
      });
      
      if (!category) {
        console.error(`Kategori med slug "${categorySlug}" hittades inte`);
        notFound();
      }
      
      console.log(`Hittade kategori: ${category.name} (${category.id})`);
      
      // Hämta alla trådar i kategorin för debugging
      const allThreadsInCategory = await prisma.thread.findMany({
        where: { categoryId: category.id },
        select: { id: true, slug: true, title: true }
      });
      
      console.log(`Alla trådar i kategorin:`, allThreadsInCategory.map(t => `${t.title} (${t.slug})`));
      console.log(`Söker efter tråd med slug: "${threadSlug}"`);
      
      // Hämta tråden baserat på kategori-id och exakt slug-matchning
      let thread = await prisma.thread.findFirst({
        where: {
          categoryId: category.id,
          slug: threadSlug
        }
      });
      
      // Om tråden inte hittas, försök med en mer flexibel sökning
      if (!thread) {
        console.log(`Tråd med exakt slug "${threadSlug}" hittades inte, försöker med flexibel sökning`);
        
        // Försök hitta tråden bara baserat på kategori och första delen av slug (ignorera suffix)
        const baseSlug = threadSlug.split('-')[0];
        thread = await prisma.thread.findFirst({
          where: {
            categoryId: category.id,
            slug: {
              startsWith: baseSlug
            }
          }
        });
      }
      
      if (!thread) {
        console.error(`Tråd med slug ${threadSlug} i kategori ${categorySlug} hittades inte`);
        notFound();
      }
      
      console.log(`Hittade tråd: ${thread.title} (${thread.id})`);
      
      return (
        <ForumLayout>
          <ThreadView threadId={thread.id} />
        </ForumLayout>
      );
    } else if (categoryAndThread.length >= 3 && categoryAndThread[0] === 'thread') {
      // Bakåtkompatibilitet - Omdirigera gamla thread/id/slug-format till nya kategori/tråd-formatet
      const id = categoryAndThread[1];
      const slug = categoryAndThread[2];
      
      console.log(`Omdirigerar gammal tråd-URL: thread/${id}/${slug}`);
      
      const thread = await prisma.thread.findUnique({
        where: { id },
        include: {
          category: true
        }
      });
      
      if (!thread) {
        console.error(`Tråd med ID ${id} hittades inte`);
        notFound();
      }
      
      // Omdirigera till det nya URL-formatet
      redirect(`/forum/${thread.category.slug}/${thread.slug}`);
    }
    
    // Om ingen match, gå tillbaka till forum
    console.log('Ingen matchande route, omdirigerar till /forum');
    redirect('/forum');
  } catch (error) {
    console.error('Error in CategoryAndThreadPage:', error);
    throw error;
  }
} 