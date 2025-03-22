import { Button } from '@/components/ui/button';
import { ArrowDownLeftIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[800px] bg-background overflow-hidden pt-24">
      {/* Animated Code Snippets
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-10 w-32 h-32 opacity-20 animate-float-slow">
          <pre className="text-primary text-xs rotate-12">
            {`function interview() {
              prepare();
              practice();
              succeed();
            }`}
          </pre>
        </div>
        <div className="absolute top-40 right-10 w-32 h-32 opacity-20 animate-float-medium">
          <pre className="text-primary text-xs -rotate-6">
            {`const confidence = {
              skills: "growing",
              ready: true
            };`}
          </pre>
        </div>
        <div className="absolute bottom-40 left-20 w-32 h-32 opacity-20 animate-float-fast">
          <pre className="text-primary text-xs rotate-3">
            {`while(practicing) {
              improve++;
            }`}
          </pre>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 relative flex flex-col md:flex-row items-center justify-center gap-16">
        <div className="text-center animate-fade-in-delay">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 flex flex-col justify-start items-start">
            <span className="relative inline-block mr-2 gradient-hero-text text-black">
              Train
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
          <p className="text-xl text-primary mb-8 animate-fade-in-delay-2">
            MockInterviewerAI – Your AI-powered interview coach for junior
            developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2">
            <Button
              size="lg"
              variant="default"
              className="w-full sm:w-auto px-8 py-6 text-lg hover:scale-105 transition-transform"
            >
              Try a Free Interview
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg group"
            >
              <i className="fa-solid fa-play mr-2 group-hover:animate-bounce"></i>{' '}
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 place-items-center animate-fade-in-delay w-3/4 md:w-1/2">
          <div className="col-span-2 w-72 h-72 relative group">
            <img
              src="/train_handraw.png"
              alt="Training Illustration"
              className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-05  blur-sm"
            />
            <ArrowRightIcon className="absolute bottom-0 right-0 w-0 h-0 text-primary group-hover:animate-pulse group-hover:w-12 group-hover:h-12 transition-all duration-500 group-hover:rotate-45" />
            <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:animate-pulse group-hover:text-4xl transition-all duration-500 group-hover:-rotate-20">Train!</p>
          </div>

          {/* Bottom Left Image - Hired */}
          <div className="relative w-64 h-64 group">
            <img
              src="/hired_handraw.png"
              alt="Hired Illustration"
              className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-2 blur-sm"
            />
            <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:animate-pulse group-hover:text-4xl transition-all duration-500 group-hover:-rotate-20">Hired!</p>
           
          </div>

          {/* Bottom Right Image - Confidence */}
          <div className="relative w-64 h-64 group ">
            <img
              src="/confidence_handraw.png"
              alt="Confidence Illustration"
              className="w-full h-full object-contain transform transition-transform group-hover:scale-105  image-delay-1 blur-sm"
            />
            <ArrowUpIcon className="absolute bottom-4 -left-6 w-0 h-0 text-primary group-hover:animate-pulse group-hover:w-12 group-hover:h-12 transition-all duration-500  group-hover:-rotate-65" />
            <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:animate-pulse group-hover:text-3xl transition-all duration-500 group-hover:-rotate-20">Confidence!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
