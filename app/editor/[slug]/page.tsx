import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import PuckEditor from '@/components/puck/PuckEditor';

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
