import { notFound } from 'next/navigation';
import { getEditionById } from '@/lib/api';
import EditionDetailClient from '@/components/EditionDetailClient';

export default async function EditionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const edition = await getEditionById(id);
  
  if (!edition) {
    notFound();
  }

  return <EditionDetailClient edition={edition} />;
}