import ResetPasswordClient from '@/components/auth/ResetPasswordClient';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const resolvedParams = await params;
  const token = resolvedParams.token;
  
  return <ResetPasswordClient token={token} />;
} 