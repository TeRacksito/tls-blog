import { ProtectedRoute } from '@/components/featured/auth/protected-route';
import PuckEditor from '@/components/featured/puck/puck-editor';

interface EditorPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { slug } = await params;

  return (
    <ProtectedRoute>
      <PuckEditor slug={slug} />
    </ProtectedRoute>
  );
}
