'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AuthButton from '@/components/AuthButton';
import { Menu } from 'lucide-react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of your fixed nav
      const bodyTop = document.body.getBoundingClientRect().top;
      const elemTop = element.getBoundingClientRect().top;
      const scrollTarget = elemTop - bodyTop - offset;

      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });

      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[240px] bg-card">
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              className="text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-4 p-4">
            <Button
              variant="ghost"
              className="justify-start text-card-foreground"
              onClick={() => scrollToSection('why_us')}
            >
              Why Choose Us
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-card-foreground"
              onClick={() => scrollToSection('demo')}
            >
              Demo
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-card-foreground"
              onClick={() => scrollToSection('interview-types')}
            >
              Interview Types
            </Button>
          </nav>

          {/* Auth */}
          <div className="mt-auto p-4">
            <AuthButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
