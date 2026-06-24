const reasons = [
  {
    title: "Save Money",
    text: "Ditch expensive photo booths and professional photo studios without sacrificing quality.",
  },
  {
    title: "Save Time",
    text: "No need to step outside.",
  },
  {
    title: "Unlimited Retakes",
    text: "Take multiple shots and pick your best one.",
  },
  {
    title: "Quality",
    text: "With 11 years of professional service and a Trustpilot rating of 4.5/5 from over 7,000 reviews, we mean business.",
  },
  {
    title: "Guaranteed Satisfaction",
    text: "We offer a 100% acceptance guarantee. If your passport photos aren't accepted, we'll make it right, and you'll get double your money back.",
  },
  {
    title: "Download Our App",
    text: "Available on iOS and Android, our app brings the full capabilities of Digital Passport Photos to your fingertips.",
  },
];

export function WhyChoose() {
  return (
    <section className="section-padding bg-section">
      <div className="container-main max-w-[800px]">
        <h2 className="typography-h2">Why Choose Digital Passport Photos?</h2>
        <ul className="content-list mt-8">
          {reasons.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
