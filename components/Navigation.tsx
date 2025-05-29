import Link from 'next/link';
import Image from 'next/image';
import AuthButton from '@/components/AuthButton';
import MobileMenu from '@/components/MobileMenu';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export default async function Navigation() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  return (
    <header className=" top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-robot text-2xl text-primary"></i>
          <span className="text-xl font-bold text-foreground">
            <Image
              src="/logo.svg"
              width={100}
              height={100}
              alt="AI Interviewer Logo"
              priority
            />
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#why_us"
            scroll={true}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Why Choose Us
          </Link>

          <Link
            href="#demo"
            scroll={true}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo
          </Link>

          <Link
            href="#interview-types"
            scroll={true}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Interview Types
          </Link>

          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          )}

          <AuthButton />
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
