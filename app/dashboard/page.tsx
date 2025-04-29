'use client';

import Navigation from '@/components/Navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import InterviewTypeGrid from '@/components/dashboard/InterviewTypeGrid';
import CreditsCard from '@/components/dashboard/CreditsCard';

export default function Dashboard() {
  // TODO- In a real app, you would fetch this from an API or context
  const creditsAvailable = 3;

  return (
    <div className="min-h-screen bg-background">
     
      <Navigation />

     
      <main className="container mx-auto px-4 py-12 pt-28">

        <DashboardHeader 
          title="Choose Your Interview Type"
          description="Select the type of interview you want to practice today."
        />
        
        <InterviewTypeGrid />
        
        <CreditsCard creditsAvailable={creditsAvailable} />

      </main>
    </div>
  );
}