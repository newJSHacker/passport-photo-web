const stats = [
  {
    value: "1M+",
    label: "successful photo submissions",
  },
  {
    value: "99.7%",
    label: "acceptance rate by government agencies worldwide",
  },
  {
    value: "4.9/5",
    label: "star rating across app stores",
  },
];

export function Stats() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <h2 className="typography-h2 text-center">In Numbers:</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-sans text-[2.875rem] font-light leading-none text-brand md:text-[3.5rem]">
                {stat.value}
              </div>
              <p className="mx-auto mt-4 max-w-xs text-base leading-6 text-navy">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
