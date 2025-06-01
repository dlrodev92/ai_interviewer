'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  VideoIcon,
  MessageSquareTextIcon,
  CreditCardIcon,
  LogOutIcon,
  HeartHandshake,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import AuthButton from '@/components/AuthButton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const menuItems = [
  {
    title: 'Interviews',
    href: '/dashboard',
    icon: <VideoIcon className="h-5 w-5" />,
  },
  {
    title: 'My Feedback',
    href: '/dashboard/feedback',
    icon: <MessageSquareTextIcon className="h-5 w-5" />,
  },
  {
    title: 'Credits',
    href: '/dashboard/credits',
    icon: <CreditCardIcon className="h-5 w-5" />,
  },
  {
    title: 'Help Us',
    href: '/dashboard/help-us',
    icon: <HeartHandshake className="h-5 w-5" />,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'bg-foreground text-white  transition-all duration-300 ease-in-out relative h-auto',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-10 h-6 w-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-3 w-3" />
        ) : (
          <ChevronLeftIcon className="h-3 w-3" />
        )}
      </Button>

      <div
        className={cn('flex flex-col p-6', isCollapsed && 'items-center p-4')}
      >
        {/* Logo and app name */}
        <div className={cn('mb-8', isCollapsed && 'mb-10')}>
          <Link href="/" className="flex items-center gap-2">
            <i className="fa-solid fa-robot text-2xl text-primary"></i>
            {!isCollapsed && (
              <Image
                src="/logo.svg"
                width={100}
                height={100}
                alt="ai interviewer logo"
              />
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className={cn('space-y-1 mb-6', isCollapsed && 'w-full')}>
          {!isCollapsed && (
            <p className="text-xs uppercase text-white/50 font-medium mb-2 px-2">
              Main Menu
            </p>
          )}

          {menuItems.map((item) => {
            const isActive =
              (item.href === '/dashboard' && pathname === '/dashboard') ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isCollapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-white/80 hover:bg-white/10'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                {item.icon}
                {!isCollapsed && item.title}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10 my-4 w-full" />

        {/* Sign out button */}
        <div
          className={cn('mt-auto', isCollapsed && 'w-full flex justify-center')}
        >
          {isCollapsed ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => {
                //TODO handle sign out here or modify AuthButton
              }}
            >
              <LogOutIcon className="h-5 w-5" />
            </Button>
          ) : (
            <AuthButton />
          )}
        </div>
      </div>
    </div>
  );
}
