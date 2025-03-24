import { ArrowRightIcon, ArrowUpIcon } from 'lucide-react';


export default function ImageGrid() {
  return (
    <div className="grid grid-cols-2 gap-8 place-items-center animate-fade-in-delay w-3/4 md:w-1/2">
  
      <div className="col-span-2 w-72 h-72 relative group">
        <img
          src="/train_handraw.png"
          alt="Training Illustration"
          className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-05 blur-sm"
        />
        <ArrowRightIcon className="absolute bottom-0 right-0 w-0 h-0 text-primary group-hover:animate-pulse group-hover:w-12 group-hover:h-12 transition-all duration-500 group-hover:rotate-45" />
        <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:animate-pulse group-hover:text-4xl transition-all duration-500 group-hover:-rotate-20">
          Practice!
        </p>
      </div>

      <div className="relative w-64 h-64 group">
        <img
          src="/hired_handraw.png"
          alt="Hired Illustration"
          className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-2 blur-sm"
        />
        <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:animate-pulse group-hover:text-4xl transition-all duration-500 group-hover:-rotate-20">
          Hired!
        </p>
      </div>

      <div className="relative w-64 h-64 group">
        <img
          src="/confidence_handraw.png"
          alt="Confidence Illustration"
          className="w-full h-full object-contain transform transition-transform group-hover:scale-105 image-delay-1 blur-sm"
        />
        <ArrowUpIcon className="absolute bottom-4 -left-6 w-0 h-0 text-primary group-hover:animate-pulse group-hover:w-12 group-hover:h-12 transition-all duration-500 group-hover:-rotate-65" />
        <p className="absolute top-0 left-0 text-primary text-[0px] group-hover:animate-pulse group-hover:text-3xl transition-all duration-500 group-hover:-rotate-20">
          Confidence!
        </p>
      </div>
    </div>
  );
} 