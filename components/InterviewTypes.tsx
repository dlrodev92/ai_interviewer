const types = [
  {
    title: 'Behavioral',
    description:
      'Master the art of sharing your experiences and soft skills effectively',
    icon: 'fa-comments',
    code: `const interview = {
  type: 'behavioral',
  skills: ['communication', 'leadership', 'teamwork']
};`,
  },
  {
    title: 'Code-Related',
    description:
      'Practice coding challenges with real-time feedback and explanations',
    icon: 'fa-code',
    code: `function solve(problem) {
  const solution = optimize(
    analyze(problem)
  );
  return solution;
}`,
  },
  {
    title: 'System Design',
    description:
      'Learn to design scalable systems and explain your architectural decisions',
    icon: 'fa-diagram-project',
    code: `class System {
  scale() {
    this.addLoadBalancer();
    this.distributeLoad();
  }
}`,
  },
];

export default function InterviewTypes() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Animated Code Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-10 w-40 opacity-5 animate-float-slow">
          <pre className="text-primary text-xs whitespace-pre-wrap">
            {types[0].code}
          </pre>
        </div>
        <div className="absolute top-1/2 -right-10 w-40 opacity-5 animate-float-medium">
          <pre className="text-primary text-xs whitespace-pre-wrap">
            {types[1].code}
          </pre>
        </div>
        <div className="absolute bottom-20 left-1/3 w-40 opacity-5 animate-float-fast">
          <pre className="text-primary text-xs whitespace-pre-wrap">
            {types[2].code}
          </pre>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16 animate-fade-in">
          Choose Your Interview Type
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {types.map((type, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg hover:shadow-xl transition-all cursor-pointer group relative"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 200}ms forwards`,
                opacity: 0,
              }}
            >
              <div className="absolute inset-0 bg-primary/5 rounded-lg transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
              <div className="relative">
                <div className="w-16 h-16 mb-6 bg-primary rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <i
                    className={`fa-solid ${type.icon} text-2xl text-primary-foreground`}
                  ></i>
                </div>
                <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors">
                  {type.title}
                </h3>
                <p className="text-muted-foreground">{type.description}</p>

                {/* Animated Corner Decoration */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-tr-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
