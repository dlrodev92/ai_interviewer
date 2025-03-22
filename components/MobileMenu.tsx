'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AuthButton from '@/components/AuthButton';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <i className="fa-solid fa-bars text-lg"></i>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[240px] bg-card">
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              className="text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <nav className="flex flex-col gap-4 p-4">
            <Button
              variant="ghost"
              className="justify-start text-card-foreground"
              onClick={() => scrollToSection('features')}
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-card-foreground"
              onClick={() => scrollToSection('comparison')}
            >
              Why Choose Us
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-card-foreground"
              onClick={() => scrollToSection('interview-types')}
            >
              Interview Types
            </Button>
          </nav>

          <div className="mt-auto p-4">
            <AuthButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
