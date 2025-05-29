import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoIcon, Mail, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { getUserInterviewTokens } from '@/services/server/userInterviewTokens';

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  linkText: string;
  linkHref: string;
  bgClasses: string;
  iconContainerClasses: string;
  textColorClasses: string;
  isCustomIcon?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({
  icon,
  title,
  linkText,
  linkHref,
  bgClasses,
  iconContainerClasses,
  textColorClasses,
  isCustomIcon = false,
}) => (
  <div
    className={`
    flex flex-col items-center text-center p-5 rounded-xl 
    shadow-sm hover:shadow-md transition-all 
    transform hover:scale-105 cursor-pointer
    border ${bgClasses}
  `}
  >
    <div
      className={`mb-3 w-12 h-12 flex items-center justify-center ${iconContainerClasses}`}
    >
      {isCustomIcon ? icon : <div className="h-6 w-6">{icon}</div>}
    </div>
    <h3 className="font-medium text-sm mb-1">{title}</h3>
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`${textColorClasses} text-sm font-medium hover:underline`}
    >
      {linkText}
    </a>
  </div>
);

export default async function CreditsPage() {
  const creditsAvailable = await getUserInterviewTokens();

  // Contact card configuration data
  const contactCards = [
    {
      icon: (
        <Image
          src="/X_icon_2.svg.png"
          alt="X (Twitter)"
          width={24}
          height={24}
        />
      ),
      title: 'X (Twitter)',
      linkText: '@dev_malafolla',
      linkHref: 'https://x.com/dev_malafolla',
      bgClasses: 'bg-white border-zinc-200',
      iconContainerClasses: 'bg-black p-2 rounded-md',
      textColorClasses: 'text-zinc-800 hover:text-zinc-600',
      isCustomIcon: true,
    },
    {
      icon: <Mail className="text-red-500" />,
      title: 'Email',
      linkText: 'Contact Us',
      linkHref: 'mailto:dlrdev92@gmail.com',
      bgClasses: 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100',
      iconContainerClasses: 'bg-red-100 p-3 rounded-full',
      textColorClasses: 'text-red-600 hover:text-red-700',
    },
    {
      icon: (
        <Image
          src="/linkeding-logo.png"
          alt="linkedin"
          width={24}
          height={24}
        />
      ),
      title: 'LinkedIn',
      linkText: 'Connect',
      linkHref: 'https://www.linkedin.com/in/david-lopez-b27691216/',
      bgClasses: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100',
      iconContainerClasses: 'bg-blue-100 p-3 rounded-full',
      textColorClasses: 'text-blue-600 hover:text-blue-700',
      isCustomIcon: true,
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Interview Credits"
        description="Manage your interview credits and subscription."
      />

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <InfoIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">MVP Notice</h3>
              <p className="text-yellow-700 text-sm">
                This is an MVP version of AI Interviewer. Currently in trial
                phase - if it goes well, additional tokens and features will be
                available in the full version.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Credits</CardTitle>
            <CardDescription>Available interview credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <span className="text-5xl font-bold">{creditsAvailable}</span>
              <p className="text-muted-foreground mt-2">credits remaining</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Purchase More Credits
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connect With Us</CardTitle>
            <CardDescription>
              Learn more about the full version of AI Interviewer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {/* Render contact cards using the reusable component */}
              {contactCards.map((card, index) => (
                <ContactCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  linkText={card.linkText}
                  linkHref={card.linkHref}
                  bgClasses={card.bgClasses}
                  iconContainerClasses={card.iconContainerClasses}
                  textColorClasses={card.textColorClasses}
                  isCustomIcon={card.isCustomIcon}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center text-muted-foreground w-full">
              Stay informed about new features and the full release coming soon
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
