const stats = [
  {
    value: '85%',
    label: 'Higher Success Rate',
    icon: 'fa-clock',
    delay: '0',
  },
  {
    value: '10K+',
    label: 'Developers Trained',
    icon: 'fa-users',
    delay: '100',
  },
  {
    value: '1000+',
    label: 'Practice Questions',
    icon: 'fa-code',
    delay: '200',
  },
  {
    value: '4.9/5',
    label: 'User Rating',
    icon: 'fa-star',
    delay: '300',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 opacity-10">
          <i className="fa-solid fa-code text-6xl text-primary animate-float-slow"></i>
        </div>
        <div className="absolute top-1/2 right-10 opacity-10">
          <i className="fa-solid fa-terminal text-6xl text-primary animate-float-medium"></i>
        </div>
        <div className="absolute bottom-1/4 left-1/2 opacity-10">
          <i className="fa-solid fa-laptop-code text-6xl text-primary animate-float-fast"></i>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16 animate-fade-in">
          Why Interview Training Matters
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center transform hover:scale-105 transition-all duration-300"
              style={{
                animation: `fadeIn 0.5s ease-out ${stat.delay}ms forwards`,
                opacity: 0,
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group hover:bg-primary/20 transition-colors">
                <i
                  className={`fa-solid ${stat.icon} text-2xl text-primary group-hover:scale-110 transition-transform`}
                ></i>
              </div>
              <h3 className="text-4xl font-bold mb-2 text-foreground">
                {stat.value}
              </h3>
              <p className="text-muted-foreground relative">
                {stat.label}
                <span className="absolute -right-2 top-0 h-2 w-2 bg-primary rounded-full animate-ping"></span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
