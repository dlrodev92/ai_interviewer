import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      Welcome to this app
      <div>
        <Button>Click me</Button>
      </div>
    </div>
  );
}
