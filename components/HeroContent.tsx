import { Button } from '@/components/ui/button';
import UserStartSigningButton from './UserStartSigningButton';

export default function HeroContent() {
  return (
    <div className="text-center animate-fade-in-delay">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 flex flex-col justify-start items-start">
        <span className="relative inline-block mr-2 gradient-hero-text text-black">
          Practice
          <span className="strike-through-bar strike-delay-05 w-full"></span>
        </span>
        <span className="relative inline-block mr-2 gradient-hero-text">
          Build Confidence
          <span className="strike-through-bar strike-delay-1 w-full"></span>
        </span>
        <span className="relative inline-block mr-2 gradient-hero-text">
          Get Hired
          <span className="strike-through-bar strike-delay-2 w-full"></span>
        </span>
      </h1>
      <p className="text-xl text-primary mb-8 animate-fade-in-delay-2 text-left">
        Your AI-powered interview coach for
        <br />
        {/*todo make this stand out more */}
        <span className="text-3xl text-primary ">
          Junior Software Developers.
        </span>
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-start gap-4 animate-fade-in-delay-2">
        <UserStartSigningButton text="Try a Free Interview" />

        <a href="#demo">
          <Button
            size="lg"
            variant="intro"
            className="w-full sm:w-auto px-8 py-6 text-lg group"
          >
            <i className="fa-solid fa-play mr-2 group-hover:animate-bounce "></i>{' '}
            Watch Demo
          </Button>
        </a>
      </div>
    </div>
  );
}
