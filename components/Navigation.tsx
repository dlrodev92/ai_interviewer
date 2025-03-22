import AuthButton from '@/components/AuthButton';
import MobileMenu from '@/components/MobileMenu';

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-robot text-2xl text-primary"></i>
          <span className="text-xl font-bold text-foreground">
            AI Interviewer
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#comparison"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Why Choose Us
          </a>
          <a
            href="#interview-types"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Interview Types
          </a>
          <AuthButton />
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
