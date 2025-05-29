// app/dashboard/layout.tsx
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { userSettingsServer } from '@/services/server/userSettings';
import { Toaster } from 'sonner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  let userSettings = null;
  let userId = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      userId = user.id;
      userSettings = await userSettingsServer.getOrCreate(user.id);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      <div className="flex-1 p-8 h-auto">{children}</div>
      <Toaster />
    </div>
  );
}
