import HeroContent from '@/components/HeroContent';
import HeroImageGrid from '@/components/HeroImageGrid';

export default function Hero() {
  return (
    <section className="relative min-h-[500px] bg-background overflow-hidden pt-24 border-4">
      <div className="max-w-7xl mx-auto px-4 pt-16 relative flex flex-col md:flex-row items-center justify-center gap-16">
        <HeroContent />
        <HeroImageGrid />
      </div>
    </section>
  );
}
