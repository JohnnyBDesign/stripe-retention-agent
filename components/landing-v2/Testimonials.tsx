export default function Testimonials() {
  const testimonials = [
    {
      quote: "This system saved our team hours every week and made our workflows faster, clearer, and much easier to manage.",
      author: "Ryan Mitchell",
      role: "CEO",
      company: "Growth SaaS",
    },
    {
      quote: "Signal catches cancellations we would have missed. The approval queue means we stay in control of every message.",
      author: "Sarah Chen",
      role: "Head of Customer Success",
      company: "Analytics Co",
    },
    {
      quote: "Finally, a retention tool that doesn't require us to connect yet another ESP. Sending included is a game-changer.",
      author: "Michael Torres",
      role: "Founder",
      company: "DevTools Inc",
    },
  ];

  return (
    <section className="relative py-32 px-6 md:px-8 bg-canvas">
      <div className="mx-auto max-w-content">
        <div className="mb-16 text-center">
          <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-6">
            {'{TESTIMONIALS}'}
          </p>
          <h2 className="font-body text-[48px] leading-[1.1] font-normal tracking-tight text-white max-w-2xl mx-auto">
            Trusted by SaaS founders
          </h2>
          <p className="font-body text-[14px] text-muted-foreground mt-4">
            * Example testimonials for visual reference
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-panel rounded-sm p-8 border border-border/50"
            >
              <p className="font-body text-[16px] leading-relaxed text-white mb-8">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-body text-[16px] font-medium text-white mb-1">
                  {testimonial.author}
                </p>
                <p className="font-nav text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {testimonial.role} @ {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
