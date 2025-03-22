export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-robot text-2xl text-primary"></i>
            <span className="text-xl font-bold text-foreground">
              AI Interviewer
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 AI Interviewer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
