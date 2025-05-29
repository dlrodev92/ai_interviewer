import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { userSettingsServer } from '@/services/server/userSettings';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import InterviewTypeGrid from '@/components/dashboard/InterviewTypeGrid';
import CreditsCard from '@/components/dashboard/CreditsCard';
import DashboardClient from '@/components/dashboard/Dasboard-Client';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  let creditsAvailable = 0;
  let userSettings = null;
  let userId = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      userId = user.id;
      userSettings = await userSettingsServer.getOrCreate(user.id);
      creditsAvailable = user.interviewTokenBalance;
    }
  }

  return (
    <div className="space-y-8 pt-6">
      <DashboardClient initialSettings={userSettings} userId={userId} />

      <DashboardHeader
        title="Choose Your Interview Type"
        description="Select the type of interview you want to practice today."
      />

      <InterviewTypeGrid creditsAvailable={creditsAvailable} />

      <CreditsCard creditsAvailable={creditsAvailable} />
    </div>
  );
}
