const features = [
  {
    name: 'Instant Feedback',
    hasFeature: true,
  },
  {
    name: 'Unlimited Practice',
    hasFeature: true,
  },
  {
    name: 'Performance Analytics',
    hasFeature: true,
  },
  {
    name: 'Personalized Learning',
    hasFeature: true,
  },
  {
    name: '24/7 Availability',
    hasFeature: true,
  },
];

export default function Comparison() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
          Why AI Training Beats Going in Blind
        </h2>

        <div className="bg-card rounded-lg p-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-lg font-bold text-card-foreground">
              Feature
            </div>
            <div className="text-lg font-bold text-center text-card-foreground">
              AI-Interviewer
            </div>
            <div className="text-lg font-bold text-center text-card-foreground">
              No Training
            </div>
          </div>

          {features.map((feature, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 py-4 border-b last:border-0"
            >
              <div className="text-card-foreground">{feature.name}</div>
              <div className="text-center">
                <i className="fa-solid fa-check text-primary text-xl"></i>
              </div>
              <div className="text-center">
                <i className="fa-solid fa-xmark text-destructive text-xl"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
