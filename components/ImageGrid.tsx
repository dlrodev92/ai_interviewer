import { ArrowRightIcon, ArrowUpIcon } from 'lucide-react';

export default function ImageGrid() {
  return (
    <div className="grid grid-cols-2 gap-8 place-items-center animate-fade-in-delay w-3/4 md:w-1/2 relative z-10">
      <div className="col-span-2 w-72 h-72 relative group z-10">
        <div className="gradient-burst gradient-burst-sm opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <img
          src="/train_handraw.png"
          alt="Training Illustration"
          className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-05 relative z-10"
        />
        <ArrowRightIcon className="absolute bottom-0 right-0 w-0 h-0 text-primary group-hover:w-12 group-hover:h-12 group-hover:rotate-45 transition-all duration-500 z-20" />
        <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:text-4xl transition-all duration-500 z-20">
          Practice!
        </p>
      </div>

      <div className="relative w-64 h-64 group z-10">
        <div className="gradient-burst gradient-burst-sm opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <img
          src="/hired_handraw.png"
          alt="Hired Illustration"
          className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-2 relative z-10"
        />
        <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:text-4xl transition-all duration-500 z-20">
          Hired!
        </p>
      </div>

      <div className="relative w-64 h-64 group z-10">
        <div className="gradient-burst gradient-burst-sm opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <img
          src="/confidence_handraw.png"
          alt="Confidence Illustration"
          className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-1 relative z-10"
        />
        <ArrowUpIcon className="absolute bottom-4 -left-6 w-0 h-0 text-primary group-hover:w-12 group-hover:h-12 group-hover:-rotate-45 transition-all duration-500 z-20" />
        <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:text-3xl transition-all duration-500 z-20">
          Confidence!
        </p>
      </div>
    </div>
  );
}
