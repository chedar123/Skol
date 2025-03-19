import { Metadata } from 'next';
import CreateThread from '@/components/forum/CreateThread';
import ForumLayout from '@/components/forum/ForumLayout';

export const metadata: Metadata = {
  title: 'Skapa ny tråd | Forum | Slotskolan',
  description: 'Starta en ny diskussion i Slotskolans forum.',
};

export default function NewThreadPage() {
  return (
    <div className="container py-8">
      <ForumLayout>
        <CreateThread />
      </ForumLayout>
    </div>
  );
} 