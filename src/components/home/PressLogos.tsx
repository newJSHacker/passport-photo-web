const pressBrands = ["Forbes", "TechCrunch", "The Guardian", "USA Today", "BBC"];

export function PressLogos() {
  return (
    <section className="border-y border-[#d5d5dc] bg-white py-10">
      <div className="container-main">
        <div className="flex flex-col items-center gap-8">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-grey">
            As seen in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {pressBrands.map((brand) => (
              <span
                key={brand}
                className="text-lg font-semibold tracking-tight text-navy/50"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
